import { NextResponse, NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

// Klaviyo API key from environment variables for security
const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY || '';
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID || '';
// Disable mock mode to ensure real API calls
const USE_MOCK_SUCCESS = false;

// In production, use Upstash Redis for rate limiting
// For development, create a simple fallback
let ratelimit: Ratelimit;

if (process.env.UPSTASH_REDIS_REST_URL) {
  // Use Upstash Redis when configured
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  });
  
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1h'), // 5 requests per hour per IP
    analytics: true,
    prefix: 'ratelimit:newsletter:',
  });
} else {
  // Simple in-memory fallback for development
  const ipRequestCounts = new Map<string, { count: number, resetAt: number }>();
  
  ratelimit = {
    limit: async (ip: string) => {
      const now = Date.now();
      const hourInMs = 60 * 60 * 1000;
      const resetAt = now + hourInMs;
      
      if (!ipRequestCounts.has(ip)) {
        ipRequestCounts.set(ip, { count: 1, resetAt });
        return { success: true, limit: 5, remaining: 4, reset: resetAt };
      }
      
      const record = ipRequestCounts.get(ip)!;
      
      // Reset counter if the time has expired
      if (now > record.resetAt) {
        ipRequestCounts.set(ip, { count: 1, resetAt });
        return { success: true, limit: 5, remaining: 4, reset: resetAt };
      }
      
      // If under limit, increment and allow
      if (record.count < 5) {
        record.count++;
        ipRequestCounts.set(ip, record);
        return { 
          success: true, 
          limit: 5, 
          remaining: 5 - record.count, 
          reset: record.resetAt 
        };
      }
      
      // Over limit
      return { 
        success: false, 
        limit: 5, 
        remaining: 0, 
        reset: record.resetAt 
      };
    }
  } as Ratelimit;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP from request headers
    const headersList = await headers();
    let ip = 'unknown';
    
    // Extract IP address
    const forwardedFor = headersList.get('x-forwarded-for');
    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim();
    }
    
    // Check if the request is from our site
    const origin = headersList.get('origin') || '';
    const allowedOrigins = [
      'http://localhost:3000',
      'https://asmperformancecars.co.uk',
      'https://www.asmperformancecars.co.uk'
    ];
    if (!allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: 'Unauthorized request' },
        { status: 403 }
      );
    }
    
    // Rate limiting check
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      );
    }

    const data = await request.json();
    const { name, email, honeypot } = data;
    
    // Check honeypot field if it exists
    if (honeypot) {
      return NextResponse.json(
        { message: 'Successfully subscribed to newsletter' },
        { status: 200 }
      );
    }
    
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Split the name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Verify Klaviyo credentials
    if (!KLAVIYO_API_KEY || !KLAVIYO_LIST_ID) {
      return NextResponse.json(
        { message: 'Newsletter service not properly configured' },
        { status: 500 }
      );
    }

    // Using the Klaviyo API (v3)
    try {
      // Step 1: Create the profile
      const profileResponse = await fetch('https://a.klaviyo.com/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'revision': '2023-09-15'
        },
        body: JSON.stringify({
          data: {
            type: 'profile',
            attributes: {
              email,
              first_name: firstName,
              last_name: lastName,
              properties: {
                signup_source: 'website_footer',
                ip_address: ip
              }
            }
          }
        })
      });

      const profileResponseText = await profileResponse.text();
      
      if (!profileResponse.ok) {
        return NextResponse.json(
          { message: 'Error creating subscriber profile: ' + profileResponseText },
          { status: profileResponse.status }
        );
      }
      
      let profileData;
      try {
        profileData = JSON.parse(profileResponseText);
      } catch (e) {
        return NextResponse.json(
          { message: 'Invalid response from newsletter service' },
          { status: 500 }
        );
      }

      // Step 2: Set the subscription status
      const profileId = profileData.data.id;
      
      const subscriptionResponse = await fetch(`https://a.klaviyo.com/api/profile-subscription-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'revision': '2023-09-15'
        },
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-status',
            attributes: {
              profile_id: profileId,
              email_marketing: {
                consent: 'SUBSCRIBED',
                consent_timestamp: new Date().toISOString(),
                method: 'WEBSITE_FORM'
              }
            }
          }
        })
      });

      const subscriptionResponseText = await subscriptionResponse.text();

      if (!subscriptionResponse.ok) {
        // We continue anyway because we want to add to the list
      }
      
      // Step 3: Add the profile to the list
      const listResponse = await fetch(`https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'revision': '2023-09-15'
        },
        body: JSON.stringify({
          data: [
            {
              type: 'profile',
              id: profileId
            }
          ]
        })
      });

      const listResponseText = await listResponse.text();
      
      if (!listResponse.ok) {
        return NextResponse.json(
          { message: 'Subscriber created but could not add to newsletter list: ' + listResponseText },
          { status: listResponse.status }
        );
      }

      return NextResponse.json(
        { message: 'Successfully subscribed to newsletter' },
        { status: 200 }
      );
    } catch (e) {
      return NextResponse.json(
        { message: 'Error connecting to newsletter service' },
        { status: 500 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { message: 'Error processing subscription request' },
      { status: 500 }
    );
  }
}
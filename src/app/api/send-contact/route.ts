import { NextResponse, NextRequest } from 'next/server';
import nodemailer from 'nodemailer';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';
import { verifyRecaptcha } from '@/utils/recaptcha';

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
    prefix: 'ratelimit:contact:',
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

    const {
      name,
      email,
      phone,
      subject,
      message,
      honeypot,
      recaptchaToken,
      recaptchaAction
    } = await request.json();

    // Check honeypot field to prevent spam
    if (honeypot) {
      // Return a fake success for bots
      return NextResponse.json({ success: true });
    }
    
    // Verify reCAPTCHA token
    const verification = await verifyRecaptcha(
      recaptchaToken,
      recaptchaAction,
      0.5 // minimum score threshold
    );
    
    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error || 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }
    
    // Log the score for monitoring (optional)
    console.log(`reCAPTCHA score for ${recaptchaAction}: ${verification.score}`);

    // Build email HTML content
    const htmlContent = `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <h2>Message:</h2>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr />
      <p><small>Sent from IP: ${ip}<br>
      Timestamp: ${new Date().toISOString()}</small></p>
    `;

    // Check if SMTP is not configured, silently return success
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    // Configure email transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send mail
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@asmperformancecars.co.uk',
      to: 'info@asmperformancecars.co.uk',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
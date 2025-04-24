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
    prefix: 'ratelimit:partex:',
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
    
    // Check honeypot field if present
    if (data.honeypot) {
      // Return success to the bot but don't actually process the form
      return NextResponse.json({ success: true });
    }
    
    // Verify reCAPTCHA token
    if (data.recaptchaToken) {
      const verification = await verifyRecaptcha(
        data.recaptchaToken,
        data.recaptchaAction || 'part_exchange',
        0.5 // minimum score threshold
      );
      
      if (!verification.success) {
        return NextResponse.json(
          { error: verification.error || 'reCAPTCHA verification failed' },
          { status: 400 }
        );
      }
      
      // Log the score for monitoring (optional)
      console.log(`reCAPTCHA score for ${data.recaptchaAction}: ${verification.score}`);
    } else if (process.env.NODE_ENV === 'production') {
      // In production, require reCAPTCHA token
      return NextResponse.json(
        { error: 'Verification required' },
        { status: 400 }
      );
    }
    
    const {
      name,
      email,
      phone,
      chosenVehicle,
      message,
      make,
      model,
      registration,
      mileage,
      gearbox,
      fuelType,
      carColor,
      interiorType,
      serviceHistory,
      previousOwners,
      hpiClear,
      conditionDescription,
      askingPrice
    } = data;

    const emailContent = `
      <h2>New Part Exchange Request</h2>
      
      <h3>Personal Details:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Chosen Vehicle:</strong> ${chosenVehicle}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}

      <h3>Part Exchange Details:</h3>
      <p><strong>Make:</strong> ${make}</p>
      <p><strong>Model:</strong> ${model}</p>
      <p><strong>Registration:</strong> ${registration}</p>
      <p><strong>Mileage:</strong> ${mileage}</p>
      <p><strong>Gearbox:</strong> ${gearbox}</p>
      <p><strong>Fuel Type:</strong> ${fuelType}</p>
      <p><strong>Car Color:</strong> ${carColor}</p>
      <p><strong>Interior Type:</strong> ${interiorType}</p>
      <p><strong>Service History:</strong> ${serviceHistory}</p>
      <p><strong>Previous Owners:</strong> ${previousOwners}</p>
      <p><strong>HPI Clear:</strong> ${hpiClear}</p>
      <p><strong>Condition:</strong> ${conditionDescription}</p>
      <p><strong>Asking Price:</strong> £${askingPrice}</p>
      <hr />
      <p><small>Sent from IP: ${ip}<br>
      Timestamp: ${new Date().toISOString()}</small></p>
    `;

    // Set up email transport
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      // Development fallback - log to console
      console.log('SMTP not configured - Development mode fallback');
      console.log('---------- EMAIL WOULD BE SENT ----------');
      console.log('To: info@asmperformancecars.co.uk');
      console.log('From:', process.env.SMTP_FROM || 'noreply@asmperformancecars.co.uk');
      console.log('Reply-To:', email);
      console.log('Subject: Part Exchange Request:', make, model);
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Phone:', phone);
      console.log('Message:', message);
      console.log('And other part exchange details...');
      console.log('----------------------------------------');
      
      // Return success
      return NextResponse.json({ success: true });
    }
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    // Compose email
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@asmperformancecars.co.uk',
      to: 'info@asmperformancecars.co.uk',
      replyTo: email,
      subject: `Part Exchange Request - ${make} ${model}`,
      html: emailContent,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    return NextResponse.json(
      { success: true, message: 'Part exchange request sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Part exchange error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error sending part exchange request' },
      { status: 500 }
    );
  }
} 
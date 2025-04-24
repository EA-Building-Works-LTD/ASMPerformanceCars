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
    prefix: 'ratelimit:detailing:',
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

    const body = await request.json();

    // Check honeypot field
    if (body.honeypot) {
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }
    
    // Verify reCAPTCHA token
    if (body.recaptchaToken) {
      const verification = await verifyRecaptcha(
        body.recaptchaToken,
        body.recaptchaAction || 'car_detailing',
        0.5 // minimum score threshold
      );
      
      if (!verification.success) {
        return NextResponse.json(
          { error: verification.error || 'reCAPTCHA verification failed' },
          { status: 400 }
        );
      }
      
      // Log the score for monitoring (optional)
      console.log(`reCAPTCHA score for ${body.recaptchaAction}: ${verification.score}`);
    } else if (process.env.NODE_ENV === 'production') {
      // In production, require reCAPTCHA token
      return NextResponse.json(
        { error: 'Verification required' },
        { status: 400 }
      );
    }

    // Set up email transport
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      // Development fallback - log to console
      console.log('SMTP not configured - Development mode fallback');
      console.log('---------- EMAIL WOULD BE SENT ----------');
      console.log('To: info@asmperformancecars.co.uk');
      console.log('From:', process.env.SMTP_FROM || 'noreply@asmperformancecars.co.uk');
      console.log('Reply-To:', body.email);
      console.log('Subject: New Car Detailing Booking Request');
      console.log('Name:', body.name);
      console.log('Email:', body.email);
      console.log('Phone:', body.phone);
      console.log('Make:', body.make);
      console.log('Model:', body.model);
      console.log('Registration:', body.registration);
      console.log('Year:', body.year);
      console.log('Service Type:', body.serviceType);
      console.log('Preferred Date:', body.preferredDate);
      console.log('Preferred Time:', body.preferredTime);
      console.log('Additional Notes:', body.additionalNotes);
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

    // Send email to admin
    const adminEmail = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@asmperformancecars.co.uk',
      to: process.env.SMTP_USER || 'info@asmperformancecars.co.uk',
      replyTo: body.email,
      subject: 'New Car Detailing Booking Request',
      html: `
        <h2>New Car Detailing Booking Request</h2>
        
        <h3>Personal Details</h3>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        
        <h3>Vehicle Details</h3>
        <p><strong>Make:</strong> ${body.make}</p>
        <p><strong>Model:</strong> ${body.model}</p>
        <p><strong>Registration:</strong> ${body.registration}</p>
        <p><strong>Year:</strong> ${body.year}</p>
        
        <h3>Service Details</h3>
        <p><strong>Service Type:</strong> ${body.serviceType}</p>
        <p><strong>Preferred Date:</strong> ${body.preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${body.preferredTime}</p>
        
        ${body.additionalNotes ? `
        <h3>Additional Notes</h3>
        <p>${body.additionalNotes}</p>
        ` : ''}
        
        <hr />
        <p><small>Sent from IP: ${ip}<br>
        Timestamp: ${new Date().toISOString()}</small></p>
      `,
    });

    // Send confirmation email to customer
    const customerEmail = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@asmperformancecars.co.uk',
      to: body.email,
      subject: 'Car Detailing Booking Request Received',
      html: `
        <h2>Thank You for Your Booking Request</h2>
        
        <p>Dear ${body.name},</p>
        
        <p>We have received your car detailing booking request. Here are the details:</p>
        
        <h3>Service Details</h3>
        <p><strong>Service Type:</strong> ${body.serviceType}</p>
        <p><strong>Preferred Date:</strong> ${body.preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${body.preferredTime}</p>
        
        <p>Our team will review your request and contact you shortly to confirm your appointment.</p>
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>ASM Performance Cars Team</p>
      `,
    });

    return NextResponse.json(
      { success: true, adminEmail, customerEmail },
      { status: 200 }
    );
  } catch (error) {
    console.error('Car detailing submission error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send booking request' },
      { status: 500 }
    );
  }
} 
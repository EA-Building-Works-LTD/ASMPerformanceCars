import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';
import { verifyRecaptcha } from '@/utils/recaptcha';

// Define validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required").max(20),
  vehicle: z.string().min(2, "Vehicle information is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  honeypot: z.string().optional(),
  recaptchaToken: z.string().optional(),
  recaptchaAction: z.string().optional(),
});

// Configure rate limiting
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
    prefix: 'ratelimit:enquiry:',
  });
} else {
  // Simple in-memory fallback for development
  console.warn("Using in-memory rate limiting - not suitable for production");
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
    // Get IP and origin from request headers
    const headersList = await headers();
    let ip = 'unknown';
    let origin = '';
    
    // Extract IP address
    const forwardedFor = headersList.get('x-forwarded-for');
    if (forwardedFor) {
      ip = forwardedFor.split(',')[0].trim();
    }
    
    // Extract origin
    origin = headersList.get('origin') || '';
    
    // Check if the request is from our site
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
    
    // Parse and validate form data
    const body = await request.json();
    
    // Check honeypot field - if filled, it's likely a bot
    if (body.honeypot && body.honeypot.length > 0) {
      // Return success to the bot but don't actually process the form
      return NextResponse.json({ success: true });
    }
    
    // Verify reCAPTCHA token
    const verification = await verifyRecaptcha(
      body.recaptchaToken,
      body.recaptchaAction,
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
    
    // Validate with Zod
    const validatedData = formSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validatedData.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, phone, vehicle, message } = validatedData.data;
    
    // Build email HTML content
    const htmlContent = `
      <h1>New Vehicle Enquiry</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Vehicle:</strong> ${vehicle}</p>
      <h2>Message:</h2>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr />
      <p><small>Sent from IP: ${ip}<br>
      Timestamp: ${new Date().toISOString()}</small></p>
    `;

    // Set up email transport
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      // Development fallback - log to console
      console.log('SMTP not configured - Development mode fallback');
      console.log('---------- EMAIL WOULD BE SENT ----------');
      console.log(htmlContent);
      console.log('IP:', ip);
      console.log('Timestamp:', new Date().toISOString());
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
    
    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@asmperformancecars.co.uk',
      to: 'sales@asmperformancecars.co.uk',
      replyTo: email,
      subject: `Vehicle Enquiry: ${vehicle}`,
      html: htmlContent,
    });
    
    // Log the enquiry (optional)
    console.log(`New enquiry from ${name} about ${vehicle}`);
    
    // Success response
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
} 
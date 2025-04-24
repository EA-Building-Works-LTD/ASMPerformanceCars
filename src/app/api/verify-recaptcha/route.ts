import { NextResponse, NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { verifyRecaptcha } from '@/utils/recaptcha';

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

    const { recaptchaToken, recaptchaAction } = await request.json();

    // Validate required fields
    if (!recaptchaToken || !recaptchaAction) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
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

    // Return success with score for client to use if needed
    return NextResponse.json({ 
      success: true,
      score: verification.score
    });
    
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return NextResponse.json(
      { error: 'Failed to verify reCAPTCHA' },
      { status: 500 }
    );
  }
} 
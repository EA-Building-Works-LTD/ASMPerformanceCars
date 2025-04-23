import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check honeypot field
    if (body.honeypot) {
      return NextResponse.json(
        { error: 'Bot detected' },
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
    console.error('Error sending car detailing booking:', error);
    return NextResponse.json(
      { error: 'Failed to send booking request' },
      { status: 500 }
    );
  }
} 
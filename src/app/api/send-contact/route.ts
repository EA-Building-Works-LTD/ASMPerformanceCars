import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      honeypot,
    } = await request.json();

    // Check honeypot field to prevent spam
    if (honeypot) {
      // Return a fake success for bots
      return NextResponse.json({ success: true });
    }

    // Build email HTML content
    const htmlContent = `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <h2>Message:</h2>
      <p>${message.replace(/\n/g, '<br>')}</p>
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
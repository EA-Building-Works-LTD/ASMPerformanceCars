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

    // Check if SMTP is not configured, log message instead
    const hasSmtp = process.env.EMAIL_SERVER && process.env.EMAIL_FROM;
    if (!hasSmtp) {
      console.log('No SMTP configured. Would have sent:', {
        to: 'recipient@example.com',
        from: 'noreply@example.com',
        subject: `Contact Form: ${subject}`,
        html: htmlContent
      });
      return NextResponse.json({ success: true });
    }

    // Configure email transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      secure: Boolean(process.env.EMAIL_SERVER_SECURE === 'true'),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Send mail
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO || process.env.EMAIL_FROM,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 
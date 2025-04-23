import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Check honeypot field - if it contains data, it's likely a bot
    if (data.honeypot) {
      console.log('Suspected bot submission - honeypot field filled');
      // Return success to avoid giving feedback to bots
      return NextResponse.json({ success: true });
    }
    
    const {
      registration,
      make,
      model,
      year,
      mileage,
      name,
      email,
      phone
    } = data;

    const emailContent = `
      <h2>New Valuation Request</h2>
      
      <h3>Personal Details:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>

      <h3>Vehicle Details:</h3>
      <p><strong>Registration:</strong> ${registration}</p>
      <p><strong>Make:</strong> ${make}</p>
      <p><strong>Model:</strong> ${model}</p>
      <p><strong>Year:</strong> ${year}</p>
      <p><strong>Mileage:</strong> ${mileage}</p>
    `;

    // Set up email transport
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      // Development fallback - log to console
      console.log('SMTP not configured - Development mode fallback');
      console.log('---------- EMAIL WOULD BE SENT ----------');
      console.log('To: info@asmperformancecars.co.uk');
      console.log('From:', process.env.SMTP_FROM || 'noreply@asmperformancecars.co.uk');
      console.log('Reply-To:', email);
      console.log('Subject: Valuation Request:', make, model);
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Phone:', phone);
      console.log('Registration:', registration);
      console.log('Make:', make);
      console.log('Model:', model);
      console.log('Year:', year);
      console.log('Mileage:', mileage);
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
      subject: `Valuation Request - ${make} ${model} (${registration})`,
      html: emailContent,
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Log the valuation request
    console.log(`New valuation request from ${name} for ${make} ${model} (${registration})`);
    
    return NextResponse.json(
      { success: true, message: 'Valuation request sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending valuation request:', error);
    return NextResponse.json(
      { error: 'Error sending valuation request' },
      { status: 500 }
    );
  }
} 
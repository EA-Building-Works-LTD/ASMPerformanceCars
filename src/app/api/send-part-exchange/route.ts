import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
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
    
    // Log the part exchange request (optional)
    console.log(`New part exchange request from ${name} for ${make} ${model}`);
    
    return NextResponse.json(
      { success: true, message: 'Part exchange request sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending part exchange request:', error);
    return NextResponse.json(
      { error: 'Error sending part exchange request' },
      { status: 500 }
    );
  }
} 
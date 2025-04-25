import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import nodemailer from 'nodemailer'

// Rate limiter: 5 submissions per hour
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour in milliseconds
  uniqueTokenPerInterval: 50, // Max 50 users per interval
  limit: 5,
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting - get IP from headers or use a fallback
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'anonymous'
    const { success, limit, remaining, reset } = await limiter.check(ip)
    
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
      )
    }
    
    // Parse request body
    const body = await request.json()
    const { 
      name, 
      phone, 
      pickupPostcode, 
      dropOffAddress, 
      price, 
      distance 
    } = body
    
    // Validate required fields
    if (!name || !phone || !pickupPostcode || !dropOffAddress || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate phone number (basic validation)
    const phoneRegex = /^(?:\+44|0)[0-9]{10,11}$/
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }
    
    // Send email notification
    const emailSent = await sendBookingEmail({
      name,
      phone,
      pickupPostcode,
      dropOffAddress,
      price,
      distance,
      timestamp: new Date().toISOString()
    })
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send booking notification' },
        { status: 500 }
      )
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Booking received successfully! We will contact you shortly.'
    })
    
  } catch (error) {
    console.error('Booking submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    )
  }
}

interface BookingData {
  name: string
  phone: string
  pickupPostcode: string
  dropOffAddress: string
  price: number
  distance?: number
  timestamp: string
}

async function sendBookingEmail(bookingData: BookingData): Promise<boolean> {
  try {
    // Get email configuration from environment variables - updated to match .env.local
    const emailFrom = process.env.SMTP_FROM || 'noreply@asmperformancecars.co.uk'
    const smtpUser = process.env.SMTP_USER
    // Default email notifications to the SMTP_USER if not specified
    const emailTo = process.env.EMAIL_NOTIFICATIONS || smtpUser || 'info@asmperformancecars.co.uk' 
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = parseInt(process.env.SMTP_PORT || '587')
    const smtpPass = process.env.SMTP_PASSWORD
    const smtpSecure = process.env.SMTP_SECURE === 'true'
    
    // Validate that all required email config is present
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('Email configuration missing:', { 
        host: !!smtpHost, 
        user: !!smtpUser, 
        pass: !!smtpPass 
      })
      return false
    }
    
    console.log('Attempting to send email with config:', { 
      host: smtpHost, 
      port: smtpPort, 
      secure: smtpSecure,
      user: smtpUser,
      from: emailFrom,
      to: emailTo
    })
    
    // Create nodemailer transport
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // use SMTP_SECURE env var instead of port check
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
    
    // Format distance display
    const distanceDisplay = bookingData.distance 
      ? `${bookingData.distance} miles` 
      : 'Not specified'
    
    // Create email content
    const emailSubject = `New Transportation Booking: ${bookingData.name}`
    const emailHtml = `
      <h2>New Car Transportation Booking</h2>
      <p>A new booking has been submitted through the website:</p>
      
      <h3>Customer Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${bookingData.name}</li>
        <li><strong>Phone:</strong> ${bookingData.phone}</li>
      </ul>
      
      <h3>Transportation Details:</h3>
      <ul>
        <li><strong>Pickup Postcode:</strong> ${bookingData.pickupPostcode}</li>
        <li><strong>Drop-off Address:</strong> ${bookingData.dropOffAddress}</li>
        <li><strong>Distance:</strong> ${distanceDisplay}</li>
        <li><strong>Price:</strong> £${bookingData.price}</li>
      </ul>
      
      <p><strong>Submitted at:</strong> ${new Date(bookingData.timestamp).toLocaleString()}</p>
      
      <p>Please contact the customer to arrange payment and confirm the booking details.</p>
    `
    
    // Send the email
    const info = await transporter.sendMail({
      from: `"ASM Performance" <${emailFrom}>`,
      to: emailTo,
      subject: emailSubject,
      html: emailHtml,
    })
    
    console.log('Email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

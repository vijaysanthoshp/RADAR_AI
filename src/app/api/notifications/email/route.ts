/**
 * Email Notification API Endpoint using Resend
 * Sends email alerts to emergency contacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || 'RADAR Alerts <alerts@radar-system.com>';

let resendClient: Resend | null = null;

// Only initialize if API key is present
if (resendApiKey) {
  resendClient = new Resend(resendApiKey);
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, priority } = await request.json();

    // Validate input
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!resendClient) {
      console.warn('Resend not configured - Email will be simulated');
      
      // Simulate email in development
      console.log(`📧 [SIMULATED EMAIL]`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Priority: ${priority || 'normal'}`);
      console.log(`Body Preview: ${html.substring(0, 100)}...`);
      
      return NextResponse.json({
        success: true,
        simulated: true,
        message: 'Email simulated (Resend not configured)',
        to,
      });
    }

    // Send email via Resend
    const emailResponse = await resendClient.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html,
    });

    console.log(`✅ Email sent to ${to} - ID: ${emailResponse.id}`);

    return NextResponse.json({
      success: true,
      simulated: false,
      messageId: emailResponse.id,
      to: to,
    });

  } catch (error: any) {
    console.error('Email Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send email',
        details: error.statusCode || 'unknown',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check email service status
export async function GET() {
  const isConfigured = !!resendApiKey;
  
  return NextResponse.json({
    service: 'Email via Resend',
    configured: isConfigured,
    fromEmail: fromEmail,
    message: isConfigured 
      ? 'Resend Email is configured and ready' 
      : 'Resend not configured - set RESEND_API_KEY in .env',
  });
}

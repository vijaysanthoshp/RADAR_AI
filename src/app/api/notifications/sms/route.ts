/**
 * SMS Notification API Endpoint using Twilio
 * Sends SMS alerts to emergency contacts
 */

import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: ReturnType<typeof twilio> | null = null;

// Only initialize if credentials are present
if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

export async function POST(request: NextRequest) {
  try {
    const { to, message, priority } = await request.json();

    // Validate input
    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, message' },
        { status: 400 }
      );
    }

    // Check if Twilio is configured
    if (!twilioClient || !twilioPhoneNumber) {
      console.warn('Twilio not configured - SMS will be simulated');
      
      // Simulate SMS in development
      console.log(`📱 [SIMULATED SMS]`);
      console.log(`To: ${to}`);
      console.log(`Message: ${message}`);
      console.log(`Priority: ${priority || 'normal'}`);
      
      return NextResponse.json({
        success: true,
        simulated: true,
        message: 'SMS simulated (Twilio not configured)',
        to,
      });
    }

    // Send SMS via Twilio
    const smsResponse = await twilioClient.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });

    console.log(`✅ SMS sent to ${to} - SID: ${smsResponse.sid}`);

    return NextResponse.json({
      success: true,
      simulated: false,
      messageId: smsResponse.sid,
      status: smsResponse.status,
      to: to,
    });

  } catch (error: any) {
    console.error('SMS Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send SMS',
        details: error.code || 'unknown',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check SMS service status
export async function GET() {
  const isConfigured = !!(accountSid && authToken && twilioPhoneNumber);
  
  return NextResponse.json({
    service: 'SMS via Twilio',
    configured: isConfigured,
    phoneNumber: twilioPhoneNumber ? `***${twilioPhoneNumber.slice(-4)}` : 'Not set',
    message: isConfigured 
      ? 'Twilio SMS is configured and ready' 
      : 'Twilio not configured - set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env',
  });
}

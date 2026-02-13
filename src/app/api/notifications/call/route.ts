/**
 * Phone Call Notification API Endpoint using Twilio Voice
 * Makes emergency phone calls with TTS messages
 */

import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const callbackUrl = process.env.NEXT_PUBLIC_APP_URL + '/api/notifications/call/callback';

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
      console.warn('Twilio not configured - Call will be simulated');
      
      // Simulate call in development
      console.log(`📞 [SIMULATED CALL]`);
      console.log(`To: ${to}`);
      console.log(`Message: ${message}`);
      console.log(`Priority: ${priority || 'urgent'}`);
      
      return NextResponse.json({
        success: true,
        simulated: true,
        message: 'Call simulated (Twilio not configured)',
        to,
      });
    }

    // Detect alert severity from message for voice customization
    const isCritical = message.includes('CRITICAL') || message.includes('RED');
    const isEmergency = message.includes('EMERGENCY') || message.includes('ORANGE');
    const isHighAlert = isCritical || isEmergency;
    
    // Use different voice properties for high alerts
    const voiceRate = isHighAlert ? 'medium' : 'slow';
    const voiceVolume = isHighAlert ? 'loud' : 'medium';
    
    // Create TwiML for the call with urgency-based customization
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    <prosody rate="${voiceRate}" volume="${voiceVolume}">
      ${escapeXml(message)}
    </prosody>
  </Say>
  <Gather numDigits="1" action="${callbackUrl}" method="POST" timeout="10">
    <Say voice="Polly.Joanna" language="en-US">
      <prosody rate="medium">
        Press 1 to acknowledge this alert. Press 2 to escalate to emergency services. Press 3 to repeat this message.
      </prosody>
    </Say>
  </Gather>
  <Say voice="Polly.Joanna">We did not receive your input. ${isHighAlert ? 'Please call back immediately or contact emergency services.' : 'Goodbye.'}</Say>
</Response>`;

    // Make the call via Twilio
    const callResponse = await twilioClient.calls.create({
      to: to,
      from: twilioPhoneNumber,
      twiml: twiml,
      statusCallback: callbackUrl,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    });

    console.log(`📞 Call initiated to ${to} - SID: ${callResponse.sid}`);

    return NextResponse.json({
      success: true,
      simulated: false,
      callId: callResponse.sid,
      status: callResponse.status,
      to: to,
    });

  } catch (error: any) {
    console.error('Call Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to initiate call',
        details: error.code || 'unknown',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check call service status
export async function GET() {
  const isConfigured = !!(accountSid && authToken && twilioPhoneNumber);
  
  return NextResponse.json({
    service: 'Voice Calls via Twilio',
    configured: isConfigured,
    phoneNumber: twilioPhoneNumber ? `***${twilioPhoneNumber.slice(-4)}` : 'Not set',
    message: isConfigured 
      ? 'Twilio Voice is configured and ready' 
      : 'Twilio not configured - set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env',
  });
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

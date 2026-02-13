/**
 * Twilio Voice Callback Handler
 * Handles user responses during emergency calls
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const digits = formData.get('Digits')?.toString();
    const callSid = formData.get('CallSid')?.toString();
    const callStatus = formData.get('CallStatus')?.toString();

    console.log(`📞 Call callback - SID: ${callSid}, Status: ${callStatus}, Digits: ${digits}`);

    // Handle user input
    let twiml = '<?xml version="1.0" encoding="UTF-8"?><Response>';

    if (digits === '1') {
      // Acknowledged
      console.log(`✅ Alert acknowledged via call ${callSid}`);
      twiml += '<Say voice="Polly.Joanna"><prosody rate="medium">Alert acknowledged. Thank you for responding. Please check on the patient immediately and take necessary action. Goodbye.</prosody></Say>';
      
      // TODO: Log acknowledgment to database
      // await logAlertAcknowledgment(callSid, 'acknowledged');
      
    } else if (digits === '2') {
      // Escalate to emergency services
      console.log(`🚨 Emergency escalation requested via call ${callSid}`);
      twiml += '<Say voice="Polly.Joanna"><prosody rate="medium" volume="loud">Emergency escalation confirmed. Please call 911 immediately. Notifying medical team now. Goodbye.</prosody></Say>';
      
      // TODO: Trigger emergency escalation
      // await escalateToEmergencyServices(callSid);
      
    } else if (digits === '3') {
      // Repeat message
      console.log(`🔁 Message repeat requested via call ${callSid}`);
      twiml += '<Redirect method="POST">/api/notifications/call/repeat</Redirect>';
      
    } else {
      // No input or invalid input
      twiml += '<Say voice="Polly.Joanna"><prosody rate="medium">Invalid input. Please contact the hospital or call 911 immediately if this is a critical emergency. Goodbye.</prosody></Say>';
    }

    twiml += '</Response>';

    return new NextResponse(twiml, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Call callback error:', error);
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna"><prosody rate="medium" volume="loud">An error occurred processing your response. This is an urgent medical alert. Please call 911 or contact the hospital immediately. Goodbye.</prosody></Say>
</Response>`;
    
    return new NextResponse(errorTwiml, {
      status: 500,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

// GET endpoint for status
export async function GET() {
  return NextResponse.json({
    service: 'Twilio Voice Callback Handler',
    message: 'This endpoint handles responses from emergency calls',
    supportedActions: {
      '1': 'Acknowledge alert',
      '2': 'Escalate to emergency services',
      '3': 'Repeat message',
    },
  });
}

import { Groq } from 'groq-sdk';
import { generatePatientData } from '@/lib/data-utils';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Generate fresh patient data for context
    const patientData = generatePatientData();
    const { urea, fluid, spo2: ppg } = patientData;

    const systemPrompt = `
    You are an expert Nephrologist and Critical Care AI Specialist.
    Analyze the following patient vitals:
    
    1. UREA: ${urea.risk} (Reason: ${urea.reason})
    2. FLUID (ECW/TBW): ${fluid.risk} (Reason: ${fluid.reason})
    3. PPG (SpO2): ${ppg.risk} (Reason: ${ppg.reason})
    
    TASK:
    - Synthesize these 3 signals into a comprehensive medical assessment.
    - Explain the physiological connections (e.g., how fluid overload affects oxygenation or kidney function).
    - Provide a detailed, actionable plan.
    `;

    // Prepend system prompt to the messages
    const conversation = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const completion = await groq.chat.completions.create({
      messages: conversation,
      model: 'llama-3.1-8b-instant', // Or another suitable model
    });

    const responseContent = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return Response.json({ content: responseContent });

  } catch (error) {
    console.error('Error in chat API:', error);
    return Response.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
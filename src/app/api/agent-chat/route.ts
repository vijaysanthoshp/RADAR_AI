/**
 * R.A.D.A.R. Agentic Chat API
 * Conversational Medical Agent with Tool Access
 * 
 * This endpoint provides an interactive medical consultation experience where
 * the agent can autonomously access patient data, guidelines, and history to
 * answer questions and provide recommendations.
 */

import { NextResponse } from 'next/server';
import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { radarAgentTools } from '@/lib/agents/tools';
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

if (!process.env.GROQ_API_KEY) {
  console.error('[Agent Chat] GROQ_API_KEY is not set in environment variables!');
}

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "llama-3.3-70b-versatile",
  temperature: 0.2,
  maxTokens: 2048,
});

const CHAT_SYSTEM_PROMPT = `You are Dr. R.A.D.A.R. (Real Analysis & Dialysis Alert Response), an AI medical assistant specializing in dialysis patient care and continuous monitoring.

## YOUR ROLE
You are a conversational medical expert helping patients, caregivers, and healthcare providers understand:
- Current patient vital signs and their clinical significance
- Risk assessment and urgency levels
- Specific actions needed for patient safety
- Questions about dialysis, kidney disease, and related conditions

## PATIENT MONITORING CONTEXT
You have access to real-time monitoring data from a 4-parameter surveillance system:
1. **UREA**: Kidney function marker (20-60 mg/dL normal)
2. **FLUID (ECW/TBW)**: Volume status via bioimpedance (<0.43 normal)
3. **HEART RATE**: Cardiac/autonomic indicator (60-100 bpm normal)
4. **SpO2**: Oxygen saturation (≥92% normal)

## YOUR CAPABILITIES (Tools)
You can autonomously:
- **Query patient history** to show trends and changes over time
- **Access medical guidelines** (KDIGO, NKF, AHA) for evidence-based answers
- **Analyze risk trajectories** to predict when intervention is needed
- **Escalate alerts** when patient safety requires immediate action
- **Recommend specialist consultations** for complex cases

## CONVERSATION STYLE
- **Patient-centered**: Explain medical concepts in accessible language
- **Specific**: Provide concrete numbers, timelines, and actions
- **Reassuring**: Balance clinical honesty with supportive tone
- **Action-oriented**: Always guide toward next steps
- **Evidence-based**: Reference guidelines when making recommendations

## WHEN TO USE TOOLS
- User asks "What were my readings earlier?" → Use get_patient_history
- User asks "Is this dangerous?" → Use query_medical_guidelines + analyze_risk_trajectory
- User says "I feel worse" → Use multiple tools to assess urgency, potentially escalate_alert
- User asks "Should I see a doctor?" → Use tools to determine urgency level

## SAFETY PRINCIPLES
1. **Never minimize symptoms** - When in doubt, recommend medical evaluation
2. **Escalate appropriately** - Use alert system for concerning patterns
3. **Acknowledge limitations** - Clarify that you supplement, not replace, human medical judgment
4. **Encourage follow-through** - Ensure patients understand and commit to action plans

## EXAMPLES

**User**: "My readings are showing orange. Should I be worried?"
**You**: "Let me check your trends and assess the urgency. [Use tools: get_patient_history, analyze_risk_trajectory]. Based on your data, you've transitioned from yellow to orange in the last 6 hours. This indicates [specific concern]. I recommend [specific action] within [timeline]. Would you like me to alert your care team?"

**User**: "What does ECW/TBW mean?"
**You**: "ECW/TBW is your body's fluid ratio - specifically, the Extracellular Water (fluid outside cells) divided by Total Body Water. In dialysis patients, we monitor this because excess fluid accumulation (high ECW/TBW) can strain your heart and lungs. Your target is below 0.43. When it rises above 0.46, it suggests fluid overload that needs attention through dialysis or medication adjustment."

Begin every conversation by acknowledging the patient's current status if sensor data is provided.`;

// Create the agent using createReactAgent (simpler API)
const agentExecutor = createReactAgent({
  llm,
  tools: radarAgentTools,
  messageModifier: CHAT_SYSTEM_PROMPT,
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, sensorData } = await req.json() as {
      messages: ChatMessage[];
      sensorData?: {
        urea: { value: number; risk: string };
        fluid: { value: number; risk: string };
        heartRate: { value: number; risk: string };
        spo2: { value: number; risk: string };
      };
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    console.log('[R.A.D.A.R. Chat Agent] Processing conversation...');

    // Convert chat history to LangChain message format
    const chatHistory = messages.slice(0, -1).map(msg => {
      if (msg.role === 'user') {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);
      }
    });

    // Get the latest user message
    const userMessage = messages[messages.length - 1].content;

    // Augment with sensor data context if provided
    let inputWithContext = userMessage;
    if (sensorData) {
      inputWithContext = `
**CURRENT PATIENT VITALS:**
- Urea: ${sensorData.urea.value} mg/dL (${sensorData.urea.risk})
- Fluid: ${sensorData.fluid.value} ECW/TBW (${sensorData.fluid.risk})
- Heart Rate: ${sensorData.heartRate.value} bpm (${sensorData.heartRate.risk})
- SpO2: ${sensorData.spo2.value}% (${sensorData.spo2.risk})

**USER QUESTION:**
${userMessage}
`;
    }

    // Execute the agent using LangGraph
    const allMessages = [...chatHistory, new HumanMessage(inputWithContext)];
    const result = await agentExecutor.invoke({
      messages: allMessages,
    });

    console.log('[R.A.D.A.R. Chat Agent] Response generated');
    
    // Extract the final message content
    const finalMessages = result.messages;
    const lastMessage = finalMessages[finalMessages.length - 1];
    
    // Handle different content types (string, array, object)
    let responseContent: string;
    if (typeof lastMessage.content === 'string') {
      responseContent = lastMessage.content;
    } else if (Array.isArray(lastMessage.content)) {
      // If content is an array, join the text parts
      responseContent = lastMessage.content
        .map((item: any) => typeof item === 'string' ? item : item.text || JSON.stringify(item))
        .join(' ');
    } else {
      // If content is an object, stringify it
      responseContent = JSON.stringify(lastMessage.content);
    }

    console.log('[R.A.D.A.R. Chat Agent] Sending response:', responseContent.substring(0, 100) + '...');

    return NextResponse.json({
      content: responseContent,
      metadata: {
        timestamp: new Date().toISOString(),
        agentVersion: '2.0.0-langgraph',
      },
    });

  } catch (error) {
    console.error('[R.A.D.A.R. Chat Agent] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Chat agent failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        content: "I apologize, but I encountered a technical issue processing your question. Please try rephrasing, or contact your healthcare provider directly if this is urgent.",
      },
      { status: 500 }
    );
  }
}

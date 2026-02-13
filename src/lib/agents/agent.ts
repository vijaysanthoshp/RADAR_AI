/**
 * R.A.D.A.R. Medical Surveillance Agent
 * Production-Grade Agentic System for Dialysis Patient Monitoring
 * 
 * This agent implements:
 * - Multi-step medical reasoning with Chain-of-Thought
 * - Autonomous tool selection and execution
 * - Evidence-based clinical decision support
 * - Graduated alert escalation
 * 
 * Clinical Context:
 * R.A.D.A.R. (Real Analysis & Dialysis Alert Response) is designed to detect
 * physiological "drift" in interdialytic patients, preventing catastrophic 
 * decompensation through early intervention.
 */

import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { radarAgentTools } from "./tools";

// Initialize the Groq LLM
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "llama-3.3-70b-versatile",
  temperature: 0.1,
  maxTokens: 4096,
});

// Bind tools to the LLM for function calling
const llmWithTools = llm.bind({
  tools: radarAgentTools.map(tool => {
    const toolDef = tool as any;
    return {
      type: "function",
      function: {
        name: toolDef.name,
        description: toolDef.description,
        parameters: toolDef.schema || {},
      },
    };
  }),
});

// Medical-grade system prompt for R.A.D.A.R. agent
const RADAR_SYSTEM_PROMPT = `You are the R.A.D.A.R. Medical Surveillance AI Agent - an expert nephrologist and critical care specialist embedded in a continuous patient monitoring system.

## MISSION
Monitor interdialytic patients (between dialysis sessions) to detect early physiological deterioration and prevent catastrophic events. Dialysis patients face 15-20% first-year mortality due to the "monitoring vacuum" between clinical visits. Your role is to digitize clinical intuition.

## CLINICAL CONTEXT: The 4-Parameter Surveillance Model
You monitor 4 critical physiological signals that, when fused, reveal multi-organ stress:

1. **UREA (Kidney Function Marker)**
   - Normal: 20-60 mg/dL | Warning: 61-100 | Urgent: 101-150 | Critical: >150
   - Indicates: Dialysis adequacy, uremic toxin accumulation, metabolic waste clearance
   - Red flags: Rapid rise (>20 mg/dL/6h), values >150 (uremic crisis risk)

2. **FLUID OVERLOAD (ECW/TBW Ratio - Extracellular Water/Total Body Water)**
   - Normal: <0.43 | Warning: 0.43-0.45 | Urgent: 0.46-0.48 | Critical: ≥0.49
   - Measured via: Thoracic bioimpedance (Smart-Vest Zone B)
   - Indicates: Volume status, lung fluid, cardiac preload stress
   - Red flags: Ratio >0.46 (pulmonary edema risk), rapid accumulation (>0.05/day)

3. **HEART RATE (Autonomic & Cardiac Stress)**
   - Normal: 60-100 bpm | Warning: 101-120 | Urgent: 121-140 | Critical: <40 or >140
   - Indicates: Autonomic stress, volume overload compensation, sepsis response
   - Red flags: Persistent tachycardia (>110 bpm) with fluid overload, sudden bradycardia

4. **SpO2 - Oxygen Saturation (Pulmonary & Perfusion Status)**
   - Normal: ≥92% | Warning: 90-91% | Urgent: 85-89% | Critical: <85%
   - Measured via: Multi-wavelength PPG (Smart Ring)
   - Indicates: Pulmonary gas exchange, peripheral perfusion, cardiac output
   - Red flags: Declining SpO2 + fluid overload (suggests pulmonary edema)

## MULTI-MODAL FUSION PRINCIPLE
Individual parameters may appear benign, but **convergent deterioration across multiple systems** signals acute decompensation:

**Crisis Pattern Recognition:**
- ⚠️ Fluid Overload (↑ ECW/TBW) + Hypoxia (↓ SpO2) = **Pulmonary Edema**
- ⚠️ High Urea (↑) + Tachycardia (↑ HR) + Fluid (↑) = **Uremic Crisis + Volume Overload**
- ⚠️ All 4 parameters trending RED = **Multi-Organ Decompensation** (ICU-level emergency)

## YOUR COGNITIVE PROCESS (ReAct Framework)
You operate in iterative Thought → Action → Observation cycles:

### Step 1: ASSESS
- Analyze current vital signs against clinical thresholds
- Identify which parameters are abnormal and their severity (GREEN/YELLOW/ORANGE/RED)

### Step 2: INVESTIGATE (Use Tools)
- **Query patient history** to determine if this is sudden deterioration or gradual drift
- **Check medical guidelines** to validate clinical decision-making
- **Analyze risk trajectory** to predict when patient will reach critical thresholds

### Step 3: SYNTHESIZE
- Identify the primary medical concern (e.g., "Acute Fluid Overload with Respiratory Compromise")
- Explain the pathophysiology: How are these parameters connected? (e.g., fluid overload → pulmonary edema → hypoxia)
- Determine urgency level: Is this life-threatening, urgent, or monitored drift?

### Step 4: INTERVENE
- **Generate specific, actionable recommendations** (not vague advice):
  ✓ "Arrange emergency dialysis within 4 hours to remove 2.5L fluid"
  ✗ "Monitor fluid intake" (too vague)
  
- **Escalate alerts** via the alert system when findings warrant human intervention
- **Recommend specialist consultations** for multi-system involvement

### Step 5: DOCUMENT
- Provide a clear, structured response with:
  1. Primary Diagnosis
  2. Medical Reasoning (physiological explanation)
  3. Urgency Level (Timeline for action)
  4. Specific Actions (3-5 concrete steps)
  5. Alert Status (Was escalation triggered?)

## TOOL USAGE STRATEGY
You have access to 5 specialized tools. Use them intelligently:

1. **get_patient_history**: ALWAYS check trends before making conclusions. A single high reading may be artifact; a trend is physiologically meaningful.

2. **query_medical_guidelines**: Reference for validating interventions against KDIGO/NKF/AHA protocols. Use when severity is ORANGE/RED.

3. **analyze_risk_trajectory**: Critical for predicting "time to crisis." Helps determine if intervention is needed in 2h vs 24h.

4. **escalate_alert**: Automatically triggers when you determine human intervention is required. Use graduated escalation:
   - YELLOW: Patient self-monitoring
   - ORANGE: Clinical review within 4-6h
   - RED: Immediate medical attention
   - CRITICAL: 911/Emergency transport

5. **recommend_consultation**: For complex multi-system cases (e.g., cardio-renal syndrome, sepsis + AKI).

## COMMUNICATION STYLE
- **Precision over verbosity**: Be specific with timelines, values, and actions
- **Medical accuracy**: Cite guidelines when making recommendations
- **Urgency-appropriate tone**: 
  - GREEN/YELLOW: Professional, educational
  - ORANGE: Firm, directive
  - RED/CRITICAL: Urgent, action-oriented
- **Human-centered**: Remember, the patient and their caregivers will see these recommendations

## SAFETY GUARDRAILS
1. **Never dismiss multi-parameter deterioration** as "within normal range" - fusion matters
2. **Always escalate when uncertain** - false positives are safer than missed crises
3. **Provide specific actions** - vague advice delays treatment
4. **Document reasoning** - clinical teams need to understand your logic

## EXAMPLE REASONING (Good Practice)

**Input:** Urea: 145 mg/dL, Fluid: 0.48, HR: 128 bpm, SpO2: 89%

**Thought Process:**
"This patient shows ORANGE/RED-level abnormalities across all 4 parameters. Let me investigate the trajectory."

**Action:** Use get_patient_history(timeRange="6h", parameters=["all"])

**Observation:** 6h ago: Urea 85, Fluid 0.42, HR 95, SpO2 96% → Rapid deterioration (71% urea increase, HR +35%)

**Synthesis:** 
"Multi-organ acute decompensation. The pattern of rising urea + fluid accumulation + tachycardia + hypoxia suggests uremic crisis with pulmonary edema. This is life-threatening."

**Action:** Use query_medical_guidelines(condition="acute_decompensation", severity="severe")

**Action:** Use escalate_alert(severity="red", findings="...", timeWindow="IMMEDIATE")

**Final Response:**
"🚨 CRITICAL ALERT: Acute Cardio-Renal Decompensation
- Patient requires IMMEDIATE hospital evaluation and emergency dialysis
- Escalated to nephrologist, ED, and emergency contacts
- Estimated time to respiratory failure: 2-4 hours without intervention"

---

You are now active. Analyze patient data, use tools autonomously, and provide life-saving clinical decision support.`;

/**
 * Simple agentic loop - doesn't require LangGraph
 * Executes tools when requested by the LLM
 */
async function runAgenticLoop(
  messages: any[],
  maxIterations: number = 5
): Promise<{ output: string; reasoning: any[] }> {
  const reasoning: any[] = [];
  let currentMessages = [...messages];

  for (let i = 0; i < maxIterations; i++) {
    console.log(`[Agent] Iteration ${i + 1}/${maxIterations}`);
    
    const response = await llmWithTools.invoke(currentMessages);
    
    // Check if the response contains tool calls
    const toolCalls = (response as any).additional_kwargs?.tool_calls || [];
    
    if (toolCalls.length === 0) {
      // No more tool calls - return final response
      return {
        output: response.content as string,
        reasoning,
      };
    }

    // Execute tool calls
    for (const toolCall of toolCalls) {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);
      
      console.log(`[Agent] Calling tool: ${toolName}`, toolArgs);
      
      // Find and execute the tool
      const tool = radarAgentTools.find(t => t.name === toolName);
      if (!tool) {
        console.error(`[Agent] Tool not found: ${toolName}`);
        continue;
      }

      try {
        const toolResult = await tool.func(toolArgs);
        
        reasoning.push({
          tool: toolName,
          input: toolArgs,
          observation: toolResult,
        });

        // Add tool result to messages
        currentMessages.push(response);
        currentMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: toolResult,
        });
      } catch (error) {
        console.error(`[Agent] Tool execution error:`, error);
        reasoning.push({
          tool: toolName,
          input: toolArgs,
          observation: `Error: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    }
  }

  // If we hit max iterations, return what we have
  const finalResponse = await llm.invoke(currentMessages);
  return {
    output: finalResponse.content as string,
    reasoning,
  };
}

/**
 * Execute the R.A.D.A.R. agent with patient data
 * 
 * @param sensorData - Current patient vitals
 * @param previousAnalysis - Optional context from prior analysis
 * @returns Comprehensive medical analysis with reasoning steps
 */
export async function executeRadarAgent(
  sensorData: {
    urea: { value: number; risk: string; reason: string };
    fluid: { value: number; risk: string; phaseAngle: number };
    heartRate: { value: number; risk: string };
    spo2: { value: number; risk: string };
  },
  previousAnalysis?: string
) {
  try {
    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured in environment variables');
    }

    const input = `
## PATIENT VITAL SIGNS (Current Reading)

**UREA (Kidney Function)**
- Value: ${sensorData.urea.value} mg/dL
- Risk Level: ${sensorData.urea.risk}
- Status: ${sensorData.urea.reason}

**FLUID OVERLOAD (Volume Status)**
- ECW/TBW Ratio: ${sensorData.fluid.value}
- Risk Level: ${sensorData.fluid.risk}
- Phase Angle: ${sensorData.fluid.phaseAngle}° (tissue health indicator)

**HEART RATE (Cardiac/Autonomic)**
- Value: ${sensorData.heartRate.value} bpm
- Risk Level: ${sensorData.heartRate.risk}

**SpO2 (Oxygen Saturation)**
- Value: ${sensorData.spo2.value}%
- Risk Level: ${sensorData.spo2.risk}

${previousAnalysis ? `\n**Previous Analysis Context:**\n${previousAnalysis}\n` : ''}

## YOUR TASK
Perform a comprehensive multi-step medical analysis:

1. **Assess** the individual parameter risks
2. **Investigate** patient history and trends using available tools
3. **Synthesize** the clinical picture - What's the primary concern?
4. **Predict** the risk trajectory - When will patient reach critical state?
5. **Recommend** specific, actionable interventions
6. **Escalate** alerts if warranted

Use your tools intelligently. Think step-by-step. Lives depend on accurate, timely assessment.
`;

    console.log('[R.A.D.A.R. Agent] Invoking agent with input length:', input.length);
    
    // Run the agentic loop
    const result = await runAgenticLoop([
      new SystemMessage(RADAR_SYSTEM_PROMPT),
      new HumanMessage(input),
    ]);

    console.log('[R.A.D.A.R. Agent] Agent execution complete');
    console.log('[R.A.D.A.R. Agent] Tools used:', result.reasoning.map(r => r.tool).join(', '));

    return result;
  } catch (error) {
    console.error('[R.A.D.A.R. Agent] Execution error:', error);
    console.error('[R.A.D.A.R. Agent] Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack',
    });
    throw error; // Re-throw to be caught by the API route
  }
}

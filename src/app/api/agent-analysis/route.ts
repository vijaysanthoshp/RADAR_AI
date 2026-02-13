/**
 * R.A.D.A.R. Agentic Analysis API
 * Production-Grade Autonomous Medical Decision Support
 * 
 * This endpoint replaces the simple LLM call with a full agentic system
 * that can:
 * - Query patient history
 * - Access medical guidelines
 * - Predict risk trajectories
 * - Escalate alerts autonomously
 * - Provide evidence-based recommendations
 */

import { NextResponse } from 'next/server';
import { executeRadarAgent } from '@/lib/agents/agent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SensorInput {
  urea: { value: number; risk: string; reason: string; unit: string };
  fluid: { value: number; risk: string; reason: string; unit: string; phaseAngle: number };
  heartRate: { value: number; risk: string; reason: string; unit: string };
  spo2: { value: number; risk: string; reason: string; unit: string };
}

export async function POST(req: Request) {
  try {
    const { sensorData, previousContext } = await req.json() as {
      sensorData: SensorInput;
      previousContext?: string;
    };

    if (!sensorData) {
      return NextResponse.json(
        { error: 'Sensor data is required' },
        { status: 400 }
      );
    }

    console.log('[R.A.D.A.R. Agent] Starting agentic analysis...');
    console.log('[Patient Vitals]', {
      urea: `${sensorData.urea.value} mg/dL (${sensorData.urea.risk})`,
      fluid: `${sensorData.fluid.value} ECW/TBW (${sensorData.fluid.risk})`,
      hr: `${sensorData.heartRate.value} bpm (${sensorData.heartRate.risk})`,
      spo2: `${sensorData.spo2.value}% (${sensorData.spo2.risk})`,
    });

    // Execute the autonomous agent
    const agentResult = await executeRadarAgent(sensorData, previousContext);

    console.log('[R.A.D.A.R. Agent] Analysis complete');
    console.log('[Tools Used]', agentResult.reasoning?.map((r: any) => r.tool).join(', '));

    // Parse the agent's output into structured format for the frontend
    const analysis = parseAgentOutput(agentResult.output, sensorData);

    return NextResponse.json({
      success: true,
      analysis,
      agentReasoning: {
        steps: agentResult.reasoning,
        fullOutput: agentResult.output,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        agentVersion: '1.0.0',
        model: 'llama-3.3-70b-versatile',
        system: 'R.A.D.A.R. Agentic Medical Surveillance',
      },
    });

  } catch (error) {
    console.error('[R.A.D.A.R. Agent] Error:', error);
    console.error('[R.A.D.A.R. Agent] Error Stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Check for specific error types
    let errorDetails = 'Unknown error';
    if (error instanceof Error) {
      errorDetails = error.message;
      
      // Check for common issues
      if (error.message.includes('API key')) {
        errorDetails = 'GROQ API key is missing or invalid. Please check your .env file.';
      } else if (error.message.includes('rate limit')) {
        errorDetails = 'GROQ API rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message.includes('timeout')) {
        errorDetails = 'Request timed out. The AI model is taking too long to respond.';
      }
    }
    
    return NextResponse.json(
      {
        error: 'Agentic analysis failed',
        message: errorDetails,
        technicalDetails: error instanceof Error ? error.message : String(error),
        fallback: {
          diagnosis: 'System Error',
          diagnosisDetail: 'The autonomous agent encountered an error. Please retry or contact medical support.',
          urgency: 'Medium',
          timeline: 'Manual Review Required',
          timelineReason: 'Agent system needs attention',
          actions: [
            'Retry the analysis',
            'Contact nephrologist for manual review',
            'Check system logs for technical issues',
          ],
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Parse the agent's natural language output into structured JSON for the frontend
 */
function parseAgentOutput(output: string, sensorData: SensorInput) {
  // Extract key information using pattern matching
  // The agent's output is structured, so we can parse it reliably
  
  // Default structure
  const analysis = {
    diagnosis: 'Multi-Parameter Analysis',
    diagnosisDetail: '',
    urgency: 'Medium',
    timeline: '6-12 Hours',
    timelineReason: '',
    actions: [] as string[],
    clinicalReasoning: '',
    alertStatus: 'none',
  };

  try {
    // Extract diagnosis/primary concern
    const diagnosisMatch = output.match(/(?:Primary (?:Diagnosis|Concern)|DIAGNOSIS|Alert)[:\s]*([^\n]+)/i);
    if (diagnosisMatch) {
      analysis.diagnosis = diagnosisMatch[1].trim().replace(/[🚨⚠️✓]/g, '').trim();
    }

    // Extract urgency level
    if (output.toLowerCase().includes('critical') || output.includes('🚨')) {
      analysis.urgency = 'High';
      analysis.timeline = 'IMMEDIATE';
    } else if (output.toLowerCase().includes('urgent') || output.toLowerCase().includes('red zone')) {
      analysis.urgency = 'High';
      analysis.timeline = '1-4 Hours';
    } else if (output.toLowerCase().includes('warning') || output.toLowerCase().includes('orange')) {
      analysis.urgency = 'Medium';
      analysis.timeline = '4-12 Hours';
    } else if (output.toLowerCase().includes('yellow') || output.toLowerCase().includes('monitor')) {
      analysis.urgency = 'Low';
      analysis.timeline = '12-24 Hours';
    } else {
      analysis.urgency = 'Low';
      analysis.timeline = '24+ Hours';
    }

    // Extract timeline reasoning
    const timelineMatch = output.match(/(?:timeline|time to|within|required)[:\s]*([^\n.]+)/i);
    if (timelineMatch) {
      analysis.timelineReason = timelineMatch[1].trim();
    } else {
      analysis.timelineReason = `Based on current ${sensorData.urea.risk} urea, ${sensorData.fluid.risk} fluid status, and multi-parameter assessment.`;
    }

    // Extract specific actions (look for numbered lists or bullet points)
    const actionMatches = output.match(/(?:^|\n)\s*(?:\d+\.|[-•])\s*([^\n]+)/gm);
    if (actionMatches && actionMatches.length > 0) {
      analysis.actions = actionMatches
        .map(action => action.replace(/^\s*(?:\d+\.|[-•])\s*/, '').trim())
        .filter(action => action.length > 10) // Filter out very short lines
        .slice(0, 5); // Take up to 5 actions
    }

    // If no actions found, extract from recommendations section
    if (analysis.actions.length === 0) {
      const recommendMatch = output.match(/(?:recommend|action|intervention|step)[s]?[:\s]*\n([\s\S]+?)(?:\n\n|$)/i);
      if (recommendMatch) {
        analysis.actions = recommendMatch[1]
          .split('\n')
          .map(line => line.replace(/^\s*(?:\d+\.|[-•])\s*/, '').trim())
          .filter(line => line.length > 10)
          .slice(0, 5);
      }
    }

    // Fallback actions if still empty
    if (analysis.actions.length === 0) {
      analysis.actions = [
        'Monitor vital signs closely for further changes',
        'Review patient history for recent medication or lifestyle changes',
        'Consult with nephrologist regarding current readings',
      ];
    }

    // Extract diagnosis detail
    const detailMatch = output.match(/(?:pattern|suggests|indicates|shows)[:\s]*([^\n.]+[.])/i);
    if (detailMatch) {
      analysis.diagnosisDetail = detailMatch[0].trim();
    } else {
      // Construct from sensor data
      const concerns = [];
      if (sensorData.urea.risk === 'RED' || sensorData.urea.risk === 'ORANGE') {
        concerns.push(`elevated urea (${sensorData.urea.value} mg/dL)`);
      }
      if (sensorData.fluid.risk === 'RED' || sensorData.fluid.risk === 'ORANGE') {
        concerns.push(`fluid overload (${sensorData.fluid.value} ECW/TBW)`);
      }
      if (sensorData.heartRate.risk === 'RED' || sensorData.heartRate.risk === 'ORANGE') {
        concerns.push(`tachycardia (${sensorData.heartRate.value} bpm)`);
      }
      if (sensorData.spo2.risk === 'RED' || sensorData.spo2.risk === 'ORANGE') {
        concerns.push(`hypoxia (${sensorData.spo2.value}%)`);
      }

      if (concerns.length > 1) {
        analysis.diagnosisDetail = `Multi-parameter deterioration detected: ${concerns.join(', ')}. This pattern suggests acute decompensation requiring urgent intervention.`;
      } else if (concerns.length === 1) {
        analysis.diagnosisDetail = `Patient showing ${concerns[0]}. Close monitoring and timely intervention recommended.`;
      } else {
        analysis.diagnosisDetail = 'Patient parameters within monitoring thresholds. Continue routine surveillance.';
      }
    }

    // Extract clinical reasoning
    const reasoningMatch = output.match(/(?:reasoning|pathophysiology|synthesis|analysis)[:\s]*\n([\s\S]+?)(?:\n\n|\n(?:Action|Recommendation|Alert))/i);
    if (reasoningMatch) {
      analysis.clinicalReasoning = reasoningMatch[1].trim();
    } else {
      analysis.clinicalReasoning = output.substring(0, 500).trim() + '...';
    }

    // Check for alert escalation
    if (output.toLowerCase().includes('escalate') || output.toLowerCase().includes('alert dispatched')) {
      analysis.alertStatus = 'escalated';
    } else if (output.toLowerCase().includes('critical') || output.toLowerCase().includes('immediate')) {
      analysis.alertStatus = 'pending';
    }

  } catch (parseError) {
    console.error('[Parser] Error parsing agent output:', parseError);
    // Return default structure with raw output
    analysis.diagnosisDetail = 'Autonomous agent analysis completed. Review full output for details.';
    analysis.clinicalReasoning = output;
  }

  return analysis;
}

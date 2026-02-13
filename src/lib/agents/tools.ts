/**
 * R.A.D.A.R. Agent Tools
 * Production-Grade Medical Decision Support Tools
 * 
 * These tools enable the AI agent to autonomously:
 * - Query patient history
 * - Analyze trends
 * - Access medical guidelines
 * - Generate alerts
 * - Recommend interventions
 */

import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// ==================== TOOL 1: Patient History Retrieval ====================
export const getPatientHistoryTool = new DynamicStructuredTool({
  name: "get_patient_history",
  description: `Retrieves historical vital signs data for a dialysis patient to identify trends and patterns.
  Use this when you need to understand if current readings represent a sudden change or gradual deterioration.
  Critical for determining intervention urgency.`,
  schema: z.object({
    timeRange: z.enum(["1h", "6h", "24h", "7d"]).describe("Time range to retrieve: 1 hour, 6 hours, 24 hours, or 7 days"),
    parameters: z.array(z.enum(["urea", "fluid", "heartRate", "spo2", "respiratoryRate", "perfusionIndex", "all"])).describe("Which parameters to retrieve"),
  }),
  func: async ({ timeRange, parameters }) => {
    // Mock patient history - In production, this would query a time-series database
    const mockHistory = {
      "1h": {
        urea: { trend: "stable", values: [35, 37, 36, 38], avgChange: "+2.5 mg/dL" },
        fluid: { trend: "increasing", values: [0.38, 0.39, 0.40, 0.41], avgChange: "+0.03" },
        heartRate: { trend: "stable", values: [72, 74, 73, 75], avgChange: "+3 bpm" },
        spo2: { trend: "stable", values: [98, 98, 97, 97], avgChange: "-1%" },
        respiratoryRate: { trend: "stable", values: [16, 17, 16, 17], avgChange: "+1 brpm" },
        perfusionIndex: { trend: "stable", values: [2.5, 2.4, 2.5, 2.4], avgChange: "-0.1" },
      },
      "6h": {
        urea: { trend: "increasing", values: [35, 45, 58, 72, 85, 92], avgChange: "+57 mg/dL (163% increase)" },
        fluid: { trend: "critical_increase", values: [0.38, 0.40, 0.42, 0.44, 0.46, 0.47], avgChange: "+0.09 (24% increase)" },
        heartRate: { trend: "escalating", values: [72, 82, 95, 108, 118, 125], avgChange: "+53 bpm (74% increase)" },
        spo2: { trend: "declining", values: [98, 97, 96, 95, 93, 92], avgChange: "-6% (concerning)" },
        respiratoryRate: { trend: "increasing", values: [16, 18, 20, 23, 26, 28], avgChange: "+12 brpm (75% increase)" },
        perfusionIndex: { trend: "declining", values: [2.5, 2.2, 1.8, 1.4, 1.0, 0.7], avgChange: "-1.8 (72% decrease - concerning)" },
      },
      "24h": {
        urea: { trend: "severe_escalation", values: [35, 65, 95, 125, 145, 160], avgChange: "+125 mg/dL (357% increase)" },
        fluid: { trend: "critical", values: [0.38, 0.42, 0.45, 0.47, 0.49, 0.50], avgChange: "+0.12 (32% increase - CRITICAL)" },
        heartRate: { trend: "tachycardia", values: [72, 95, 115, 130, 140, 145], avgChange: "+73 bpm (101% increase)" },
        spo2: { trend: "hypoxia_risk", values: [98, 96, 93, 90, 87, 84], avgChange: "-14% (CRITICAL HYPOXIA)" },
        respiratoryRate: { trend: "tachypnea", values: [16, 20, 24, 27, 29, 30], avgChange: "+14 brpm (88% increase - CRITICAL)" },
        perfusionIndex: { trend: "shock_risk", values: [2.5, 2.0, 1.5, 1.0, 0.6, 0.4], avgChange: "-2.1 (84% decrease - CRITICAL SHOCK RISK)" },
      },
      "7d": {
        urea: { trend: "baseline_comparison", baseline: 35, current: 160, change: "+357%", note: "Patient was stable 7 days ago" },
        fluid: { trend: "progressive_overload", baseline: 0.38, current: 0.50, change: "+32%", note: "Consistent fluid accumulation post-dialysis" },
        heartRate: { trend: "autonomic_stress", baseline: 72, current: 145, change: "+101%", note: "Possible sepsis or volume overload" },
        spo2: { trend: "pulmonary_compromise", baseline: 98, current: 84, change: "-14%", note: "Suggests pulmonary edema from fluid overload" },
        respiratoryRate: { trend: "respiratory_distress", baseline: 16, current: 30, change: "+88%", note: "Progressive respiratory distress - fluid overload likely" },
        perfusionIndex: { trend: "perfusion_failure", baseline: 2.5, current: 0.4, change: "-84%", note: "Critical perfusion decline - shock state" },
      }
    };

    const data = mockHistory[timeRange as keyof typeof mockHistory];
    const selectedParams = parameters.includes("all") 
      ? ["urea", "fluid", "heartRate", "spo2", "respiratoryRate", "perfusionIndex"] 
      : parameters;

    const result = selectedParams.reduce((acc: any, param) => {
      acc[param] = data[param as keyof typeof data];
      return acc;
    }, {});

    return JSON.stringify({
      timeRange,
      data: result,
      clinicalNote: timeRange === "24h" || timeRange === "7d" 
        ? "⚠️ URGENT: Multi-parameter deterioration detected. Patient is in active crisis trajectory."
        : "Trends within monitoring thresholds.",
    });
  },
});

// ==================== TOOL 2: Medical Guidelines Query ====================
export const getMedicalGuidelinesTool = new DynamicStructuredTool({
  name: "query_medical_guidelines",
  description: `Access evidence-based medical guidelines for dialysis patient management.
  Use this to validate clinical decisions against established protocols (KDIGO, NKF, AHA).
  Essential for ensuring recommendations align with nephrology best practices.`,
  schema: z.object({
    condition: z.enum([
      "fluid_overload",
      "hyperkalemia",
      "uremic_crisis",
      "hypoxia",
      "sepsis_risk",
      "arrhythmia",
      "acute_decompensation"
    ]).describe("The clinical condition to look up"),
    severity: z.enum(["mild", "moderate", "severe", "critical"]).describe("Severity level"),
  }),
  func: async ({ condition, severity }) => {
    const guidelines: Record<string, any> = {
      fluid_overload: {
        mild: {
          criteria: "ECW/TBW 0.43-0.45, Stable vitals",
          intervention: "Dietary sodium restriction (<2g/day), Monitor daily weight, Consider diuretic adjustment",
          urgency: "Outpatient follow-up within 48-72h",
          reference: "KDIGO 2024 Guidelines - Volume Management",
        },
        moderate: {
          criteria: "ECW/TBW 0.46-0.48, Mild dyspnea, Peripheral edema",
          intervention: "Increase dialysis frequency or ultrafiltration target, IV diuretics if responsive, Chest X-ray to assess pulmonary congestion",
          urgency: "Clinical evaluation within 24h, Consider early dialysis session",
          reference: "NKF KDOQI Fluid Management Protocol",
        },
        severe: {
          criteria: "ECW/TBW ≥0.49, Orthopnea, Pulmonary rales",
          intervention: "Emergency dialysis/ultrafiltration, IV loop diuretics, Oxygen therapy, Continuous monitoring",
          urgency: "IMMEDIATE - ED presentation required",
          reference: "AHA Acute Heart Failure Guidelines 2023",
        },
        critical: {
          criteria: "ECW/TBW >0.50, Flash pulmonary edema, SpO2 <90%",
          intervention: "ICU admission, Emergent ultrafiltration, Mechanical ventilation consideration, Vasopressor support if hypotensive",
          urgency: "CRITICAL - 911/Emergency transport",
          reference: "Critical Care Nephrology - Acute Fluid Overload Protocol",
        }
      },
      uremic_crisis: {
        mild: { criteria: "Urea 60-100 mg/dL, Minimal symptoms", intervention: "Review dialysis adequacy (Kt/V), Increase session duration", urgency: "Routine nephrology consult" },
        moderate: { criteria: "Urea 101-150 mg/dL, Nausea, fatigue, pruritus", intervention: "Urgent dialysis scheduling, Symptom management, Nutritional counseling", urgency: "Clinical review within 24h" },
        severe: { criteria: "Urea >150 mg/dL, Altered mental status, pericarditis", intervention: "Emergency dialysis, ICU monitoring, Pericardial assessment", urgency: "IMMEDIATE - Hospital admission" },
        critical: { criteria: "Urea >200 mg/dL, Seizures, uremic encephalopathy", intervention: "ICU admission, Continuous renal replacement therapy (CRRT), Neurological monitoring", urgency: "CRITICAL - Life-threatening" }
      },
      hypoxia: {
        mild: { criteria: "SpO2 90-91%, No respiratory distress", intervention: "Supplemental O2 via nasal cannula, Monitor work of breathing, Chest imaging", urgency: "Clinical assessment within 12h" },
        moderate: { criteria: "SpO2 85-89%, Mild dyspnea", intervention: "High-flow oxygen, Assess for pulmonary edema/infection, Consider BiPAP", urgency: "ED evaluation within 4-6h" },
        severe: { criteria: "SpO2 <85%, Significant respiratory distress", intervention: "ICU admission, Non-invasive ventilation, Treat underlying cause (diurese if fluid overload)", urgency: "IMMEDIATE - Emergency care" },
        critical: { criteria: "SpO2 <80%, Impending respiratory failure", intervention: "Intubation readiness, Mechanical ventilation, Vasopressor/inotropic support", urgency: "CRITICAL - Code blue preparation" }
      },
      acute_decompensation: {
        severe: {
          criteria: "Multi-organ stress: High urea + Fluid overload + Hypoxia",
          intervention: "Simultaneous fluid removal via dialysis, Respiratory support, Cardiac monitoring, ICU-level care",
          urgency: "IMMEDIATE - Hospital admission required",
          reference: "R.A.D.A.R. Multi-Modal Crisis Protocol",
        }
      }
    };

    const guideline = guidelines[condition]?.[severity];
    
    if (!guideline) {
      return JSON.stringify({
        error: "Guideline not found",
        recommendation: "Consult nephrology team for case-specific guidance",
      });
    }

    return JSON.stringify({
      condition,
      severity,
      guideline,
      timestamp: new Date().toISOString(),
    });
  },
});

// ==================== TOOL 3: Risk Trajectory Analyzer ====================
export const analyzeRiskTrajectoryTool = new DynamicStructuredTool({
  name: "analyze_risk_trajectory",
  description: `Performs predictive analysis to estimate when a patient will cross critical thresholds.
  Uses trend velocity to forecast deterioration timeline (e.g., "Patient will reach RED zone in 4-6 hours").
  Critical for proactive intervention planning.`,
  schema: z.object({
    currentValues: z.object({
      urea: z.number(),
      fluid: z.number(),
      heartRate: z.number(),
      spo2: z.number(),
    }),
    trendVelocity: z.object({
      ureaRate: z.number().describe("mg/dL per hour"),
      fluidRate: z.number().describe("ECW/TBW change per hour"),
      hrRate: z.number().describe("bpm per hour"),
      spo2Rate: z.number().describe("% per hour"),
    }),
  }),
  func: async ({ currentValues, trendVelocity }) => {
    // Calculate time to critical thresholds
    const criticalThresholds = {
      urea: 150,      // RED zone
      fluid: 0.49,    // RED zone
      heartRate: 130, // RED zone
      spo2: 85,       // RED zone (below this)
    };

    const timeToRedZone = {
      urea: trendVelocity.ureaRate > 0 
        ? (criticalThresholds.urea - currentValues.urea) / trendVelocity.ureaRate 
        : null,
      fluid: trendVelocity.fluidRate > 0 
        ? (criticalThresholds.fluid - currentValues.fluid) / trendVelocity.fluidRate 
        : null,
      heartRate: trendVelocity.hrRate > 0 
        ? (criticalThresholds.heartRate - currentValues.heartRate) / trendVelocity.hrRate 
        : null,
      spo2: trendVelocity.spo2Rate < 0 
        ? (currentValues.spo2 - criticalThresholds.spo2) / Math.abs(trendVelocity.spo2Rate) 
        : null,
    };

    // Find the most urgent parameter
    const validTimes = Object.entries(timeToRedZone)
      .filter(([_, time]) => time !== null && time > 0)
      .sort(([_, a], [__, b]) => (a as number) - (b as number));

    const urgentParameter = validTimes[0];
    const timeToAction = urgentParameter ? urgentParameter[1] as number : null;

    let urgencyLevel = "STABLE";
    let recommendation = "Continue routine monitoring";

    if (timeToAction !== null) {
      if (timeToAction < 2) {
        urgencyLevel = "CRITICAL";
        recommendation = "IMMEDIATE action required - Patient entering crisis within 2 hours";
      } else if (timeToAction < 6) {
        urgencyLevel = "URGENT";
        recommendation = "Urgent intervention needed - Contact nephrologist and arrange early dialysis";
      } else if (timeToAction < 24) {
        urgencyLevel = "MONITOR";
        recommendation = "Close monitoring required - Schedule clinical review within 12h";
      }
    }

    return JSON.stringify({
      prediction: {
        mostUrgent: urgentParameter ? urgentParameter[0] : "none",
        timeToRedZone: timeToAction ? `${timeToAction.toFixed(1)} hours` : "Not applicable",
        allParameters: timeToRedZone,
      },
      urgencyLevel,
      recommendation,
      clinicalNote: timeToAction && timeToAction < 6 
        ? "⚠️ Patient is on a rapid deterioration trajectory. Early intervention can prevent hospitalization."
        : "Trends are being monitored.",
    });
  },
});

// ==================== TOOL 4: Alert Escalation Engine ====================
export const escalateAlertTool = new DynamicStructuredTool({
  name: "escalate_alert",
  description: `Triggers graduated alert escalation to appropriate healthcare personnel.
  Use this when clinical findings warrant immediate human intervention.
  Automatically routes alerts based on severity: Patient → Caregiver → Nephrologist → Emergency Services.`,
  schema: z.object({
    severity: z.enum(["yellow", "orange", "red", "critical"]).describe("Alert severity level"),
    findings: z.string().describe("Summary of clinical findings"),
    recommendedAction: z.string().describe("Specific action to be taken"),
    timeWindow: z.string().describe("Timeline for action (e.g., '4-6 hours', 'IMMEDIATE')"),
  }),
  func: async ({ severity, findings, recommendedAction, timeWindow }) => {
    const escalationProtocol: Record<string, any> = {
      yellow: {
        recipients: ["Patient mobile app notification", "Caregiver SMS"],
        priority: "Low",
        responseTime: "24 hours",
        actionRequired: "Self-monitoring and lifestyle modification",
      },
      orange: {
        recipients: ["Patient URGENT notification", "Caregiver phone call", "Dialysis center nurse"],
        priority: "Medium",
        responseTime: "4-6 hours",
        actionRequired: "Clinical assessment and possible treatment adjustment",
      },
      red: {
        recipients: ["Patient CRITICAL alert", "Caregiver immediate contact", "Nephrologist on-call", "Local clinic"],
        priority: "High",
        responseTime: "1-2 hours",
        actionRequired: "Immediate medical evaluation - Hospital presentation likely",
      },
      critical: {
        recipients: ["Emergency Services (911)", "Hospital ED", "Nephrologist", "ICU on-call", "Family emergency contact"],
        priority: "CRITICAL",
        responseTime: "IMMEDIATE (0-15 minutes)",
        actionRequired: "Emergency transport and ICU admission",
      },
    };

    const protocol = escalationProtocol[severity];

    // Simulate alert dispatch
    const alertId = `RADAR-${Date.now()}-${severity.toUpperCase()}`;

    return JSON.stringify({
      alertId,
      status: "DISPATCHED",
      severity: severity.toUpperCase(),
      protocol,
      message: {
        subject: `R.A.D.A.R. ${severity.toUpperCase()} Alert - Dialysis Patient Monitoring`,
        body: `
ALERT ID: ${alertId}
SEVERITY: ${severity.toUpperCase()}
TIME WINDOW: ${timeWindow}

CLINICAL FINDINGS:
${findings}

RECOMMENDED ACTION:
${recommendedAction}

This alert was generated by the R.A.D.A.R. (Real Analysis & Dialysis Alert Response) system.
Patient data indicates deterioration requiring ${protocol.actionRequired}.

Response required within: ${protocol.responseTime}
        `.trim(),
      },
      timestamp: new Date().toISOString(),
    });
  },
});

// ==================== TOOL 5: Interdisciplinary Consultation Recommender ====================
export const consultationRecommenderTool = new DynamicStructuredTool({
  name: "recommend_consultation",
  description: `Recommends specialist consultations based on multi-system analysis.
  Dialysis patients often have comorbidities requiring cardiologist, pulmonologist, or infectious disease input.
  Use this for complex cases requiring interdisciplinary care.`,
  schema: z.object({
    primaryConcern: z.string().describe("Primary medical concern identified"),
    affectedSystems: z.array(z.enum(["renal", "cardiovascular", "respiratory", "autonomic", "metabolic"])),
  }),
  func: async ({ primaryConcern, affectedSystems }) => {
    const consultationMap: Record<string, any> = {
      renal: { specialist: "Nephrologist", urgency: "Primary care team", reason: "Core dialysis management" },
      cardiovascular: { 
        specialist: "Cardiologist", 
        urgency: "Within 24-48h if HR >130 or signs of heart failure", 
        reason: "Fluid overload causing cardiac stress, arrhythmia risk from electrolyte imbalance" 
      },
      respiratory: { 
        specialist: "Pulmonologist", 
        urgency: "Same-day if SpO2 <90%", 
        reason: "Possible pulmonary edema from fluid overload, or concurrent pulmonary infection" 
      },
      autonomic: { 
        specialist: "Neurologist or Autonomic Specialist", 
        urgency: "Non-urgent unless altered mental status", 
        reason: "HRV changes suggesting autonomic neuropathy common in ESRD patients" 
      },
      metabolic: { 
        specialist: "Endocrinologist", 
        urgency: "Routine unless acute metabolic derangement", 
        reason: "Diabetes management in diabetic nephropathy patients" 
      },
    };

    const consultations = affectedSystems.map(system => consultationMap[system]);

    return JSON.stringify({
      primaryConcern,
      consultations,
      interdisciplinaryNote: affectedSystems.length > 2 
        ? "⚠️ Multi-system involvement detected. Recommend case conference with nephrology, cardiology, and critical care teams."
        : "Standard specialist referral appropriate.",
      timestamp: new Date().toISOString(),
    });
  },
});

// Export all tools as an array
export const radarAgentTools = [
  getPatientHistoryTool,
  getMedicalGuidelinesTool,
  analyzeRiskTrajectoryTool,
  escalateAlertTool,
  consultationRecommenderTool,
];

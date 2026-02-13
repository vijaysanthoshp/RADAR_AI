export const dynamic = 'force-dynamic';

// --- Types ---

interface SimulationKeyframe {
  timeMs: number;
  fluid: number;
  urea: number;
  hr: number;
  spo2: number;
  rr: number;
  ppi: number;
}

// --- Configuration ---

const SCENARIO_DURATION_MS = 0.5 * 60 * 1000; // 1.5 minutes

const KEYFRAMES: SimulationKeyframe[] = [
  { timeMs: 0, fluid: 0.38, urea: 35, hr: 72, spo2: 98, rr: 16, ppi: 2.5 },                               // 0 hr (Baseline)
  { timeMs: (6 / 14) * SCENARIO_DURATION_MS, fluid: 0.44, urea: 85, hr: 110, spo2: 96, rr: 22, ppi: 1.5 },  // 6 hr (Early Shift)
  { timeMs: (10 / 14) * SCENARIO_DURATION_MS, fluid: 0.47, urea: 120, hr: 130, spo2: 91, rr: 26, ppi: 0.8 }, // 10 hr (Escalation)
  { timeMs: SCENARIO_DURATION_MS, fluid: 0.50, urea: 160, hr: 145, spo2: 84, rr: 30, ppi: 0.4 }           // 14 hr (Crisis)
];

// --- Classification Logic ---

export const classifyUrea = (val: number): string => {
  if (val >= 20 && val <= 60) return "GREEN"; // Merged Blue (41-80) into Green
  if (val >= 61 && val <= 100) return "YELLOW";
  if (val >= 101 && val <= 150) return "ORANGE";
  if (val > 150) return "RED";
  return "GREEN"; // < 20
};

export const classifyFluid = (ecw: number): string => {
  if (ecw >= 0.49) return "RED";
  if (ecw >= 0.46 && ecw <= 0.48) return "ORANGE";
  if (ecw >= 0.43 && ecw <= 0.45) return "YELLOW";
  return "GREEN"; // < 0.43 (Merged Blue 0.39-0.42 into Green)
};

export const classifyHeartRate = (val: number): string => {
  if (val >= 51 && val <= 100) return "GREEN";
  if ((val >= 41 && val <= 50) || (val >= 101 && val <= 110)) return "YELLOW";
  if (val >= 111 && val <= 129) return "ORANGE";
  if (val <= 40 || val >= 130) return "RED";
  return "GREEN";
};

export const classifySpo2 = (val: number): string => {
  if (val >= 96) return "GREEN";
  if (val >= 94 && val <= 95) return "YELLOW";
  if (val >= 92 && val <= 93) return "ORANGE";
  return "RED"; // < 92
};

export const classifyRespiratoryRate = (val: number): string => {
  if (val >= 12 && val <= 20) return "GREEN";
  if (val >= 9 && val <= 11) return "YELLOW";
  if (val >= 21 && val <= 24) return "ORANGE";
  if (val <= 8 || val >= 25) return "RED";
  return "GREEN";
};

export const classifyPerfusionIndex = (val: number): string => {
  if (val > 2.0) return "GREEN";
  if (val >= 1.1 && val <= 2.0) return "YELLOW";
  if (val >= 0.6 && val <= 1.0) return "ORANGE";
  return "RED"; // <= 0.5 (Shock risk)
};

// --- Styling Logic ---

export const getStyles = (status: string) => {
  switch (status) {
    case "GREEN":
      return { color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500", badge: "Normal", badgeColor: "bg-emerald-50 text-emerald-600" };
    case "BLUE": // Keeping case for safety but it shouldn't be reached
      return { color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500", badge: "Advisory", badgeColor: "bg-blue-50 text-blue-600" };
    case "YELLOW":
      return { color: "text-yellow-600", bg: "bg-yellow-50", bar: "bg-yellow-500", badge: "Warning", badgeColor: "bg-yellow-50 text-yellow-600" };
    case "ORANGE":
      return { color: "text-orange-600", bg: "bg-orange-50", bar: "bg-orange-500", badge: "Urgent", badgeColor: "bg-orange-50 text-orange-600" };
    case "RED":
      return { color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500", badge: "Critical", badgeColor: "bg-red-50 text-red-600" };
    default:
      return { color: "text-slate-600", bg: "bg-slate-50", bar: "bg-slate-500", badge: "Unknown", badgeColor: "bg-slate-50 text-slate-600" };
  }
};

// --- Fusion Logic ---

const SEVERITY_MAP: Record<string, number> = {
  "GREEN": 0,
  "BLUE": 1,
  "YELLOW": 2,
  "ORANGE": 3,
  "RED": 4
};

const REVERSE_SEVERITY_MAP: Record<number, string> = {
  0: "GREEN",
  1: "BLUE",
  2: "YELLOW",
  3: "ORANGE",
  4: "RED"
};

export const getSeverity = (risk: string): number => SEVERITY_MAP[risk] || 0;

export const calculateFusionScore = (hrRisk: string, spo2Risk: string, rrRisk: string, ppiRisk: string): number => {
  const sHr = getSeverity(hrRisk);
  const sSpo2 = getSeverity(spo2Risk);
  const sRr = getSeverity(rrRisk);
  const sPpi = getSeverity(ppiRisk);

  // Weights: HR (0.25), SpO2 (0.25), RR (0.25), PPI (0.25) - Equal weights for 4 vital signs
  const score = (sHr * 0.25) + (sSpo2 * 0.25) + (sRr * 0.25) + (sPpi * 0.25);
  return parseFloat(score.toFixed(2));
};

export const getRiskFromScore = (score: number): string => {
  if (score >= 3.00) return "RED";
  if (score >= 2.25) return "ORANGE";
  if (score >= 1.50) return "YELLOW";
  // Removed BLUE range (0.75 - 1.49)
  return "GREEN";
};

export const generateFusionOutput = (score: number, hrRisk: string, spo2Risk: string, rrRisk: string, ppiRisk: string) => {
  const finalRisk = getRiskFromScore(score);
  
  let summary = "Your Status: Stable";
  let urgentActions = "Analysis based on multi-parameter vital signs fusion. Continue monitoring.";
  let longTermAdvice = "Maintain healthy lifestyle and regular checkups.";

  if (finalRisk === "RED") {
    summary = "CRITICAL: Immediate attention required due to high risk vital signs.";
    urgentActions = "Alert medical staff immediately. Check all vital signs urgently.";
  } else if (finalRisk === "ORANGE") {
    summary = "WARNING: Elevated risk detected in vital signs.";
    urgentActions = "Consult physician. Monitor vital signs closely.";
  } else if (finalRisk === "YELLOW") {
    summary = "CAUTION: Moderate risk indicators present.";
    urgentActions = "Schedule follow-up. Review vital signs and medication.";
  }

  // Styles for the fusion card
  let styles = {
    borderColor: "border-emerald-500",
    gradient: "from-emerald-500 to-teal-600",
    textColor: "text-emerald-700",
    badge: "Normal",
    iconColor: "text-white"
  };

  if (finalRisk === "RED") {
    styles = { borderColor: "border-red-600", gradient: "from-red-600 to-rose-700", textColor: "text-red-700", badge: "Critical", iconColor: "text-white" };
  } else if (finalRisk === "ORANGE") {
    styles = { borderColor: "border-orange-500", gradient: "from-orange-500 to-amber-600", textColor: "text-orange-700", badge: "Urgent", iconColor: "text-white" };
  } else if (finalRisk === "YELLOW") {
    styles = { borderColor: "border-yellow-500", gradient: "from-yellow-400 to-amber-500", textColor: "text-yellow-700", badge: "Warning", iconColor: "text-white" };
  } 
  // Removed BLUE style block

  return { 
    finalRisk, // Primary property
    risk: finalRisk, // Alias for backward compatibility
    score, 
    summary, 
    urgentActions, 
    longTermAdvice, 
    styles 
  };
};

// --- Simulation Logic ---

const interpolate = (start: number, end: number, progress: number): number => {
  return start + (end - start) * progress;
};

const getSimulationData = (elapsedTimeMs: number) => {
  // Find current segment
  let startFrame = KEYFRAMES[0];
  let endFrame = KEYFRAMES[KEYFRAMES.length - 1];

  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (elapsedTimeMs >= KEYFRAMES[i].timeMs && elapsedTimeMs <= KEYFRAMES[i+1].timeMs) {
      startFrame = KEYFRAMES[i];
      endFrame = KEYFRAMES[i+1];
      break;
    }
  }

  // Cap at end
  if (elapsedTimeMs >= KEYFRAMES[KEYFRAMES.length - 1].timeMs) {
    startFrame = KEYFRAMES[KEYFRAMES.length - 1];
    endFrame = KEYFRAMES[KEYFRAMES.length - 1];
  }

  const duration = endFrame.timeMs - startFrame.timeMs;
  const progress = duration === 0 ? 1 : (elapsedTimeMs - startFrame.timeMs) / duration;

  // Interpolate values
  const fluid = interpolate(startFrame.fluid, endFrame.fluid, progress);
  const urea = interpolate(startFrame.urea, endFrame.urea, progress);
  const hr = interpolate(startFrame.hr, endFrame.hr, progress);
  const spo2 = interpolate(startFrame.spo2, endFrame.spo2, progress);
  const rr = interpolate(startFrame.rr, endFrame.rr, progress);
  const ppi = interpolate(startFrame.ppi, endFrame.ppi, progress);

  return { fluid, urea, hr, spo2, rr, ppi };
};

export const generatePatientData = (elapsedTimeMs: number = 0) => {
    // Get simulated values
    const sim = getSimulationData(elapsedTimeMs);

    // Add slight noise for realism (optional, keeping it minimal for demo stability)
    const ureaVal = Math.round(sim.urea);
    const fluidVal = parseFloat(sim.fluid.toFixed(2));
    const phaseAngleVal = parseFloat((Math.random() * (6.0 - 4.0) + 4.0).toFixed(1)); // Random PA for now as it wasn't specified in scenario
    const heartRateVal = Math.round(sim.hr);
    const spo2Val = Math.round(sim.spo2);
    const rrVal = Math.round(sim.rr);
    const ppiVal = parseFloat(sim.ppi.toFixed(1));

    // Classify
    const ureaRisk = classifyUrea(ureaVal);
    const fluidRisk = classifyFluid(fluidVal);
    const hrRisk = classifyHeartRate(heartRateVal);
    const spo2Risk = classifySpo2(spo2Val);
    const rrRisk = classifyRespiratoryRate(rrVal);
    const ppiRisk = classifyPerfusionIndex(ppiVal);

    // Fuse (only using 4 vital sign parameters)
    const fusionScore = calculateFusionScore(hrRisk, spo2Risk, rrRisk, ppiRisk);
    const fusion = generateFusionOutput(fusionScore, hrRisk, spo2Risk, rrRisk, ppiRisk);

    // Construct Response
    return {
      urea: {
        value: ureaVal,
        unit: "mg/dL",
        status: ureaRisk,
        risk: ureaRisk,
        reason: `Value ${ureaVal} is in ${ureaRisk} range`,
        styles: getStyles(ureaRisk)
      },
      fluid: {
        value: fluidVal,
        unit: "ECW/TBW",
        phaseAngle: phaseAngleVal,
        status: fluidRisk,
        risk: fluidRisk,
        reason: `ECW/TBW ${fluidVal} indicates ${fluidRisk}`,
        styles: getStyles(fluidRisk)
      },
      heartRate: {
        value: heartRateVal,
        unit: "bpm",
        status: hrRisk,
        risk: hrRisk,
        reason: `HR ${heartRateVal} is ${hrRisk}`,
        styles: getStyles(hrRisk)
      },
      spo2: {
        value: spo2Val,
        unit: "%",
        status: spo2Risk,
        risk: spo2Risk,
        reason: `SPO2 ${spo2Val}% is ${spo2Risk}`,
        styles: getStyles(spo2Risk)
      },
      respiratoryRate: {
        value: rrVal,
        unit: "brpm",
        status: rrRisk,
        risk: rrRisk,
        reason: `RR ${rrVal} is ${rrRisk}`,
        styles: getStyles(rrRisk)
      },
      perfusionIndex: {
        value: ppiVal,
        unit: "",
        status: ppiRisk,
        risk: ppiRisk,
        reason: `PPI ${ppiVal} is ${ppiRisk}`,
        styles: getStyles(ppiRisk)
      },
      fusion: fusion
    };
}

export const dynamic = 'force-dynamic';

import { 
  generatePatientData, 
  calculateFusionScore, 
  generateFusionOutput 
} from '@/lib/data-utils';
import { notificationService, NotificationPayload, PatientData } from '@/lib/notifications/notificationService';

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const startTime = Date.now();
      let lastHrUpdate = 0;
      let lastUreaUpdate = 0;
      let previousRisk: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' = 'GREEN';
      
      // Initialize with baseline data
      let currentData = generatePatientData(0);

      const sendData = async () => {
        const now = Date.now();
        const elapsed = now - startTime;
        
        // Get the "ideal" data for this exact moment in the simulation
        const simulatedSnapshot = generatePatientData(elapsed);
        let updated = false;

        // Update HR & SpO2 & RR & PPI every 3 seconds
        if (elapsed - lastHrUpdate >= 3000) {
          currentData.heartRate = simulatedSnapshot.heartRate;
          currentData.spo2 = simulatedSnapshot.spo2;
          currentData.respiratoryRate = simulatedSnapshot.respiratoryRate;
          currentData.perfusionIndex = simulatedSnapshot.perfusionIndex;
          lastHrUpdate = elapsed;
          updated = true;
        }

        // Update Urea & Fluid every 15 seconds
        if (elapsed - lastUreaUpdate >= 15000) {
          currentData.urea = simulatedSnapshot.urea;
          currentData.fluid = simulatedSnapshot.fluid;
          lastUreaUpdate = elapsed;
          updated = true;
        }

        // If any parameter updated, re-calculate fusion to ensure consistency
        if (updated) {
          const fusionScore = calculateFusionScore(
            currentData.heartRate.risk, 
            currentData.spo2.risk,
            currentData.respiratoryRate.risk,
            currentData.perfusionIndex.risk
          );
          
          currentData.fusion = generateFusionOutput(
            fusionScore,
            currentData.heartRate.risk,
            currentData.spo2.risk,
            currentData.respiratoryRate.risk,
            currentData.perfusionIndex.risk
          );

          // Check if risk level has changed and trigger alerts
          const currentRisk = currentData.fusion.finalRisk;
          
          console.log(`[ALERT-CHECK] Current: ${currentRisk}, Previous: ${previousRisk}`);
          
          if (currentRisk !== previousRisk) {
            console.log(`🔄 Risk level changed: ${previousRisk} → ${currentRisk}`);
            
            // Send alerts for YELLOW, ORANGE, RED (not GREEN)
            if (currentRisk !== 'GREEN') {
              console.log(`🚨 TRIGGERING ALERT for ${currentRisk} level`);
              
              // Patient data for notification
              const patientData: PatientData = {
                patientId: 'RAD-2025-X99',
                patientName: 'Patient X99',
                heartRate: currentData.heartRate.value,
                respiratoryRate: currentData.respiratoryRate.value,
                spo2: currentData.spo2.value,
                perfusionIndex: currentData.perfusionIndex.value,
                fusionScore: currentData.fusion.score,
                fusionRisk: currentRisk,
              };

              const payload: NotificationPayload = {
                severity: currentRisk,
                message: currentData.fusion.summary,
                patientData,
                timestamp: Date.now(),
                alertType: 'vital_sign_critical',
              };

              // Send multi-channel alerts (non-blocking)
              notificationService.sendAlert(payload).catch(error => {
                console.error('❌ ALERT SEND FAILED:', error);
              });
            } else {
              console.log(`✅ Risk returned to GREEN - no alert needed`);
            }
          } else {
            // Risk hasn't changed - this is normal
            // Only log for non-GREEN levels to reduce noise
            if (currentRisk !== 'GREEN') {
              console.log(`⚪ Risk still at ${currentRisk} - no alert (waiting for change or cooldown to expire)`);
            }
          }

          previousRisk = currentRisk;
        }

        const message = `data: ${JSON.stringify(currentData)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial data immediately
      await sendData();

      // Check for updates every 1 second
      const intervalId = setInterval(sendData, 1000);

      // Clean up interval when stream closes
      request.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

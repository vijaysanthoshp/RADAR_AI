/**
 * RADAR Notification Service - Simplified for Hackathon
 * Sends SMS and phone call alerts to a single configured number
 */

export interface PatientData {
  patientId: string;
  patientName: string;
  heartRate: number;
  respiratoryRate: number;
  spo2: number;
  perfusionIndex: number;
  fusionScore: number;
  fusionRisk: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
}

export interface NotificationPayload {
  severity: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  message: string;
  patientData: PatientData;
  timestamp: number;
  alertType: string;
}

// Alert phone number from environment variable
const ALERT_PHONE = process.env.ALERT_PHONE_NUMBER || '+919787017910';

// Base URL for API calls (needed for server-side fetch)
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URLs
    return '';
  }
  // Server-side: use NEXT_PUBLIC_APP_URL or construct from env
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

class NotificationService {
  private lastAlertTime: Record<string, number> = {};
  private readonly cooldowns = {
    YELLOW: 30 * 60 * 1000, // 30 minutes
    ORANGE: 15 * 60 * 1000, // 15 minutes
    RED: 5 * 60 * 1000,     // 5 minutes
  };

  /**
   * Check if enough time has passed since last alert
   */
  private canSendAlert(severity: 'YELLOW' | 'ORANGE' | 'RED'): boolean {
    const now = Date.now();
    const lastSent = this.lastAlertTime[severity] || 0;
    const cooldown = this.cooldowns[severity];
    
    return now - lastSent >= cooldown;
  }

  /**
   * Send alert via SMS and Voice Call (simplified for hackathon)
   */
  async sendAlert(payload: NotificationPayload): Promise<void> {
    const { severity, message, patientData } = payload;

    console.log(`\n========== ALERT PROCESSING ==========`);
    console.log(`Severity: ${severity}`);
    console.log(`Patient: ${patientData.patientName}`);
    console.log(`Message: ${message}`);

    // Only send for YELLOW, ORANGE, RED (not GREEN)
    if (severity === 'GREEN') {
      console.log(`✅ GREEN level - no alert needed`);
      console.log(`======================================\n`);
      return;
    }

    // Rate limiting check
    const cooldownRemaining = this.getCooldownRemaining(severity);
    if (!this.canSendAlert(severity)) {
      console.log(`⏳ ALERT BLOCKED BY COOLDOWN`);
      console.log(`   Severity: ${severity}`);
      console.log(`   Cooldown: ${this.cooldowns[severity] / 60000} minutes`);
      console.log(`   Time Remaining: ${Math.ceil(cooldownRemaining / 1000)} seconds`);
      console.log(`======================================\n`);
      return;
    }

    console.log(`🚨 SENDING ${severity} ALERT to ${ALERT_PHONE}`);
    console.log(`   Last ${severity} alert: ${this.lastAlertTime[severity] ? new Date(this.lastAlertTime[severity]).toLocaleTimeString() : 'Never'}`);

    try {
      // Always send SMS for all alert levels
      console.log(`📱 Sending SMS...`);
      await this.sendSMS(message, patientData, severity);

      // Make phone call for ORANGE and RED alerts
      if (severity === 'ORANGE' || severity === 'RED') {
        console.log(`📞 Initiating voice call...`);
        await this.makePhoneCall(message, patientData, severity);
      }

      // Update last alert time
      this.lastAlertTime[severity] = Date.now();

      console.log(`✅ ${severity} ALERT SENT SUCCESSFULLY!`);
      console.log(`   Next ${severity} alert allowed at: ${new Date(Date.now() + this.cooldowns[severity]).toLocaleTimeString()}`);
      console.log(`======================================\n`);
    } catch (error) {
      console.error(`❌ ALERT SEND FAILED:`, error);
      console.log(`======================================\n`);
      throw error; // Re-throw to be caught by caller
    }
  }

  /**
   * Get remaining cooldown time in milliseconds
   */
  private getCooldownRemaining(severity: 'YELLOW' | 'ORANGE' | 'RED'): number {
    const now = Date.now();
    const lastSent = this.lastAlertTime[severity] || 0;
    const cooldown = this.cooldowns[severity];
    const elapsed = now - lastSent;
    return Math.max(0, cooldown - elapsed);
  }

  /**
   * Send SMS alert to configured number
   */
  private async sendSMS(
    message: string,
    patientData: PatientData,
    severity: string
  ): Promise<void> {
    const smsMessage = this.formatSMSMessage(message, patientData, severity);
    const baseUrl = getBaseUrl();

    try {
      const response = await fetch(`${baseUrl}/api/notifications/sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ALERT_PHONE,
          message: smsMessage,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`SMS failed: ${error}`);
      } else {
        console.log(`📱 SMS sent to ${ALERT_PHONE}`);
      }
    } catch (error) {
      console.error('SMS error:', error);
    }
  }

  /**
   * Make phone call alert to configured number
   */
  private async makePhoneCall(
    message: string,
    patientData: PatientData,
    severity: string
  ): Promise<void> {
    const callMessage = this.formatCallMessage(message, patientData, severity);
    const baseUrl = getBaseUrl();

    try {
      const response = await fetch(`${baseUrl}/api/notifications/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: ALERT_PHONE,
          message: callMessage,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Call failed: ${error}`);
      } else {
        console.log(`📞 Call initiated to ${ALERT_PHONE}`);
      }
    } catch (error) {
      console.error('Call error:', error);
    }
  }

  /**
   * Format SMS message
   */
  private formatSMSMessage(
    message: string,
    patientData: PatientData,
    severity: string
  ): string {
    const emoji = severity === 'RED' ? '🚨' : severity === 'ORANGE' ? '⚠️' : '⚡';
    
    return `${emoji} RADAR ${severity} ALERT

Patient: ${patientData.patientName}
${message}

Vitals:
HR: ${patientData.heartRate} bpm
RR: ${patientData.respiratoryRate} brpm
SpO2: ${patientData.spo2}%
PI: ${patientData.perfusionIndex}

Risk Score: ${patientData.fusionScore.toFixed(2)}/4.00`;
  }

  /**
   * Format phone call message (Text-to-Speech)
   */
  private formatCallMessage(
    message: string,
    patientData: PatientData,
    severity: string
  ): string {
    // Determine urgency level
    const isHighAlert = severity === 'RED' || severity === 'ORANGE';
    
    let intro = '';
    let urgencyStatement = '';
    
    if (severity === 'RED') {
      intro = 'URGENT! CRITICAL ALERT! This is RADAR emergency medical system. ';
      urgencyStatement = 'Patient is in CRITICAL condition. IMMEDIATE medical intervention required. Call 911 NOW if you have not already done so. ';
    } else if (severity === 'ORANGE') {
      intro = 'EMERGENCY ALERT! This is RADAR medical monitoring system. ';
      urgencyStatement = 'Patient requires IMMEDIATE medical attention. This is an emergency. Please respond immediately. ';
    } else if (severity === 'YELLOW') {
      intro = 'URGENT ALERT! This is RADAR medical monitoring system. ';
      urgencyStatement = 'Patient needs urgent care. Please schedule dialysis today. ';
    } else {
      intro = 'This is RADAR medical monitoring system. ';
      urgencyStatement = '';
    }
    
    const patientInfo = `${severity} severity alert for patient ${patientData.patientName}. `;
    const vitalsInfo = `Current vitals: Heart rate ${patientData.heartRate} beats per minute. Blood oxygen ${patientData.spo2} percent. Respiratory rate ${patientData.respiratoryRate} breaths per minute. Risk score ${patientData.fusionScore.toFixed(1)} out of 4. `;
    
    return `${intro}${urgencyStatement}${patientInfo}${message}. ${vitalsInfo}Press 1 to acknowledge this alert. Press 2 to escalate. Press 3 to repeat this message.`;
  }

  // Legacy methods for compatibility
  addEmergencyContact() {}
  removeEmergencyContact() {}
  updateEmergencyContact() {}
  getEmergencyContacts() { return []; }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Legacy exports for compatibility
export type NotificationChannel = 'sms' | 'email' | 'call' | 'push' | 'webhook';
export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  priority: number;
  notificationPreferences: NotificationChannel[];
}

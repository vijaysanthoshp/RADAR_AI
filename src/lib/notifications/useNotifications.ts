/**
 * React Hook for Multi-Channel Notifications
 * Usage: const { sendAlert, isConfigured } = useNotifications();
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationService, NotificationPayload, PatientData } from '../notificationService';

export function useNotifications() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    setPushSupported('serviceWorker' in navigator && 'PushManager' in window);

    // Check service configuration
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      const [smsStatus, emailStatus, callStatus, pushStatus] = await Promise.all([
        fetch('/api/notifications/sms').then(r => r.json()),
        fetch('/api/notifications/email').then(r => r.json()),
        fetch('/api/notifications/call').then(r => r.json()),
        fetch('/api/notifications/push').then(r => r.json()),
      ]);

      const anyConfigured = 
        smsStatus.configured || 
        emailStatus.configured || 
        callStatus.configured || 
        pushStatus.configured;

      setIsConfigured(anyConfigured);
    } catch (error) {
      console.error('Failed to check notification configuration:', error);
    }
  };

  const sendAlert = useCallback(async (
    severity: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED',
    message: string,
    patientData: PatientData
  ) => {
    setIsSending(true);
    
    try {
      const payload: NotificationPayload = {
        severity,
        message,
        patientData,
        timestamp: Date.now(),
        alertType: 'vital_sign_critical',
      };

      await notificationService.sendAlert(payload);
      
      console.log(`✅ Alert sent successfully: ${severity}`);
      return { success: true };
      
    } catch (error) {
      console.error('Failed to send alert:', error);
      return { success: false, error };
      
    } finally {
      setIsSending(false);
    }
  }, []);

  const requestPushPermission = useCallback(async () => {
    if (!pushSupported) {
      return { success: false, error: 'Push notifications not supported' };
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Register service worker and subscribe to push
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          throw new Error('VAPID public key not configured');
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey,
        });

        // Register subscription with backend
        await fetch('/api/notifications/push', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });

        console.log('✅ Push notifications enabled');
        return { success: true };
      }

      return { success: false, error: 'Permission denied' };
      
    } catch (error) {
      console.error('Failed to enable push notifications:', error);
      return { success: false, error };
    }
  }, [pushSupported]);

  const testAlert = useCallback(async (severity: 'YELLOW' | 'ORANGE' | 'RED' = 'YELLOW') => {
    const testPatientData: PatientData = {
      patientId: 'TEST-001',
      patientName: 'Test Patient',
      heartRate: severity === 'RED' ? 145 : severity === 'ORANGE' ? 115 : 105,
      respiratoryRate: severity === 'RED' ? 30 : severity === 'ORANGE' ? 22 : 18,
      spo2: severity === 'RED' ? 84 : severity === 'ORANGE' ? 92 : 94,
      perfusionIndex: severity === 'RED' ? 0.4 : severity === 'ORANGE' ? 0.8 : 1.5,
      fusionScore: severity === 'RED' ? 3.5 : severity === 'ORANGE' ? 2.5 : 1.8,
      fusionRisk: severity,
    };

    return await sendAlert(
      severity,
      `Test ${severity} alert - This is a demonstration of the multi-channel notification system`,
      testPatientData
    );
  }, [sendAlert]);

  return {
    sendAlert,
    isConfigured,
    isSending,
    pushSupported,
    requestPushPermission,
    testAlert,
    checkConfiguration,
  };
}

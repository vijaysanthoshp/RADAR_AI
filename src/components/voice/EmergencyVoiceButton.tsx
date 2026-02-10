'use client';

/**
 * Floating Emergency Voice Button
 * One-tap SOS with voice feedback
 */

import React, { useState } from 'react';
import { useVoice } from '@/contexts/VoiceContext';
import { useRouter } from 'next/navigation';
import { Phone, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmergencyVoiceButton: React.FC = () => {
  const { speak, voiceEnabled, language, stopSpeaking } = useVoice();
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  const handleEmergency = () => {
    if (isPressed) return; // Prevent multiple clicks
    
    setIsPressed(true);

    // Stop any ongoing speech first
    stopSpeaking();

    // Immediate voice feedback
    const emergencyMessages: Record<string, string> = {
      en: 'Emergency activated. Contacting medical team now.',
      hi: 'आपातकाल सक्रिय। अब चिकित्सा टीम से संपर्क कर रहे हैं।',
      ta: 'அவசரம் செயல்படுத்தப்பட்டது. இப்போது மருத்துவ குழுவை தொடர்பு கொள்கிறது.',
      te: 'అత్యవసరం క్రియాశీలం చేయబడింది. ఇప్పుడు వైద్య బృందాన్ని సంప్రదిస్తోంది.',
    };

    if (voiceEnabled) {
      speak(emergencyMessages[language] || emergencyMessages.en, {
        urgency: 'critical',
        priority: true,
      });
    }

    // Navigate to action page
    router.push('/action');

    // Reset button after 5 seconds
    setTimeout(() => setIsPressed(false), 5000);
  };

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <Button
        size="icon"
        className={`h-16 w-16 rounded-full shadow-2xl transition-all duration-300 ${
          isPressed
            ? 'bg-red-900 scale-110 animate-pulse'
            : 'bg-red-600 hover:bg-red-700 hover:scale-110'
        }`}
        onClick={handleEmergency}
        title="Emergency SOS"
      >
        {isPressed ? (
          <PhoneCall className="h-8 w-8 text-white animate-bounce" />
        ) : (
          <Phone className="h-8 w-8 text-white" />
        )}
      </Button>
      
      {/* Pulsing Ring Effect */}
      {!isPressed && (
        <div className="absolute inset-0 -z-10 rounded-full bg-red-600 opacity-30 animate-ping" />
      )}
    </div>
  );
};

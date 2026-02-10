'use client';

/**
 * Voice Control Panel
 * UI for controlling voice features
 */

import React, { useState } from 'react';
import { useVoice } from '@/contexts/VoiceContext';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/voice/voiceService';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Globe, 
  Radio,
  Settings,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const VoiceControlPanel: React.FC = () => {
  const {
    isListening,
    isSpeaking,
    voiceEnabled,
    autoSpeak,
    wakeWordActive,
    language,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    toggleVoice,
    toggleAutoSpeak,
    toggleWakeWord,
    setLanguage,
    speak,
  } = useVoice();

  const [showSettings, setShowSettings] = useState(false);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const testVoice = () => {
    const testMessages: Record<LanguageCode, string> = {
      en: 'Voice system is working correctly. You can now use voice commands.',
      hi: 'वॉयस सिस्टम सही तरीके से काम कर रहा है। अब आप वॉयस कमांड का उपयोग कर सकते हैं।',
      ta: 'குரல் அமைப்பு சரியாக செயல்படுகிறது. இப்போது நீங்கள் குரல் கட்டளைகளைப் பயன்படுத்தலாம்.',
      te: 'వాయిస్ సిస్టమ్ సరిగ్గా పనిచేస్తోంది. ఇప్పుడు మీరు వాయిస్ కమాండ్‌లను ఉపయోగించవచ్చు.',
    };

    speak(testMessages[language], { urgency: 'normal' });
  };

  return (
    <div className="space-y-4">
      {/* Main Voice Control */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${voiceEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}>
              {voiceEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-gray-600" />}
            </div>
            <div>
              <h3 className="font-semibold text-sm">Voice Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {voiceEnabled ? 'Voice features active' : 'Voice features disabled'}
              </p>
            </div>
          </div>

          <Button
            variant={voiceEnabled ? "default" : "outline"}
            size="sm"
            onClick={toggleVoice}
          >
            {voiceEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>

        {voiceEnabled && (
          <>
            {/* Language Selector */}
            <div className="mb-4">
              <label className="text-xs font-medium mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Language / भाषा / மொழி / భాష
              </label>
              <Select value={language} onValueChange={(val) => setLanguage(val as LanguageCode)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                    <SelectItem key={code} value={code}>
                      {lang.name} ({lang.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Voice Input Button */}
            <div className="space-y-3">
              <Button
                className={`w-full h-16 text-lg font-semibold ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={handleVoiceToggle}
                disabled={!voiceEnabled}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-6 h-6 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 mr-2" />
                    Start Voice Command
                  </>
                )}
              </Button>

              {/* Transcript Display */}
              {(transcript || interimTranscript) && (
                <Card className="p-3 bg-blue-50 border-blue-200">
                  <p className="text-xs font-medium text-blue-900 mb-1">
                    {isListening ? 'Listening...' : 'Heard:'}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">{transcript}</span>
                    {interimTranscript && (
                      <span className="text-gray-500 italic"> {interimTranscript}...</span>
                    )}
                  </p>
                </Card>
              )}

              {/* Speaking Indicator */}
              {isSpeaking && (
                <Card className="p-3 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-green-600 animate-pulse" />
                    <p className="text-sm font-medium text-green-900">Speaking...</p>
                  </div>
                </Card>
              )}
            </div>
          </>
        )}
      </Card>

      {/* Voice Features */}
      {voiceEnabled && (
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Voice Features
          </h3>

          <div className="space-y-3">
            {/* Auto-Speak Alerts */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Emergency Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Auto-speak critical warnings
                  </p>
                </div>
              </div>
              <Badge variant={autoSpeak ? "default" : "outline"}>
                {autoSpeak ? 'On' : 'Off'}
              </Badge>
              <Button
                size="sm"
                variant={autoSpeak ? "default" : "outline"}
                onClick={toggleAutoSpeak}
              >
                Toggle
              </Button>
            </div>

            {/* Wake Word Detection */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Wake Word "RADAR"</p>
                  <p className="text-xs text-muted-foreground">
                    Say "RADAR" to activate
                  </p>
                </div>
              </div>
              <Badge variant={wakeWordActive ? "default" : "outline"}>
                {wakeWordActive ? 'Active' : 'Off'}
              </Badge>
              <Button
                size="sm"
                variant={wakeWordActive ? "default" : "outline"}
                onClick={toggleWakeWord}
              >
                Toggle
              </Button>
            </div>

            {/* Test Voice */}
            <Button
              className="w-full"
              variant="outline"
              onClick={testVoice}
              disabled={isSpeaking}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Test Voice
            </Button>
          </div>
        </Card>
      )}

      {/* Voice Commands Help */}
      {voiceEnabled && (
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <h3 className="font-semibold text-sm mb-3">Voice Commands</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold">Emergency</p>
                <p className="text-muted-foreground">
                  "Emergency", "Help", "Call Doctor"
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mic className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <p className="font-semibold">Navigation</p>
                <p className="text-muted-foreground">
                  "Show Dashboard", "Go to Doctor", "Open Chatbot"
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Volume2 className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-semibold">Query Vitals</p>
                <p className="text-muted-foreground">
                  "What is my heart rate?", "Check my vitals"
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

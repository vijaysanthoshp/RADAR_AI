'use client';

/**
 * Voice Context Provider
 * Global state management for voice features
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { voiceTTS, voiceSTT, VoiceCommandParser, LanguageCode, SUPPORTED_LANGUAGES } from '@/lib/voice/voiceService';
import { useRouter } from 'next/navigation';

// ==================== TYPES ====================

interface VoiceState {
  // TTS State
  isSpeaking: boolean;
  ttsQueue: string[];
  
  // STT State
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  
  // Configuration
  language: LanguageCode;
  voiceEnabled: boolean;
  autoSpeak: boolean; // Auto-speak critical alerts
  
  // Wake word detection
  wakeWordActive: boolean;
}

interface VoiceContextValue extends VoiceState {
  // TTS Methods
  speak: (text: string, options?: { urgency?: 'normal' | 'urgent' | 'critical'; priority?: boolean }) => Promise<void>;
  stopSpeaking: () => void;
  clearQueue: () => void;
  
  // STT Methods
  startListening: () => Promise<void>;
  stopListening: () => void;
  
  // Configuration
  setLanguage: (lang: LanguageCode) => void;
  toggleVoice: () => void;
  toggleAutoSpeak: () => void;
  toggleWakeWord: () => void;
  
  // Voice commands
  executeCommand: (transcript: string) => void;
}

// ==================== CONTEXT ====================

const VoiceContext = createContext<VoiceContextValue | null>(null);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within VoiceProvider');
  }
  return context;
};

// ==================== PROVIDER ====================

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const wakeWordIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // State
  const [state, setState] = useState<VoiceState>({
    isSpeaking: false,
    ttsQueue: [],
    isListening: false,
    transcript: '',
    interimTranscript: '',
    language: 'en',
    voiceEnabled: true,
    autoSpeak: true,
    wakeWordActive: false,
  });

  // ==================== TTS METHODS ====================

  const speak = useCallback(async (
    text: string,
    options: { urgency?: 'normal' | 'urgent' | 'critical'; priority?: boolean } = {}
  ) => {
    if (!state.voiceEnabled) return;

    const { urgency = 'normal', priority = false } = options;

    // If priority or urgent, speak immediately (skip queue)
    if (priority || urgency === 'urgent' || urgency === 'critical') {
      voiceTTS.stop(); // Stop current speech
      setState(prev => ({ ...prev, isSpeaking: true, ttsQueue: [] }));

      // Small delay to ensure previous speech is fully cancelled
      await new Promise(resolve => setTimeout(resolve, 50));

      try {
        await voiceTTS.speak(text, {
          language: state.language,
          urgency,
          onStart: () => setState(prev => ({ ...prev, isSpeaking: true })),
          onEnd: () => setState(prev => ({ ...prev, isSpeaking: false })),
          onError: (error) => {
            console.error('[Voice] TTS Error:', error);
            setState(prev => ({ ...prev, isSpeaking: false }));
          },
        });
      } catch (error) {
        console.error('[Voice] Speak error:', error);
        setState(prev => ({ ...prev, isSpeaking: false }));
      }
    } else {
      // Add to queue for non-urgent speech
      setState(prev => ({ ...prev, ttsQueue: [...prev.ttsQueue, text] }));
    }
  }, [state.voiceEnabled, state.language]);

  // Process TTS queue
  useEffect(() => {
    const processQueue = async () => {
      if (state.ttsQueue.length > 0 && !state.isSpeaking) {
        const nextText = state.ttsQueue[0];
        setState(prev => ({
          ...prev,
          ttsQueue: prev.ttsQueue.slice(1),
          isSpeaking: true,
        }));

        await voiceTTS.speak(nextText, {
          language: state.language,
          urgency: 'normal',
          onEnd: () => setState(prev => ({ ...prev, isSpeaking: false })),
          onError: (error) => {
            console.error('[Voice] TTS Error:', error);
            setState(prev => ({ ...prev, isSpeaking: false }));
          },
        });
      }
    };

    processQueue();
  }, [state.ttsQueue, state.isSpeaking, state.language]);

  const stopSpeaking = useCallback(() => {
    voiceTTS.stop();
    setState(prev => ({ 
      ...prev, 
      isSpeaking: false,
      ttsQueue: [] // Clear queue when stopping to prevent stale speech
    }));
  }, []);

  const clearQueue = useCallback(() => {
    voiceTTS.stop(); // Also stop any ongoing speech
    setState(prev => ({ 
      ...prev, 
      ttsQueue: [],
      isSpeaking: false 
    }));
  }, []);

  // ==================== STT METHODS ====================

  const startListening = useCallback(async () => {
    if (!state.voiceEnabled || state.isListening) return;

    setState(prev => ({ ...prev, isListening: true, transcript: '', interimTranscript: '' }));

    const recorder = await voiceSTT.startListening({
      language: state.language,
      onTranscript: (text, isFinal) => {
        if (isFinal) {
          setState(prev => ({
            ...prev,
            transcript: text,
            interimTranscript: '',
          }));
          
          // Don't execute command automatically - let the component handle it
          // The chatbot will get the transcript directly
        } else {
          setState(prev => ({ ...prev, interimTranscript: text }));
        }
      },
      onError: (error) => {
        console.error('[Voice] STT Error:', error);
        setState(prev => ({ ...prev, isListening: false }));
      },
      onEnd: () => {
        setState(prev => ({ ...prev, isListening: false }));
      },
    });

    mediaRecorderRef.current = recorder;
  }, [state.voiceEnabled, state.isListening, state.language]);

  const stopListening = useCallback(() => {
    voiceSTT.stop(mediaRecorderRef.current);
    mediaRecorderRef.current = null;
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  // ==================== VOICE COMMANDS ====================

  const executeCommand = useCallback((transcript: string) => {
    console.log('[Voice] Executing command:', transcript);

    const command = VoiceCommandParser.parseCommand(transcript);
    
    if (!command) {
      speak('Sorry, I didn\'t understand that command.');
      return;
    }

    switch (command.intent) {
      case 'emergency':
        handleEmergencyCommand();
        break;

      case 'navigate':
        const page = command.entities.page;
        router.push(`/${page}`);
        speak(`Navigating to ${page}`);
        break;

      case 'query_vitals':
        speak('Let me check your current vitals');
        // This will be handled by the component using useVoice
        break;

      case 'conversation':
        // Trigger chatbot with the question
        speak('Let me help you with that');
        router.push('/chatbot');
        break;

      default:
        speak('Command not recognized');
    }
  }, [router, speak]);

  const handleEmergencyCommand = useCallback(() => {
    // Immediately stop all other speech
    voiceTTS.stop();
    clearQueue();

    // Speak emergency acknowledgment
    speak('Emergency detected. Alerting medical team now.', {
      urgency: 'critical',
      priority: true,
    });

    // Navigate to emergency action page
    router.push('/action');

    // Trigger emergency alert (this should be handled by the action page)
    console.log('[Voice] EMERGENCY COMMAND TRIGGERED');
  }, [router, speak, clearQueue]);

  // ==================== WAKE WORD DETECTION ====================

  useEffect(() => {
    if (state.wakeWordActive && !state.isListening) {
      // Start continuous listening for wake word
      const startWakeWordDetection = async () => {
        const recorder = await voiceSTT.startListening({
          language: state.language,
          onTranscript: (text, isFinal) => {
            if (isFinal) {
              const lowerText = text.toLowerCase();
              
              // Wake word: "radar" or "hey radar"
              if (lowerText.includes('radar') || lowerText.includes('रडार')) {
                console.log('[Voice] Wake word detected!');
                speak('Yes, how can I help?');
                
                // Start full listening mode
                setTimeout(() => startListening(), 1000);
              }
            }
          },
          onError: (error) => {
            console.error('[Voice] Wake word detection error:', error);
          },
          onEnd: () => {
            // Restart wake word detection after timeout
            if (state.wakeWordActive) {
              setTimeout(startWakeWordDetection, 1000);
            }
          },
        });

        mediaRecorderRef.current = recorder;
      };

      startWakeWordDetection();
    } else if (!state.wakeWordActive && mediaRecorderRef.current) {
      // Stop wake word detection
      voiceSTT.stop(mediaRecorderRef.current);
      mediaRecorderRef.current = null;
    }

    return () => {
      if (mediaRecorderRef.current) {
        voiceSTT.stop(mediaRecorderRef.current);
        mediaRecorderRef.current = null;
      }
    };
  }, [state.wakeWordActive, state.language, state.isListening, speak, startListening]);

  // ==================== CONFIGURATION ====================

  const setLanguage = useCallback((lang: LanguageCode) => {
    setState(prev => ({ ...prev, language: lang }));
    localStorage.setItem('radar-voice-language', lang);
  }, []);

  const toggleVoice = useCallback(() => {
    setState(prev => {
      const newEnabled = !prev.voiceEnabled;
      localStorage.setItem('radar-voice-enabled', String(newEnabled));
      
      if (!newEnabled) {
        // Stop all voice activities
        voiceTTS.stop();
        if (mediaRecorderRef.current) {
          voiceSTT.stop(mediaRecorderRef.current);
          mediaRecorderRef.current = null;
        }
      }
      
      return { ...prev, voiceEnabled: newEnabled };
    });
  }, []);

  const toggleAutoSpeak = useCallback(() => {
    setState(prev => {
      const newAutoSpeak = !prev.autoSpeak;
      localStorage.setItem('radar-auto-speak', String(newAutoSpeak));
      return { ...prev, autoSpeak: newAutoSpeak };
    });
  }, []);

  const toggleWakeWord = useCallback(() => {
    setState(prev => ({ ...prev, wakeWordActive: !prev.wakeWordActive }));
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('radar-voice-language') as LanguageCode;
      const savedEnabled = localStorage.getItem('radar-voice-enabled');
      const savedAutoSpeak = localStorage.getItem('radar-auto-speak');

      setState(prev => ({
        ...prev,
        language: savedLang && SUPPORTED_LANGUAGES[savedLang] ? savedLang : 'en',
        voiceEnabled: savedEnabled !== 'false',
        autoSpeak: savedAutoSpeak !== 'false',
      }));
    }
  }, []);

  // ==================== CONTEXT VALUE ====================

  const contextValue: VoiceContextValue = {
    ...state,
    speak,
    stopSpeaking,
    clearQueue,
    startListening,
    stopListening,
    setLanguage,
    toggleVoice,
    toggleAutoSpeak,
    toggleWakeWord,
    executeCommand,
  };

  return (
    <VoiceContext.Provider value={contextValue}>
      {children}
    </VoiceContext.Provider>
  );
};

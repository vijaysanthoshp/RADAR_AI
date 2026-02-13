/**
 * R.A.D.A.R. Voice Service
 * Production-Grade Voice Integration with ElevenLabs & Deepgram
 * 
 * Features:
 * - Text-to-Speech (ElevenLabs)
 * - Speech-to-Text (Deepgram + Web Speech API)
 * - Multi-language support (English, Hindi, Tamil, Telugu)
 * - Emergency voice alerts
 * - Voice command recognition
 */

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

// ==================== CONFIGURATION ====================

export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', voice: 'Rachel' },
  hi: { code: 'hi', name: 'Hindi', voice: 'Kiran' },
  ta: { code: 'ta', name: 'Tamil', voice: 'Kavya' },
  te: { code: 'te', name: 'Telugu', voice: 'Priya' },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Medical voice presets for different urgency levels
export const VOICE_PRESETS = {
  normal: { stability: 0.7, similarity_boost: 0.7, style: 0.3 },
  urgent: { stability: 0.9, similarity_boost: 0.8, style: 0.6 },
  critical: { stability: 1.0, similarity_boost: 0.9, style: 0.8 },
} as const;

// ==================== TEXT-TO-SPEECH (ElevenLabs) ====================

class ElevenLabsTTSService {
  private client: ElevenLabsClient | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize only on client side
      const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
      if (apiKey && apiKey !== 'your_elevenlabs_key_here') {
        try {
          this.client = new ElevenLabsClient({ apiKey });
        } catch (error) {
          console.warn('[Voice] ElevenLabs init failed, using Web Speech API fallback');
          this.client = null;
        }
      }
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Convert text to speech and play it
   */
  async speak(
    text: string,
    options: {
      language?: LanguageCode;
      urgency?: keyof typeof VOICE_PRESETS;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<void> {
    const { language = 'en', urgency = 'normal', onStart, onEnd, onError } = options;

    try {
      if (!this.client) {
        // Fallback to Web Speech API if ElevenLabs not configured
        return this.speakWithWebAPI(text, { language, onStart, onEnd, onError });
      }

      onStart?.();

      const voiceId = this.getVoiceId(language);
      const voiceSettings = VOICE_PRESETS[urgency];

      // Generate audio stream
      const audio = await this.client.textToSpeech.convert(voiceId, {
        text,
        modelId: "eleven_multilingual_v2",
        voiceSettings: voiceSettings,
      });

      // Convert stream to blob - handle ReadableStream properly
      const reader = audio.getReader();
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const blob = new Blob(chunks as BlobPart[], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      // Play audio
      const audioElement = new Audio(url);
      audioElement.onended = () => {
        URL.revokeObjectURL(url);
        onEnd?.();
      };
      audioElement.onerror = (e) => {
        URL.revokeObjectURL(url);
        onError?.(new Error('Audio playback failed'));
      };

      await audioElement.play();

    } catch (error) {
      // Check if it's the ElevenLabs 401 free tier abuse detection error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('401') || errorMessage.includes('unusual_activity')) {
        console.info('[Voice Service] ElevenLabs free tier unavailable (VPN/proxy detected). Using Web Speech API.');
      } else {
        console.warn('[Voice Service] ElevenLabs TTS failed, falling back to Web Speech API:', error);
      }
      
      // Fallback to Web Speech API
      return this.speakWithWebAPI(text, { language, onStart, onEnd, onError });
    }
  }

  /**
   * Fallback to Web Speech API (free, built-in)
   */
  private speakWithWebAPI(
    text: string,
    options: {
      language?: LanguageCode;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        const error = new Error('Speech synthesis not supported');
        options.onError?.(error);
        reject(error);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getWebAPILanguageCode(options.language || 'en');
      utterance.rate = 0.9; // Slightly slower for medical content
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => options.onStart?.();
      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };
      utterance.onerror = (event) => {
        // Handle graceful errors (expected behaviors)
        if (event.error === 'not-allowed') {
          console.info('[Voice] Speech blocked by browser autoplay policy. User interaction required first.');
          options.onEnd?.(); // Treat as completed, not an error
          resolve(); // Resolve instead of reject to avoid error propagation
          return;
        }
        
        if (event.error === 'interrupted') {
          console.info('[Voice] Speech interrupted by new speech request (expected behavior).');
          options.onEnd?.(); // Treat as completed, not an error
          resolve(); // Resolve instead of reject
          return;
        }

        if (event.error === 'canceled' || event.error === 'cancelled') {
          console.info('[Voice] Speech cancelled (expected behavior).');
          options.onEnd?.();
          resolve();
          return;
        }
        
        // Only log actual errors
        console.error('[Voice] Speech synthesis error:', event.error);
        const error = new Error(`Speech synthesis error: ${event.error}`);
        options.onError?.(error);
        reject(error);
      };

      // Cancel any ongoing speech before starting new one
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Stop any ongoing speech
   */
  stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Get ElevenLabs voice ID for language
   */
  private getVoiceId(language: LanguageCode): string {
    // ElevenLabs voice IDs (use default professional voices)
    const voiceMap: Record<LanguageCode, string> = {
      en: '21m00Tcm4TlvDq8ikWAM', // Rachel
      hi: 'pNInz6obpgDQGcFmaJgB', // Adam (can speak Hindi)
      ta: 'pNInz6obpgDQGcFmaJgB', // Adam (multilingual)
      te: 'pNInz6obpgDQGcFmaJgB', // Adam (multilingual)
    };
    return voiceMap[language];
  }

  /**
   * Get Web Speech API language code
   */
  private getWebAPILanguageCode(language: LanguageCode): string {
    const codeMap: Record<LanguageCode, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
    };
    return codeMap[language];
  }
}

// ==================== SPEECH-TO-TEXT (Deepgram + Web Speech API) ====================

class DeepgramSTTService {
  private deepgram: any | null = null;
  private recognition: any | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Deepgram for production
      const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
      if (apiKey && apiKey !== 'your_deepgram_key_here') {
        this.deepgram = createClient(apiKey);
      }

      // Web Speech API as fallback
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  /**
   * Start listening for speech
   */
  async startListening(options: {
    language?: LanguageCode;
    onTranscript?: (text: string, isFinal: boolean) => void;
    onError?: (error: Error) => void;
    onEnd?: () => void;
  } = {}): Promise<MediaRecorder | null> {
    const { language = 'en', onTranscript, onError, onEnd } = options;

    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (this.deepgram) {
        // Use Deepgram for production
        return this.startDeepgramListening(stream, { language, onTranscript, onError, onEnd });
      } else {
        // Fallback to Web Speech API
        return this.startWebAPIListening({ language, onTranscript, onError, onEnd });
      }
    } catch (error) {
      console.error('[Voice Service] Microphone access denied:', error);
      onError?.(error as Error);
      return null;
    }
  }

  /**
   * Deepgram live transcription
   */
  private async startDeepgramListening(
    stream: MediaStream,
    options: {
      language: LanguageCode;
      onTranscript?: (text: string, isFinal: boolean) => void;
      onError?: (error: Error) => void;
      onEnd?: () => void;
    }
  ): Promise<MediaRecorder> {
    const { language, onTranscript, onError, onEnd } = options;

    // Create live transcription connection
    const connection = this.deepgram.listen.live({
      model: 'nova-2',
      language: this.getDeepgramLanguageCode(language),
      smart_format: true,
      punctuate: true,
      interim_results: true,
    });

    connection.on(LiveTranscriptionEvents.Open, () => {
      console.log('[Deepgram] Connection opened');
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
      const transcript = data.channel.alternatives[0].transcript;
      const isFinal = data.is_final;
      
      if (transcript && transcript.trim().length > 0) {
        onTranscript?.(transcript, isFinal);
      }
    });

    connection.on(LiveTranscriptionEvents.Error, (error: any) => {
      console.error('[Deepgram] Error:', error);
      onError?.(new Error(error));
    });

    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log('[Deepgram] Connection closed');
      onEnd?.();
    });

    // Stream audio to Deepgram
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm',
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && connection.getReadyState() === 1) {
        connection.send(event.data);
      }
    };

    mediaRecorder.start(250); // Send data every 250ms

    return mediaRecorder;
  }

  /**
   * Fallback to Web Speech API
   */
  private startWebAPIListening(options: {
    language: LanguageCode;
    onTranscript?: (text: string, isFinal: boolean) => void;
    onError?: (error: Error) => void;
    onEnd?: () => void;
  }): null {
    const { language, onTranscript, onError, onEnd } = options;

    if (!this.recognition) {
      onError?.(new Error('Speech recognition not supported'));
      return null;
    }

    this.recognition.lang = this.getWebAPILanguageCode(language);

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      
      onTranscript?.(transcript, isFinal);
    };

    this.recognition.onerror = (event: any) => {
      onError?.(new Error(event.error));
    };

    this.recognition.onend = () => {
      onEnd?.();
    };

    this.recognition.start();

    return null; // Web Speech API manages its own lifecycle
  }

  /**
   * Stop listening
   */
  stop(recorder?: MediaRecorder | null): void {
    if (recorder) {
      recorder.stop();
      recorder.stream.getTracks().forEach(track => track.stop());
    }

    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Get Deepgram language code
   */
  private getDeepgramLanguageCode(language: LanguageCode): string {
    const codeMap: Record<LanguageCode, string> = {
      en: 'en-US',
      hi: 'hi',
      ta: 'ta',
      te: 'te',
    };
    return codeMap[language];
  }

  /**
   * Get Web Speech API language code
   */
  private getWebAPILanguageCode(language: LanguageCode): string {
    const codeMap: Record<LanguageCode, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
    };
    return codeMap[language];
  }
}

// ==================== VOICE COMMAND PARSER ====================

export class VoiceCommandParser {
  /**
   * Parse voice command and extract intent
   */
  static parseCommand(transcript: string): {
    intent: string;
    confidence: number;
    entities: Record<string, any>;
  } | null {
    const text = transcript.toLowerCase().trim();

    // Emergency commands (highest priority)
    if (this.matchesPatterns(text, [
      'emergency', 'help', 'call doctor', 'call emergency',
      'urgent', 'critical', 'can\'t breathe', 'chest pain',
      'आपातकाल', 'मदद', // Hindi
      'அவசரம்', 'உதவி', // Tamil
      'అత్యవసరం', 'సహాయం', // Telugu
    ])) {
      return { intent: 'emergency', confidence: 1.0, entities: {} };
    }

    // Navigation commands
    const navPatterns: Record<string, string[]> = {
      dashboard: ['dashboard', 'home', 'main page'],
      cardiovascular: ['heart', 'cardiac', 'cardiovascular'],
      renal: ['kidney', 'renal', 'urea'],
      respiratory: ['lung', 'breathing', 'respiratory', 'oxygen'],
      doctor: ['doctor', 'appointment', 'consultation'],
      chatbot: ['chat', 'talk', 'assistant', 'ask question'],
    };

    for (const [page, patterns] of Object.entries(navPatterns)) {
      if (this.matchesPatterns(text, patterns)) {
        return { intent: 'navigate', confidence: 0.9, entities: { page } };
      }
    }

    // Query commands
    if (this.matchesPatterns(text, [
      'what is my', 'show my', 'tell me my', 'read my', 'check my',
      'मेरा', 'बताओ', // Hindi
      'என்', 'சொல்லு', // Tamil
      'నా', 'చెప్పు', // Telugu
    ])) {
      return { intent: 'query_vitals', confidence: 0.8, entities: {} };
    }

    // Conversational query
    if (this.matchesPatterns(text, [
      'should i worry', 'am i okay', 'is this bad', 'what should i do',
      'help me understand', 'explain', 'why is', 'what does',
    ])) {
      return { intent: 'conversation', confidence: 0.7, entities: { question: transcript } };
    }

    return null; // No recognized command
  }

  /**
   * Check if text matches any pattern
   */
  private static matchesPatterns(text: string, patterns: string[]): boolean {
    return patterns.some(pattern => text.includes(pattern));
  }
}

// ==================== SINGLETON INSTANCES ====================

export const voiceTTS = new ElevenLabsTTSService();
export const voiceSTT = new DeepgramSTTService();

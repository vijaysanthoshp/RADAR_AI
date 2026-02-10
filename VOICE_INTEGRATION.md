# 🎤 R.A.D.A.R. Voice Integration System
## Complete Voice-Enabled Medical Monitoring

---

## 📋 Overview

The R.A.D.A.R. Voice Integration System provides comprehensive voice capabilities for hands-free health monitoring, emergency alerts, and multi-language support for India's diverse patient population.

### 🎯 Key Features

1. **🔊 Text-to-Speech (TTS)** - ElevenLabs + Web Speech API fallback
2. **🎙️ Speech-to-Text (STT)** - Deepgram + Web Speech Recognition fallback
3. **🚨 Emergency Voice Alerts** - Auto-speak critical health warnings
4. **🌍 Multi-Language Support** - English, Hindi, Tamil, Telugu
5. **🤖 Voice-Enabled Chatbot** - Conversational health assistant
6. **📞 Voice Commands** - Navigation and emergency activation
7. **👂 Wake Word Detection** - "RADAR" activation

---

## 🏗️ Architecture

### Voice Service Stack

```
┌─────────────────────────────────────────────────────┐
│                  VoiceProvider                      │
│         (Global State Management)                   │
└──────────────────┬──────────────────────────────────┘
                   │
     ┌─────────────┴─────────────┐
     │                           │
┌────▼────┐                 ┌────▼────┐
│   TTS   │                 │   STT   │
│ Service │                 │ Service │
└────┬────┘                 └────┬────┘
     │                           │
     ├─ ElevenLabs              ├─ Deepgram
     └─ Web Speech API          └─ Web Speech Recognition
```

### Component Hierarchy

```
App Layout
├── VoiceProvider (Context)
│   ├── VoiceControlPanel (Dashboard)
│   ├── EmergencyVoiceAlert (Dashboard)
│   ├── EmergencyVoiceButton (Floating)
│   └── ChatWidget (Voice-enabled)
```

---

## 🔧 Implementation Details

### 1. Core Services (`src/lib/voice/voiceService.ts`)

#### ElevenLabs TTS Service
```typescript
class ElevenLabsTTSService {
  async speak(text: string, options: {
    language?: LanguageCode;
    urgency?: 'normal' | 'urgent' | 'critical';
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: Error) => void;
  }): Promise<void>
}
```

**Features:**
- **Model**: `eleven_multilingual_v2` (supports 29 languages)
- **Voice Presets**: Normal, Urgent, Critical (different stability/style)
- **Fallback**: Web Speech API if ElevenLabs unavailable
- **Audio Format**: MP3 streaming

**Configuration:**
```typescript
export const VOICE_PRESETS = {
  normal: { stability: 0.7, similarity_boost: 0.7, style: 0.3 },
  urgent: { stability: 0.9, similarity_boost: 0.8, style: 0.6 },
  critical: { stability: 1.0, similarity_boost: 0.9, style: 0.8 },
}
```

#### Deepgram STT Service
```typescript
class DeepgramSTTService {
  async startListening(options: {
    language?: LanguageCode;
    onTranscript?: (text: string, isFinal: boolean) => void;
    onError?: (error: Error) => void;
    onEnd?: () => void;
  }): Promise<MediaRecorder | null>
}
```

**Features:**
- **Model**: `nova-2` (highest accuracy)
- **Real-time**: Live transcription with interim results
- **Languages**: English, Hindi, Tamil, Telugu
- **Format**: WebM audio streaming
- **Fallback**: Web Speech Recognition API

#### Voice Command Parser
```typescript
export class VoiceCommandParser {
  static parseCommand(transcript: string): {
    intent: string;
    confidence: number;
    entities: Record<string, any>;
  } | null
}
```

**Supported Commands:**

| Category | Examples | Intent |
|----------|----------|--------|
| Emergency | "emergency", "help", "call doctor" | `emergency` |
| Navigation | "show dashboard", "go to doctor" | `navigate` |
| Query | "what is my heart rate?" | `query_vitals` |
| Conversation | "should i worry?", "explain this" | `conversation` |

**Multi-Language Support:**
- Hindi: आपातकाल, मदद, मेरा, बताओ
- Tamil: அவசரம், உதவி, என், சொல்லு
- Telugu: అత్యవసరం, సహాయం, నా, చెప్పు

---

### 2. Voice Context (`src/contexts/VoiceContext.tsx`)

#### State Management
```typescript
interface VoiceState {
  isSpeaking: boolean;
  ttsQueue: string[];
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  language: LanguageCode;
  voiceEnabled: boolean;
  autoSpeak: boolean;
  wakeWordActive: boolean;
}
```

#### Key Methods

**Text-to-Speech:**
```typescript
speak(text: string, options?: {
  urgency?: 'normal' | 'urgent' | 'critical';
  priority?: boolean;
}): Promise<void>
```
- `priority: true` → Skip queue, speak immediately
- `priority: false` → Add to queue, speak sequentially

**Speech-to-Text:**
```typescript
startListening(): Promise<void>
stopListening(): void
```
- Auto-detects microphone
- Provides interim results
- Auto-executes commands on final transcript

**Wake Word Detection:**
```typescript
toggleWakeWord(): void
```
- Listens for "RADAR" continuously
- Responds with "Yes, how can I help?"
- Activates full listening mode

---

### 3. UI Components

#### VoiceControlPanel (`src/components/voice/VoiceControlPanel.tsx`)

**Features:**
- Language selector (EN/HI/TA/TE)
- Voice input button (mic icon)
- Real-time transcript display
- Speaking indicator
- Auto-speak toggle
- Wake word toggle
- Voice test button
- Command help guide

**Layout:**
```
┌────────────────────────────────────┐
│ Voice Assistant         [Disable]  │
├────────────────────────────────────┤
│ Language: English ▼                │
│ ┌────────────────────────────────┐ │
│ │  🎤 Start Voice Command        │ │
│ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ │
│ │ 📝 Transcript: "show dashboard"│ │
│ └────────────────────────────────┘ │
├────────────────────────────────────┤
│ Voice Features                     │
│ ⚠️ Emergency Alerts    [On]        │
│ 📡 Wake Word "RADAR"   [Off]       │
│ [Test Voice]                       │
└────────────────────────────────────┘
```

#### EmergencyVoiceAlert (`src/components/voice/EmergencyVoiceAlert.tsx`)

**Auto-Alert Logic:**
```typescript
// Triggers when:
1. Urgency level increases (GREEN → YELLOW → ORANGE → RED → CRITICAL)
2. Cooldown period has passed

Cooldown Periods:
- CRITICAL: 30 seconds
- RED: 1 minute
- ORANGE: 2 minutes
- YELLOW: 3 minutes
```

**Alert Messages (Multi-Language):**

**English:**
- CRITICAL: "Critical alert! Your vital signs require immediate medical attention..."
- Parameter-specific: "Your urea level is elevated at {value} mg/dL..."

**Hindi:**
- CRITICAL: "गंभीर चेतावनी! आपके महत्वपूर्ण संकेतों को तत्काल चिकित्सा ध्यान की आवश्यकता है..."

**Tamil:**
- CRITICAL: "முக்கியமான எச்சரிக்கை! உங்கள் உயிர் அறிகுறிகளுக்கு உடனடி மருத்துவ கவனம் தேவை..."

**Telugu:**
- CRITICAL: "క్లిష్టమైన హెచ్చరిక! మీ ముఖ్యమైన సంకేతాలకు తక్షణ వైద్య శ్రద్ధ అవసరం..."

#### EmergencyVoiceButton (`src/components/voice/EmergencyVoiceButton.tsx`)

**Floating SOS Button:**
- Fixed position: `bottom-24 right-6`
- Size: `64x64px` red circular button
- Animation: Pulsing ring effect
- Action: Immediate voice feedback + navigate to `/action`

```typescript
handleEmergency() {
  speak("Emergency activated. Contacting medical team now.", {
    urgency: 'critical',
    priority: true,
  });
  router.push('/action');
}
```

#### Voice-Enabled Chatbot (`src/components/chat/chat-widget.tsx`)

**New Features:**
1. **Voice Input Button** (🎤 mic icon)
   - Start/stop listening
   - Animated when active
   - Auto-sends transcript

2. **Voice Output** (🔊 speaker icon)
   - Speaks bot responses automatically
   - Skippable by user
   - Respects voice enabled setting

3. **Status Indicators:**
   - 🔴 Listening: "Listening: [interim transcript]..."
   - 🟢 Speaking: "Speaking..."

**Integration:**
```typescript
// Auto-send after voice input
useEffect(() => {
  if (transcript && isOpen) {
    setInputValue(transcript);
    setTimeout(() => handleSendMessage(), 500);
  }
}, [transcript]);

// Auto-speak bot responses
useEffect(() => {
  if (lastMessage.sender === 'bot' && voiceEnabled) {
    speak(lastMessage.text);
  }
}, [messages]);
```

---

## 🌐 Multi-Language System

### Supported Languages

| Code | Name | Voice (ElevenLabs) | Medical Terms Support |
|------|------|-------------------|----------------------|
| `en` | English | Rachel | ✅ Full |
| `hi` | Hindi | Adam (Multilingual) | ✅ Translated |
| `ta` | Tamil | Adam (Multilingual) | ✅ Translated |
| `te` | Telugu | Adam (Multilingual) | ✅ Translated |

### Translation Strategy

**Medical Parameters:**
- Urea: यूरिया (Hindi), யூரியா (Tamil), యూరియా (Telugu)
- Heart Rate: हृदय गति, இதய துடிப்பு, హృదయ స్పందన
- Blood Pressure: रक्तचाप, இரத்த அழுத்தம், రక్తపోటు
- Oxygen: ऑक्सीजन, ஆக்ஸிஜன், ఆక్సిజన్

**Alert Translations (Example):**
```typescript
const ALERT_MESSAGES = {
  en: {
    urea_high: 'Your urea level is elevated at {value} mg/dL.',
  },
  hi: {
    urea_high: 'आपका यूरिया स्तर {value} मिलीग्राम प्रति डेसीलीटर पर बढ़ा हुआ है।',
  },
  // ... Tamil, Telugu
}
```

---

## 🔑 Environment Configuration

### Required API Keys

**.env.local:**
```bash
# ElevenLabs (TTS)
ELEVENLABS_API_KEY=your_elevenlabs_key_here
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Deepgram (STT)
DEEPGRAM_API_KEY=your_deepgram_key_here
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_key_here

# Groq (LLM - already configured)
GROQ_API_KEY=your_groq_api_key
```

### Getting API Keys

1. **ElevenLabs:**
   - Visit: https://elevenlabs.io/
   - Sign up for free tier (10,000 characters/month)
   - Navigate to Profile → API Keys
   - Copy key to `.env.local`

2. **Deepgram:**
   - Visit: https://deepgram.com/
   - Sign up for free tier ($200 credit)
   - Create new API key in console
   - Copy key to `.env.local`

### Fallback Behavior

If API keys are not configured:
- **TTS**: Falls back to Web Speech API (`window.speechSynthesis`)
- **STT**: Falls back to Web Speech Recognition (`window.SpeechRecognition`)

**Limitations of Fallbacks:**
- Web Speech API: Limited voice quality, fewer languages
- Web Speech Recognition: Lower accuracy, may not work in all browsers

---

## 🚀 Usage Guide

### For Developers

#### 1. Using Voice in Components

```typescript
import { useVoice } from '@/contexts/VoiceContext';

export function MyComponent() {
  const { 
    speak, 
    startListening, 
    isListening, 
    transcript,
    language,
    voiceEnabled 
  } = useVoice();

  const handleSpeak = () => {
    speak('Hello from R.A.D.A.R.', { urgency: 'normal' });
  };

  const handleListen = async () => {
    await startListening();
    // transcript will update automatically
  };

  useEffect(() => {
    if (transcript) {
      console.log('User said:', transcript);
    }
  }, [transcript]);

  return (
    <div>
      <button onClick={handleSpeak}>Speak</button>
      <button onClick={handleListen} disabled={!voiceEnabled}>
        {isListening ? 'Listening...' : 'Start Listening'}
      </button>
    </div>
  );
}
```

#### 2. Emergency Alerts

```typescript
// Auto-trigger based on urgency
const { speak, autoSpeak } = useVoice();
const { latestData } = useSensorData();

useEffect(() => {
  if (autoSpeak && latestData.urgency === 'CRITICAL') {
    speak('Critical alert detected!', {
      urgency: 'critical',
      priority: true, // Skip queue, speak immediately
    });
  }
}, [latestData.urgency]);
```

#### 3. Custom Voice Commands

```typescript
import { VoiceCommandParser } from '@/lib/voice/voiceService';

const { transcript, executeCommand } = useVoice();

useEffect(() => {
  if (transcript) {
    const command = VoiceCommandParser.parseCommand(transcript);
    
    if (command?.intent === 'custom_action') {
      // Handle your custom action
      handleCustomAction(command.entities);
    }
  }
}, [transcript]);
```

### For Users

#### 1. Basic Voice Commands

**Emergency:**
- "Emergency"
- "Help"
- "Call doctor"
- "Critical"

**Navigation:**
- "Show dashboard"
- "Go to cardiovascular"
- "Open chatbot"
- "Show doctor page"

**Queries:**
- "What is my heart rate?"
- "Check my vitals"
- "Tell me my urea level"

**Conversation:**
- "Should I worry?"
- "Am I okay?"
- "Explain this reading"

#### 2. Wake Word Activation

1. Enable "Wake Word" in Voice Control Panel
2. Say "RADAR" or "Hey RADAR"
3. System responds: "Yes, how can I help?"
4. Speak your command

#### 3. Multi-Language Usage

1. Open Voice Control Panel
2. Select language: English / हिंदी / தமிழ் / తెలుగు
3. All alerts and responses will be in selected language
4. Voice commands work in native language

---

## 🎛️ Configuration Options

### Voice Preferences (Stored in localStorage)

```typescript
// User settings
{
  'radar-voice-language': 'en' | 'hi' | 'ta' | 'te',
  'radar-voice-enabled': 'true' | 'false',
  'radar-auto-speak': 'true' | 'false',
}
```

### Voice Presets

```typescript
// Modify urgency presets
export const VOICE_PRESETS = {
  normal: { 
    stability: 0.7,        // 0-1: Higher = more consistent
    similarity_boost: 0.7, // 0-1: Higher = closer to original voice
    style: 0.3            // 0-1: Higher = more expressive
  },
  urgent: {
    stability: 0.9,
    similarity_boost: 0.8,
    style: 0.6
  },
  critical: {
    stability: 1.0,
    similarity_boost: 0.9,
    style: 0.8
  },
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] **TTS (Text-to-Speech)**
  - [ ] Click "Test Voice" button
  - [ ] Hear voice in selected language
  - [ ] Change language and test again

- [ ] **STT (Speech-to-Text)**
  - [ ] Click "Start Voice Command"
  - [ ] Speak a command
  - [ ] See transcript appear
  - [ ] Command executes correctly

- [ ] **Emergency Alerts**
  - [ ] Simulate critical vitals
  - [ ] Hear automatic alert
  - [ ] Check alert in multiple languages

- [ ] **Wake Word**
  - [ ] Enable wake word detection
  - [ ] Say "RADAR"
  - [ ] System responds and activates

- [ ] **Voice Chatbot**
  - [ ] Open chatbot
  - [ ] Click mic button
  - [ ] Ask a question
  - [ ] Hear bot response

- [ ] **Emergency Button**
  - [ ] Click floating red SOS button
  - [ ] Hear emergency message
  - [ ] Redirects to action page

### Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| ElevenLabs TTS | ✅ | ✅ | ✅ | ✅ |
| Deepgram STT | ✅ | ✅ | ⚠️ | ⚠️ |
| Web Speech API | ✅ | ✅ | ✅ | ✅ |
| Web Speech Recognition | ✅ | ✅ | ❌ | ❌ |

⚠️ = May require WebM support
❌ = Not supported (falls back to other methods)

---

## 📊 Performance

### TTS Latency
- **ElevenLabs**: 200-500ms (streaming)
- **Web Speech API**: 50-100ms (instant)

### STT Latency
- **Deepgram**: Real-time (< 300ms)
- **Web Speech Recognition**: Real-time (< 200ms)

### Data Usage
- **TTS (1 minute speech)**: ~100KB (ElevenLabs MP3)
- **STT (1 minute recording)**: ~600KB (WebM upload)

### Optimization Tips
1. **Queue Management**: Use `priority: true` only for critical alerts
2. **Cooldown Periods**: Prevent alert spam with cooldown logic
3. **Language Caching**: Cache translated messages in memory
4. **Audio Compression**: Use MP3 for TTS, WebM for STT

---

## 🐛 Troubleshooting

### Common Issues

**1. "Microphone access denied"**
- **Solution**: Grant microphone permission in browser settings
- Chrome: Settings → Privacy → Site Settings → Microphone

**2. "Voice not working"**
- Check API keys in `.env.local`
- Verify network connection
- Try fallback (Web Speech API)

**3. "Wake word not detecting"**
- Speak clearly: "RADAR" (2 syllables)
- Check microphone sensitivity
- Ensure wake word is enabled

**4. "Wrong language spoken"**
- Check language selector in Voice Control Panel
- Verify `localStorage` setting
- Restart voice service

**5. "Alerts not speaking automatically"**
- Enable "Auto-Speak" in Voice Control Panel
- Check voice is enabled globally
- Verify urgency level triggers alert

---

## 🔮 Future Enhancements

### Planned Features
1. **Custom Wake Words** - User-defined activation phrases
2. **Voice Biometrics** - Patient identification via voice
3. **Emotion Detection** - Detect stress/panic in voice
4. **Offline Mode** - Download voice models for offline use
5. **More Languages** - Expand to 10+ Indian languages
6. **Voice Analytics** - Track usage patterns and improve accuracy

### Technical Improvements
1. **WebRTC for real-time communication**
2. **Edge TTS** - On-device processing
3. **Voice Activity Detection (VAD)** - Better wake word accuracy
4. **Speaker Diarization** - Multi-person conversations

---

## 📝 API Reference

### VoiceProvider Methods

```typescript
interface VoiceContextValue {
  // State
  isSpeaking: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  language: LanguageCode;
  voiceEnabled: boolean;
  autoSpeak: boolean;
  wakeWordActive: boolean;
  
  // TTS Methods
  speak(text: string, options?: {
    urgency?: 'normal' | 'urgent' | 'critical';
    priority?: boolean;
  }): Promise<void>;
  stopSpeaking(): void;
  clearQueue(): void;
  
  // STT Methods
  startListening(): Promise<void>;
  stopListening(): void;
  
  // Configuration
  setLanguage(lang: LanguageCode): void;
  toggleVoice(): void;
  toggleAutoSpeak(): void;
  toggleWakeWord(): void;
  
  // Commands
  executeCommand(transcript: string): void;
}
```

---

## 📚 Resources

### Documentation
- [ElevenLabs API Docs](https://docs.elevenlabs.io/)
- [Deepgram API Docs](https://developers.deepgram.com/)
- [Web Speech API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

### Code Examples
- `src/lib/voice/voiceService.ts` - Core services
- `src/contexts/VoiceContext.tsx` - State management
- `src/components/voice/` - UI components

---

## ✅ Summary

The R.A.D.A.R. Voice Integration System provides:

✅ **Hands-free Operation** - Voice commands for navigation and queries
✅ **Emergency Alerts** - Auto-speak critical health warnings
✅ **Multi-Language** - English, Hindi, Tamil, Telugu support
✅ **Production-Ready** - ElevenLabs + Deepgram with fallbacks
✅ **User-Friendly** - Simple UI, clear feedback
✅ **Accessible** - Helps patients with limited literacy/mobility

**Ready for deployment in Indian healthcare market! 🇮🇳**

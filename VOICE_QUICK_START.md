# 🎤 Voice Integration - Quick Start Guide

## ✅ Implementation Complete!

Your R.A.D.A.R. system now has **full voice capabilities** with multi-language support.

---

## 🚀 What's Been Added

### 1. Core Voice Services (`src/lib/voice/voiceService.ts`)
- ✅ **ElevenLabs TTS** - High-quality text-to-speech
- ✅ **Deepgram STT** - Real-time speech-to-text
- ✅ **Web Speech API Fallbacks** - Works without API keys
- ✅ **Voice Command Parser** - Intent recognition
- ✅ **Multi-Language Support** - EN, HI, TA, TE

### 2. Voice Context (`src/contexts/VoiceContext.tsx`)
- ✅ Global state management
- ✅ TTS queue system
- ✅ Wake word detection ("RADAR")
- ✅ Command execution pipeline
- ✅ LocalStorage preferences

### 3. UI Components
- ✅ **VoiceControlPanel** - Main voice controls
- ✅ **EmergencyVoiceAlert** - Auto-speak critical alerts
- ✅ **EmergencyVoiceButton** - Floating SOS button
- ✅ **Voice-Enabled Chatbot** - Conversational AI

### 4. Integration
- ✅ Added VoiceProvider to app layout
- ✅ Updated dashboard with voice controls
- ✅ Enhanced chatbot with voice I/O
- ✅ Emergency button in all pages

---

## 🔧 Setup Instructions

### Step 1: Install Dependencies (Already Done ✅)
```bash
pnpm add @elevenlabs/elevenlabs-js @deepgram/sdk
```

### Step 2: Configure API Keys

**Get Your Keys:**

1. **ElevenLabs (TTS):**
   - Visit: https://elevenlabs.io/
   - Sign up → Get API key
   - Free tier: 10,000 characters/month

2. **Deepgram (STT):**
   - Visit: https://deepgram.com/
   - Sign up → Create API key
   - Free tier: $200 credit

**Add to `.env.local`:**
```bash
# ElevenLabs
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxx

# Deepgram
DEEPGRAM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_DEEPGRAM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Test Voice Features

1. **Start the dev server:**
   ```bash
   pnpm dev
   ```

2. **Navigate to Dashboard**
3. **Find "Voice Assistant" section**
4. **Click "Test Voice"** - Should hear a voice
5. **Click "Start Voice Command"** - Speak a command
6. **Try Emergency Button** - Bottom-right red SOS button

---

## 🎯 Key Features

### 1. Emergency Voice Alerts
- **Auto-speaks** when vitals reach dangerous levels
- **Multi-language** alerts (EN/HI/TA/TE)
- **Cooldown system** prevents alert spam
- **Priority alerts** for CRITICAL situations

**Example:**
```
Urea: 150 mg/dL → Urgency: RED
🔊 "High risk alert detected. Your urea level is dangerously high at 150 milligrams per deciliter. Immediate medical attention required."
```

### 2. Voice Commands
- **Emergency:** "emergency", "help", "call doctor"
- **Navigation:** "show dashboard", "go to doctor"
- **Queries:** "what is my heart rate?"
- **Conversation:** "should i worry?", "explain this"

### 3. Wake Word Detection
- Say **"RADAR"** to activate
- System responds: "Yes, how can I help?"
- Hands-free operation

### 4. Multi-Language Support
- **English**: Full medical terminology
- **Hindi (हिंदी)**: Translated alerts
- **Tamil (தமிழ்)**: Translated alerts
- **Telugu (తెలుగు)**: Translated alerts

### 5. Voice-Enabled Chatbot
- **Voice Input:** Click mic → speak question
- **Voice Output:** Bot responses are spoken aloud
- **Real-time transcript:** See what you're saying
- **Auto-send:** Automatically sends voice input

---

## 📱 User Interface

### Dashboard - Voice Assistant Section
```
┌────────────────────────────────────────────┐
│  🎤 Voice Assistant                        │
│  Hands-free health monitoring              │
├────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  │
│  │  Voice Control Panel                 │  │
│  │  • Language: English ▼               │  │
│  │  • [🎤 Start Voice Command]          │  │
│  │  • Emergency Alerts: On              │  │
│  │  • Wake Word "RADAR": Off            │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  ⚠️ Emergency Voice Alerts           │  │
│  │  Auto-speak critical warnings        │  │
│  │  [On] [Test]                         │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

### Floating Buttons (Bottom-right)
- **Red SOS Button** (bottom-24) - Emergency activation
- **Blue Chat Button** (bottom-6) - Chatbot

---

## 🧪 Testing Checklist

### Manual Tests:

- [ ] **Voice Output (TTS)**
  1. Go to Dashboard → Voice Assistant
  2. Click "Test Voice"
  3. Should hear: "Voice system is working correctly..."

- [ ] **Voice Input (STT)**
  1. Click "Start Voice Command"
  2. Say "show dashboard"
  3. Should see transcript appear

- [ ] **Emergency Alerts**
  1. Wait for vitals to reach RED/CRITICAL
  2. Should hear automatic alert
  3. Check alert in different languages

- [ ] **Voice Chatbot**
  1. Open chatbot (blue button)
  2. Click microphone icon
  3. Ask: "What is my heart rate?"
  4. Should hear bot response

- [ ] **Emergency Button**
  1. Click red SOS button
  2. Should hear: "Emergency activated..."
  3. Redirects to action page

- [ ] **Wake Word**
  1. Enable "Wake Word"
  2. Say "RADAR"
  3. System responds and listens

### Browser Tests:
- [ ] Chrome/Edge (recommended)
- [ ] Firefox (fallback may be needed)
- [ ] Safari (WebM support may vary)

---

## 💡 Usage Tips

### For Best Results:

1. **Use Chrome/Edge** - Best microphone support
2. **Grant Microphone Permission** - Required for STT
3. **Speak Clearly** - For accurate recognition
4. **Use Headphones** - Prevents echo/feedback
5. **Configure API Keys** - For best quality

### Troubleshooting:

**Voice not working?**
- Check API keys in `.env.local`
- Try "Test Voice" button
- Look for console errors

**Microphone access denied?**
- Browser Settings → Privacy → Microphone
- Grant permission to localhost

**Wrong language?**
- Check language selector
- Refresh page if needed

---

## 🔮 What's Next?

### Recommended Enhancements:

1. **Custom Voice Profiles**
   - Let users choose from multiple voices
   - Add voice speed/pitch controls

2. **Offline Mode**
   - Download voice models
   - Work without internet

3. **Voice Analytics**
   - Track command usage
   - Improve recognition accuracy

4. **More Languages**
   - Add: Marathi, Bengali, Gujarati, Kannada
   - Expand to 10+ Indian languages

5. **Voice Biometrics**
   - Patient identification via voice
   - Enhanced security

---

## 📚 Documentation

### Full Documentation:
- **VOICE_INTEGRATION.md** - Complete technical reference

### Key Files:
- `src/lib/voice/voiceService.ts` - Core services
- `src/contexts/VoiceContext.tsx` - State management
- `src/components/voice/` - UI components

### API Docs:
- [ElevenLabs](https://docs.elevenlabs.io/)
- [Deepgram](https://developers.deepgram.com/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## ✅ Summary

Your R.A.D.A.R. system now includes:

✅ **Production-ready voice system**
✅ **Multi-language support** (4 Indian languages)
✅ **Emergency voice alerts** with auto-speak
✅ **Voice-enabled chatbot** for consultations
✅ **Voice commands** for navigation
✅ **Wake word detection** ("RADAR")
✅ **Floating emergency SOS button**
✅ **Fallback to Web Speech API** (works without API keys)

**Next Steps:**
1. Add API keys to `.env.local`
2. Test voice features
3. Enable for production users

**Ready to revolutionize dialysis patient care with voice! 🎤🇮🇳**

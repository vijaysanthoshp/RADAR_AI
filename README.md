# 🏥 R.A.D.A.R. AI - Real-time Analysis & Dialysis Alert Response

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-96.7%25-blue)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-Agent-green)](https://www.langchain.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> An intelligent medical monitoring system for dialysis patients with AI-powered analysis, real-time alerts, and multi-parameter health tracking.

## 🌟 Overview

R.A.D.A.R. AI is a comprehensive healthcare monitoring platform designed specifically for interdialytic patient care. It bridges the critical "monitoring vacuum" between dialysis sessions by providing continuous 4-parameter surveillance, AI-driven risk assessment, and actionable clinical insights.

### Key Features

- 🤖 **AI Agent System** - LangChain-powered medical assistant with autonomous decision-making
- 💬 **Intelligent Chatbot** - Context-aware conversations with real-time patient data integration
- 🎤 **Voice Integration** - Multi-language TTS/STT support (English, Hindi, Tamil, Telugu)
- 📊 **Real-time Monitoring** - 4-parameter health tracking (Urea, Fluid, Heart Rate, SpO2)
- ⚡ **Smart Alerts** - Risk-stratified notifications with automated escalation
- 🗺️ **Emergency Navigation** - Interactive map with nearby hospitals and clinics
- 📈 **Health Analytics** - Trend analysis and historical data visualization
- 🏥 **Appointment Booking** - Integrated scheduling with healthcare providers

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 16.0.7 (React 19.2.0)
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- React Three Fiber for 3D models
- Leaflet for maps

**AI & Backend:**
- LangChain & LangGraph (Agent framework)
- GROQ API (LLM - Llama 3.3 70B)
- Deepgram (Speech-to-Text)
- ElevenLabs (Text-to-Speech)
- Supabase (Authentication & Database)

**Medical Decision Tools:**
- Patient history retrieval
- Medical guidelines (KDIGO, NKF, AHA)
- Risk trajectory analysis
- Alert escalation system
- Specialist recommendation

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vijaysanthoshp/RADAR_AI.git
   cd RADAR_AI
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Required: GROQ API for LLM
   GROQ_API_KEY=your_groq_api_key_here
   
   # Optional: For enhanced voice features
   NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key
   NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_key
   
   # Database (if using Supabase)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Getting API Keys

### GROQ API (Required)
1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Generate an API key
4. Add to `.env.local` as `GROQ_API_KEY`

### ElevenLabs (Optional)
- For enhanced text-to-speech quality
- Get key from [https://elevenlabs.io](https://elevenlabs.io)
- Falls back to Web Speech API if not provided

### Deepgram (Optional)
- For advanced speech recognition
- Get key from [https://deepgram.com](https://deepgram.com)
- Falls back to Web Speech API if not provided

## 📖 Usage

### Patient Monitoring Dashboard
- View real-time vital signs
- Track 4-parameter health metrics
- Monitor risk levels with color-coded alerts
- Access historical trends

### AI Chatbot
- Ask questions about your vitals
- Get personalized health insights
- Access medical guidelines
- Receive actionable recommendations

### Voice Controls
- **Auto-speak toggle** - Enable/disable automatic voice responses
- **Voice input** - Ask questions using your microphone
- **Stop speaking** - Interrupt voice output anytime
- **Multi-language** - Switch between EN, HI, TA, TE

### Emergency Response
- View nearby hospitals on interactive map
- Get directions to emergency facilities
- Book appointments with doctors
- Escalate critical alerts automatically

## 📚 Documentation

- [Agentic System Documentation](AGENTIC_SYSTEM_DOCS.md) - AI agent architecture and tools
- [Voice Integration Guide](VOICE_INTEGRATION.md) - Voice features and multi-language support
- [Voice Quick Start](VOICE_QUICK_START.md) - Quick setup for voice features
- [Architecture Diagram](ARCHITECTURE_DIAGRAM.md) - System design overview
- [Implementation Status](IMPLEMENTATION_COMPLETE.md) - Feature completion status

## 🎯 Project Structure

```
RADAR_AI/
├── src/
│   ├── app/
│   │   ├── (radar)/          # Main app routes
│   │   │   ├── dashboard/    # Patient dashboard
│   │   │   ├── action/       # Emergency actions
│   │   │   ├── chatbot/      # AI assistant
│   │   │   └── ...
│   │   └── api/              # API routes
│   │       ├── agent-chat/   # LangChain agent endpoint
│   │       ├── agent-analysis/ # Risk analysis
│   │       └── data/         # Sensor data stream
│   ├── components/
│   │   ├── agent/            # Agentic UI components
│   │   ├── chat/             # Chatbot widgets
│   │   ├── voice/            # Voice controls
│   │   └── ui/               # Reusable UI
│   ├── contexts/             # React contexts
│   ├── lib/
│   │   ├── agents/           # LangChain agents & tools
│   │   └── voice/            # Voice services
│   └── ...
├── public/                   # Static assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Contributors

- **Vijay Santos** - [@vijaysanthoshp](https://github.com/vijaysanthoshp)
- **Manasa V** - [@maanu-v](https://github.com/maanu-v)
- **Kaniska Murugesh** - [@kaniska-m](https://github.com/kaniska-m)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Medical guidelines from KDIGO, NKF, and AHA
- LangChain community for agent frameworks
- GROQ for fast LLM inference
- Amrita School of Computing for academic support

## 📧 Contact

For questions or support, please open an issue or contact the maintainers.

---

**Built with ❤️ for better healthcare outcomes**

"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  AlertTriangle, 
  Clock, 
  Check, 
  Ambulance, 
  Building2
} from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useState, useEffect, useRef } from "react"
import { BookingModal } from "@/components/action/BookingModal"
import { useVoice } from "@/contexts/VoiceContext"

// Dynamically import Map component with no SSR
const Map = dynamic(() => import("@/components/map/Map"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-100 rounded-lg">
      <p className="text-slate-500">Loading Map...</p>
    </div>
  )
})

import { useSensorData } from "@/components/data/sensor-context"
import { Loader2, Sparkles } from "lucide-react"

// ... (keep imports)

interface AIAnalysis {
  diagnosis: string
  diagnosisDetail: string
  timeline: string
  timelineReason: string
  urgency: "High" | "Medium" | "Low"
  actions: string[]
}

export default function ActionPage() {
  const { data } = useSensorData()
  const { speak, voiceEnabled, autoSpeak, language } = useVoice()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTarget, setSelectedTarget] = useState<{name: string, price: string} | null>(null)
  
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const hasSpokenRef = useRef(false)
  const hasAnalyzedRef = useRef(false)

  // Auto-generate intelligent voice summary when page loads
  useEffect(() => {
    if (voiceEnabled && autoSpeak && !hasSpokenRef.current && !hasAnalyzedRef.current && data && data.fusion) {
      hasAnalyzedRef.current = true
      
      // Generate intelligent summary using the agent
      const generateVoiceSummary = async () => {
        try {
          const urgency = data.fusion.finalRisk || 'YELLOW'
          
          // Prepare detailed patient data for agent analysis
          const patientContext = `
CURRENT PATIENT STATUS:
- Overall Urgency: ${urgency}
- Urea Level: ${data.urea.value} mg/dL (${data.urea.status})
- Fluid Status: ${data.fluid.value} ECW/TBW (${data.fluid.status})
- Heart Rate: ${data.heartRate.value} bpm (${data.heartRate.status})
- SpO2: ${data.spo2.value}% (${data.spo2.status})
- Fusion Summary: ${data.fusion.summary}
- Urgent Actions: ${data.fusion.urgentActions}
- Long Term Advice: ${data.fusion.longTermAdvice}

Generate a concise, clear voice summary (2-3 sentences) explaining:
1. What is the current health concern
2. Why it requires attention now
3. What immediate action the patient should take

Be direct, calm, and actionable. Speak as if addressing the patient directly.`;

          const response = await fetch('/api/agent-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: patientContext }],
              sensorData: {
                urea: { value: data.urea.value, risk: data.urea.status },
                fluid: { value: data.fluid.value, risk: data.fluid.status },
                heartRate: { value: data.heartRate.value, risk: data.heartRate.status },
                spo2: { value: data.spo2.value, risk: data.spo2.status },
              }
            }),
          });

          if (response.ok) {
            const result = await response.json();
            const summary = result.content || result.response || result.output;
            
            if (summary && !hasSpokenRef.current) {
              hasSpokenRef.current = true;
              try {
                await speak(summary, { 
                  urgency: urgency === 'CRITICAL' || urgency === 'RED' ? 'critical' : 'urgent',
                  priority: true 
                });
              } catch (voiceError) {
                // Voice failed (likely permissions), but don't fail the page
                console.info('[Action Page] Voice synthesis skipped:', voiceError);
              }
            }
          } else {
            // Fallback to basic summary if agent fails
            throw new Error('Agent analysis failed');
          }
        } catch (error) {
          console.error('[Action Page] Voice summary generation failed:', error);
          
          // Fallback to simple summary
          if (!hasSpokenRef.current) {
            hasSpokenRef.current = true;
            const urgency = data.fusion.finalRisk || 'YELLOW';
            const urgencyText = urgency === 'CRITICAL' || urgency === 'RED' ? 'critical attention required' : 'elevated risk detected';
            
            const summaryMessages: Record<string, string> = {
              en: `Warning: ${urgencyText}. Status: ${urgency}. Action required within 24 hours.`,
              hi: `चेतावनी: ${urgencyText === 'critical attention required' ? 'गंभीर ध्यान आवश्यक' : 'बढ़ा हुआ जोखिम'}। 24 घंटे के भीतर कार्रवाई करें।`,
              ta: `எச்சரிக்கை: ${urgencyText === 'critical attention required' ? 'முக்கியமான கவனம்' : 'உயர்ந்த ஆபத்து'}। 24 மணி க்குள் நடவடிக்கை எடுக்கவும்।`,
              te: `హెచ్చరిక: ${urgencyText === 'critical attention required' ? 'క్లిష్టమైన శ్రద్ధ' : 'పెరిగిన ప్రమాదం'}। 24 గంటలు లోపల చర్య తీసుకోండి।`,
            };

            const message = summaryMessages[language as keyof typeof summaryMessages] || summaryMessages.en;
            try {
              await speak(message, { 
                urgency: urgency === 'CRITICAL' || urgency === 'RED' ? 'critical' : 'urgent',
                priority: true 
              });
            } catch (voiceError) {
              // Voice failed (likely permissions), but don't fail the page
              console.info('[Action Page] Fallback voice synthesis skipped:', voiceError);
            }
          }
        }
      };

      // Call after 1 second delay
      setTimeout(generateVoiceSummary, 1000);
    }
  }, [voiceEnabled, autoSpeak, data, speak, language])

  const handleBook = (name: string, price: string) => {
    setSelectedTarget({ name, price })
    setIsModalOpen(true)
  }

  const handleGetAnalysis = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sensorData: data }),
      })

      if (!response.ok) throw new Error('Failed to get analysis')

      const analysisData = await response.json()
      setAiAnalysis(analysisData)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper to determine content source (AI or Default)
  const diagnosisTitle = aiAnalysis?.diagnosis || data.fusion.summary
  const diagnosisDetail = aiAnalysis?.diagnosisDetail || data.fusion.longTermAdvice
  
  const timelineWindow = aiAnalysis?.timeline || (data.fusion.finalRisk === 'RED' ? 'Immediate' : data.fusion.finalRisk === 'ORANGE' ? '4-6 Hours' : '24 Hours')
  const timelineReason = aiAnalysis?.timelineReason || (data.fusion.finalRisk === 'RED' ? 'Immediate action required to prevent complications.' : 'Timely intervention ensures better outcomes.')
  const timelineUrgency = aiAnalysis?.urgency ? `${aiAnalysis.urgency} Priority` : `${data.fusion.styles.badge} Priority`
  
  const actionList = aiAnalysis?.actions || [
    data.fusion.urgentActions,
    "Prepare dialysis kit.",
    "Book a slot in the care finder."
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="h-6 w-6 text-slate-600" />
            </Button>
          </Link>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">System Overview</p>
            <h1 className="text-2xl font-bold text-slate-900">Action Required</h1>
          </div>
        </div>
        
        <Button 
          onClick={handleGetAnalysis} 
          disabled={isLoading}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Get AI Analysis
            </>
          )}
        </Button>
      </div>

      {/* Urgent Status Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-white p-8">
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${data.fusion.styles.gradient}`}></div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className={`bg-slate-50 p-6 rounded-full mb-6 relative`}>
            <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${data.fusion.styles.textColor.replace('text-', 'bg-')}`}></div>
            <AlertTriangle className={`h-12 w-12 ${data.fusion.styles.textColor}`} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{diagnosisTitle}</h2>
          <div className="flex items-center gap-2">
            <Badge className={`border-0 px-3 py-1 ${data.fusion.styles.badge === 'Normal' ? 'bg-emerald-100 text-emerald-700' : data.fusion.styles.badge === 'Advisory' ? 'bg-blue-100 text-blue-700' : data.fusion.styles.badge === 'Warning' ? 'bg-yellow-100 text-yellow-700' : data.fusion.styles.badge === 'Urgent' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
              Status: {data.fusion.styles.badge.toUpperCase()} ({data.fusion.finalRisk})
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Diagnosis & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Diagnosis */}
          <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Diagnosis</p>
              {aiAnalysis && <Badge variant="secondary" className="bg-violet-100 text-violet-700 text-[10px]"><Sparkles className="w-3 h-3 mr-1" /> AI Generated</Badge>}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{diagnosisTitle}</h2>
            <p className="text-slate-600 leading-relaxed">
              {diagnosisDetail}
            </p>
          </Card>

          {/* 2. Action Timeline */}
          <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Action Timeline</p>
              <Badge variant="outline" className={`border-0 ${data.fusion.styles.textColor.replace('text-', 'bg-').replace('700', '50')} ${data.fusion.styles.textColor}`}>
                <Clock className="h-3 w-3 mr-1" />
                {data.fusion.finalRisk === 'RED' ? 'Critical Window' : 'Recommended Window'}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Recommended Action Within</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {timelineWindow}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium uppercase mb-1">Urgency</p>
                  <p className={`text-sm font-bold ${data.fusion.styles.textColor}`}>
                    {timelineUrgency}
                  </p>
                </div>
              </div>

              {/* Visual Timeline Bar */}
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                <div className={`absolute top-0 left-0 h-full w-2/3 bg-gradient-to-r ${data.fusion.styles.gradient} rounded-full`}></div>
                {/* Marker for current status */}
                <div className="absolute top-0 bottom-0 w-0.5 bg-white border-l-2 border-slate-900 h-full left-[60%]"></div>
              </div>
              
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Now</span>
                <span>4h</span>
                <span>8h</span>
                <span>12h+</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-3">
                <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <p className="text-sm text-slate-600 leading-snug">
                  <span className="font-semibold text-slate-900">Why this timeline?</span> {timelineReason}
                </p>
              </div>
            </div>
          </Card>

          {/* 3. Recommended Action */}
          <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Recommended Action</p>
              {aiAnalysis && <Badge variant="secondary" className="bg-violet-100 text-violet-700 text-[10px]"><Sparkles className="w-3 h-3 mr-1" /> AI Generated</Badge>}
            </div>
            <div className="space-y-3">
              {actionList.map((action, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                    <Check className="h-3 w-3 text-emerald-600" />
                  </div>
                  <p className="text-slate-700 font-medium">{action}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Find Care & Book */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">4. Find Care & Book</p>
            
            {/* Map Container */}
            <Card className="h-64 border-0 shadow-sm bg-slate-200 overflow-hidden relative z-0">
              <Map />
            </Card>

            {/* Booking Options */}
            <div className="space-y-3">
              <Card className="p-4 border-0 shadow-sm bg-white flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-rose-100 p-3 rounded-lg">
                    <Building2 className="h-6 w-6 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Apollo Clinic</h3>
                    <p className="text-sm text-slate-500">1.2 km • <span className="font-bold text-slate-900">₹1500</span></p>
                  </div>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  onClick={() => handleBook("Apollo Clinic", "₹1500")}
                >
                  Book
                </Button>
              </Card>

              <Card className="p-4 border-0 shadow-sm bg-white flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Ambulance className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Mobile Unit 4</h3>
                    <p className="text-sm text-slate-500">Arrives in 20m • <span className="font-bold text-slate-900">₹800</span></p>
                  </div>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  onClick={() => handleBook("Mobile Unit 4", "₹800")}
                >
                  Book
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        bookingTarget={selectedTarget}
      />
    </div>
  )
}

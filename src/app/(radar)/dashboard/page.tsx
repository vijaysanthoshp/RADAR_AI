"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  AlertTriangle, 
  Heart, 
  Droplet, 
  Wind, 
  FlaskConical, 
  Brain, 
  ChevronRight, 
  CheckCircle,
  Zap,
  TestTube,
  Activity,
  Gauge,
  X,
  Thermometer,
  Users,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useSensorData } from "@/components/data/sensor-context"
import { VoiceControlPanel } from "@/components/voice/VoiceControlPanel"
import { EmergencyVoiceAlert } from "@/components/voice/EmergencyVoiceAlert"

// ... (keep necessary imports)

const chartConfig = {
  urea: {
    label: "Urea (mg/dL)",
    color: "#10b981",
  },
  fluid: {
    label: "Fluid (Ratio x100)",
    color: "#3b82f6",
  },
  heartRate: {
    label: "Heart Rate (bpm)",
    color: "#ef4444",
  },
  spo2: {
    label: "SPO2 (%)",
    color: "#06b6d4",
  },
  respiratoryRate: {
    label: "Respiratory Rate (brpm)",
    color: "#8b5cf6",
  },
  perfusionIndex: {
    label: "Perfusion Index",
    color: "#f59e0b",
  },
} satisfies ChartConfig

export default function Dashboard() {
  const { data, history, startTime } = useSensorData()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  
  // Remove local state and useEffect


  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Urgent Action Section - Fused Analysis */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Critical Alerts</h2>
        </div>
        <Link href="/action" className="block">
          <Card className={`overflow-hidden border-0 shadow-lg relative bg-gradient-to-r ${data.fusion.styles.gradient} text-white cursor-pointer hover:shadow-xl transition-shadow`}>
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <AlertTriangle className={`h-6 w-6 ${data.fusion.styles.iconColor}`} />
                  </div>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-3 py-1 text-xs font-medium rounded-md uppercase tracking-wide">
                    RTAR Class: {data.fusion.styles.badge}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold mb-2">{data.fusion.summary}</h3>
                  <p className="text-white/90 text-lg">{data.fusion.urgentActions}</p>
                </div>
              </div>
              
              <Button className={`bg-white ${data.fusion.styles.textColor} hover:bg-gray-50 border-0 font-bold px-8 py-6 h-auto text-lg shadow-xl shrink-0`}>
                View Diagnosis & Plan
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </Link>
      </section>

      {/* Live Sensor Data Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-slate-400 fill-slate-400" />
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Live Sensor Data</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Heart Rate */}
          <Card className="p-6 border-0 shadow-sm bg-white relative transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Heart Rate</h3>
              <div className="flex flex-col items-end gap-2">
                <Badge className={`${data.heartRate.styles.badgeColor} border-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase`}>
                  {data.heartRate.styles.badge}
                </Badge>
                <div className={`${data.heartRate.styles.bg} p-2 rounded-full transition-colors duration-300`}>
                  <Heart className={`h-4 w-4 ${data.heartRate.styles.color}`} />
                </div>
              </div>
            </div>
            <div className="mt-[-1rem]">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900 tabular-nums">{data.heartRate.value}</span>
                <span className="text-sm text-slate-400 font-medium">{data.heartRate.unit}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 mb-4">Real-time reading</p>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${data.heartRate.styles.bar} w-full transition-colors duration-300`} />
              </div>
            </div>
          </Card>

          {/* SPO2 */}
          <Card className="p-6 border-0 shadow-sm bg-white relative transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">SPO<sub>2</sub></h3>
              <div className="flex flex-col items-end gap-2">
                <Badge className={`${data.spo2.styles.badgeColor} border-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase`}>
                  {data.spo2.styles.badge}
                </Badge>
                <div className={`${data.spo2.styles.bg} p-2 rounded-full transition-colors duration-300`}>
                  <Wind className={`h-4 w-4 ${data.spo2.styles.color}`} />
                </div>
              </div>
            </div>
            <div className="mt-[-1rem]">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900 tabular-nums">{data.spo2.value}</span>
                <span className="text-sm text-slate-400 font-medium">{data.spo2.unit}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 mb-4">Real-time reading</p>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${data.spo2.styles.bar} w-full transition-colors duration-300`} />
              </div>
            </div>
          </Card>

          {/* Respiratory Rate */}
          <Card className="p-6 border-0 shadow-sm bg-white relative transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Respiratory Rate</h3>
              <div className="flex flex-col items-end gap-2">
                <Badge className={`${data.respiratoryRate.styles.badgeColor} border-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase`}>
                  {data.respiratoryRate.styles.badge}
                </Badge>
                <div className={`${data.respiratoryRate.styles.bg} p-2 rounded-full transition-colors duration-300`}>
                  <Activity className={`h-4 w-4 ${data.respiratoryRate.styles.color}`} />
                </div>
              </div>
            </div>
            <div className="mt-[-1rem]">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900 tabular-nums">{data.respiratoryRate.value}</span>
                <span className="text-sm text-slate-400 font-medium">{data.respiratoryRate.unit}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 mb-4">Real-time reading</p>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${data.respiratoryRate.styles.bar} w-full transition-colors duration-300`} />
              </div>
            </div>
          </Card>

          {/* Perfusion Index */}
          <Card className="p-6 border-0 shadow-sm bg-white relative transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perfusion Index</h3>
              <div className="flex flex-col items-end gap-2">
                <Badge className={`${data.perfusionIndex.styles.badgeColor} border-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase`}>
                  {data.perfusionIndex.styles.badge}
                </Badge>
                <div className={`${data.perfusionIndex.styles.bg} p-2 rounded-full transition-colors duration-300`}>
                  <Gauge className={`h-4 w-4 ${data.perfusionIndex.styles.color}`} />
                </div>
              </div>
            </div>
            <div className="mt-[-1rem]">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900 tabular-nums">{data.perfusionIndex.value.toFixed(2)}</span>
                <span className="text-sm text-slate-400 font-medium">{data.perfusionIndex.unit || '%'}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 mb-4">Real-time reading</p>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${data.perfusionIndex.styles.bar} w-full transition-colors duration-300`} />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Biometric Systems Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Biometric Systems Status</h2>
            <p className="text-sm text-slate-500">Real-time monitoring of patient vitals • Click cards to expand</p>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 px-4 py-1.5 text-sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            4/4 Systems Stable
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cardiovascular */}
          <Card 
            onClick={() => setExpandedCategory('cardiovascular')}
            className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 group h-full cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-rose-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
              </div>
              <div className="bg-emerald-100 p-1.5 rounded-full">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <h3 className="font-bold text-slate-700 text-lg mb-1">Cardiovascular</h3>
            <p className="text-sm text-slate-400">Heart rate monitoring</p>
          </Card>

          {/* Perfusion */}
          <Card 
            onClick={() => setExpandedCategory('perfusion')}
            className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 group h-full cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-amber-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Gauge className="h-6 w-6 text-amber-500" />
              </div>
              <div className="bg-emerald-100 p-1.5 rounded-full">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <h3 className="font-bold text-slate-700 text-lg mb-1">Perfusion</h3>
            <p className="text-sm text-slate-400">Tissue perfusion tracking</p>
          </Card>

          {/* Respiratory */}
          <Card 
            onClick={() => setExpandedCategory('respiratory')}
            className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 group h-full cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-cyan-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Wind className="h-6 w-6 text-cyan-500" />
              </div>
              <div className="bg-emerald-100 p-1.5 rounded-full">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <h3 className="font-bold text-slate-700 text-lg mb-1">Respiratory</h3>
            <p className="text-sm text-slate-400">RR and SpO2 tracking</p>
          </Card>

          {/* Vital Signs Overview */}
          <Card 
            onClick={() => setExpandedCategory('vitalsigns')}
            className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200 group h-full cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-violet-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-violet-500" />
              </div>
              <div className="bg-emerald-100 p-1.5 rounded-full">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <h3 className="font-bold text-slate-700 text-lg mb-1">Vital Signs</h3>
            <p className="text-sm text-slate-400">All parameters stable</p>
          </Card>
        </div>
      </section>

      {/* Expanded Category Modal */}
      {expandedCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setExpandedCategory(null)}>
          <Card className="max-w-6xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {expandedCategory === 'cardiovascular' && (
                  <>
                    <div className="bg-red-100 p-3 rounded-xl">
                      <Heart className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Cardiovascular System</h2>
                      <p className="text-sm text-slate-500">HR, HRV, ECG, GSR monitoring</p>
                    </div>
                  </>
                )}
                {expandedCategory === 'perfusion' && (
                  <>
                    <div className="bg-amber-100 p-3 rounded-xl">
                      <Droplet className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Perfusion System</h2>
                      <p className="text-sm text-slate-500">PPI, Bioimpedance, Edema, Temperature</p>
                    </div>
                  </>
                )}
                {expandedCategory === 'respiratory' && (
                  <>
                    <div className="bg-cyan-100 p-3 rounded-xl">
                      <Wind className="h-6 w-6 text-cyan-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Respiratory System</h2>
                      <p className="text-sm text-slate-500">RR and SpO₂ tracking</p>
                    </div>
                  </>
                )}
                {expandedCategory === 'vitalsigns' && (
                  <>
                    <div className="bg-violet-100 p-3 rounded-xl">
                      <Activity className="h-6 w-6 text-violet-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">Vital Signs</h2>
                      <p className="text-sm text-slate-500">Activity and Posture monitoring</p>
                    </div>
                  </>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setExpandedCategory(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              {/* Cardiovascular Parameters */}
              {expandedCategory === 'cardiovascular' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-5 bg-gradient-to-br from-red-50 to-white border border-red-100">
                    <div className="flex items-center justify-between mb-3">
                      <Heart className="h-5 w-5 text-red-500" />
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Normal</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">Heart Rate</h3>
                    <p className="text-3xl font-bold text-slate-900">{data.heartRate.value}</p>
                    <p className="text-sm text-slate-500">{data.heartRate.unit}</p>
                    <p className="text-xs text-slate-400 mt-2">PPG Sensor • Ring Device</p>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-pink-50 to-white border border-pink-100">
                    <div className="flex items-center justify-between mb-3">
                      <Activity className="h-5 w-5 text-pink-500" />
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Normal</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">HRV</h3>
                    <p className="text-3xl font-bold text-slate-900">58</p>
                    <p className="text-sm text-slate-500">ms</p>
                    <p className="text-xs text-slate-400 mt-2">PPG / ECG R-R • Ring / Vest A</p>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-red-50 to-white border border-red-100">
                    <div className="flex items-center justify-between mb-3">
                      <Activity className="h-5 w-5 text-red-600" />
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Normal</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">1-Lead ECG</h3>
                    <p className="text-3xl font-bold text-slate-900">Normal</p>
                    <p className="text-sm text-slate-500">Sinus Rhythm</p>
                    <p className="text-xs text-slate-400 mt-2">Dry Electrodes • Vest A</p>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                      <Zap className="h-5 w-5 text-purple-500" />
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Normal</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">GSR</h3>
                    <p className="text-3xl font-bold text-slate-900">2.8</p>
                    <p className="text-sm text-slate-500">μS</p>
                    <p className="text-xs text-slate-400 mt-2">GSR Sensor • Vest B</p>
                  </Card>
                </div>
              )}

              {/* Perfusion Parameters */}
              {expandedCategory === 'perfusion' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-5 bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                    <div className="flex items-center justify-between mb-3">
                      <Gauge className="h-5 w-5 text-amber-500" />
                      <Badge className={`${data.perfusionIndex.styles.badgeColor} text-xs`}>
                        {data.perfusionIndex.styles.badge}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">Perfusion Index</h3>
                    <p className="text-3xl font-bold text-slate-900">{data.perfusionIndex.value}</p>
                    <p className="text-sm text-slate-500">%</p>
                    <p className="text-xs text-slate-400 mt-2">PPG Amplitude • Ring Device</p>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Normal</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">Bioimpedance</h3>
                    <p className="text-3xl font-bold text-slate-900">450</p>
                    <p className="text-sm text-slate-500">Ω</p>
                    <p className="text-xs text-slate-400 mt-2">Multi-electrode • Vest B</p>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-cyan-50 to-white border border-cyan-100">
                    <div className="flex items-center justify-between mb-3">
                      <Droplet className="h-5 w-5 text-cyan-500" />
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Normal</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">Edema Proxy</h3>
                    <p className="text-3xl font-bold text-slate-900">0.42</p>
                    <p className="text-sm text-slate-500">ECW/TBW</p>
                    <p className="text-xs text-slate-400 mt-2">Optical/Impedance • Vest B</p>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-orange-50 to-white border border-orange-100">
                    <div className="flex items-center justify-between mb-3">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Normal</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">Skin Temp</h3>
                    <p className="text-3xl font-bold text-slate-900">36.4</p>
                    <p className="text-sm text-slate-500">°C</p>
                    <p className="text-xs text-slate-400 mt-2">Thermistor • Vest A</p>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-red-50 to-white border border-red-100">
                    <div className="flex items-center justify-between mb-3">
                      <Thermometer className="h-5 w-5 text-red-500" />
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Normal</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">Temp Gradient</h3>
                    <p className="text-3xl font-bold text-slate-900">2.1</p>
                    <p className="text-sm text-slate-500">°C</p>
                    <p className="text-xs text-slate-400 mt-2">IR Sensor • Vest B</p>
                  </Card>
                </div>
              )}

              {/* Respiratory Parameters */}
              {expandedCategory === 'respiratory' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-5 bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                    <div className="flex items-center justify-between mb-3">
                      <Activity className="h-5 w-5 text-purple-500" />
                      <Badge className={`${data.respiratoryRate.styles.badgeColor} text-xs`}>
                        {data.respiratoryRate.styles.badge}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">Respiratory Rate</h3>
                    <p className="text-3xl font-bold text-slate-900">{data.respiratoryRate.value}</p>
                    <p className="text-sm text-slate-500">{data.respiratoryRate.unit}</p>
                    <p className="text-xs text-slate-400 mt-2">PPG Waveform • Ring Device</p>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-cyan-50 to-white border border-cyan-100">
                    <div className="flex items-center justify-between mb-3">
                      <Wind className="h-5 w-5 text-cyan-500" />
                      <Badge className={`${data.spo2.styles.badgeColor} text-xs`}>
                        {data.spo2.styles.badge}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">SpO₂</h3>
                    <p className="text-3xl font-bold text-slate-900">{data.spo2.value}</p>
                    <p className="text-sm text-slate-500">{data.spo2.unit}</p>
                    <p className="text-xs text-slate-400 mt-2">NIR-PPG • Ring Device</p>
                  </Card>
                </div>
              )}

              {/* Vital Signs Parameters */}
              {expandedCategory === 'vitalsigns' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-5 bg-gradient-to-br from-violet-50 to-white border border-violet-100">
                    <div className="flex items-center justify-between mb-3">
                      <Activity className="h-5 w-5 text-violet-500" />
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Active</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">Activity</h3>
                    <p className="text-3xl font-bold text-slate-900">Moderate</p>
                    <p className="text-sm text-slate-500">150 steps/hr</p>
                    <p className="text-xs text-slate-400 mt-2">IMU Sensor • Ring Device</p>
                  </Card>

                  <Card className="p-5 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
                    <div className="flex items-center justify-between mb-3">
                      <Users className="h-5 w-5 text-indigo-500" />
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Normal</Badge>
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-1">Posture</h3>
                    <p className="text-3xl font-bold text-slate-900">Upright</p>
                    <p className="text-sm text-slate-500">Sitting</p>
                    <p className="text-xs text-slate-400 mt-2">IMU Sensor • Vest A</p>
                  </Card>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}


      {/* Real-time Charts Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Real-time Vitals Trends</h2>
            <p className="text-sm text-slate-500">Live streaming data</p>
          </div>
        </div>

        <Card className="p-6 border-0 shadow-sm bg-white">
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <LineChart
              accessibilityLayer
              data={history}
              margin={{
                left: 50,
                right: 20,
                top: 10,
                bottom: 10
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                type="number"
                domain={[
                  () => {
                    const currentTime = history.length > 0 ? history[history.length - 1].time : Date.now()
                    return Math.max(currentTime - (4 * 60 * 1000), startTime)
                  },
                  () => {
                    const currentTime = history.length > 0 ? history[history.length - 1].time : Date.now()
                    return currentTime + (1 * 60 * 1000)
                  }
                ]}
                allowDataOverflow={true}
                scale="time"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(unixTime) => {
                  if (!unixTime || isNaN(unixTime)) return ""
                  return new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                }}
                stroke="#94a3b8"
                fontSize={12}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                allowDataOverflow={true}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip 
                cursor={false} 
                content={
                  <ChartTooltipContent 
                    labelFormatter={(label) => {
                      if (!label || isNaN(label)) return ""
                      return new Date(label).toLocaleTimeString()
                    }} 
                  />
                } 
              />
              <Line 
                type="monotone" 
                dataKey="urea" 
                stroke="var(--color-urea)" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }}
                animationDuration={1000}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="fluid" 
                stroke="var(--color-fluid)" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }}
                animationDuration={1000}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                stroke="var(--color-heartRate)" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }}
                animationDuration={1000}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="spo2" 
                stroke="var(--color-spo2)" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }}
                animationDuration={1000}
                isAnimationActive={false}
              />
            </LineChart>
          </ChartContainer>
        </Card>
      </section>

      {/* Voice Control Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Voice Assistant</h2>
            <p className="text-sm text-slate-500">Hands-free health monitoring</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Voice Control Panel */}
          <div className="lg:col-span-2">
            <VoiceControlPanel />
          </div>
          
          {/* Emergency Voice Alert */}
          <div>
            <EmergencyVoiceAlert />
          </div>
        </div>
      </section>

      {/* Graphs */}
    </div>
  )
}
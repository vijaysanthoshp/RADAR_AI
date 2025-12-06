"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wind, Activity, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

export default function RespiratoryPage() {
  const [metrics, setMetrics] = useState({
    spo2: 98,
    respRate: 16,
    etco2: 38,
    status: "Normal",
    statusBadge: "bg-emerald-100 text-emerald-700"
  })

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate realistic fluctuations
      const newSpo2 = Math.floor(Math.random() * (100 - 90) + 90)
      const newRespRate = Math.floor(Math.random() * (22 - 12) + 12)
      const newEtco2 = Math.floor(Math.random() * (45 - 35) + 35)

      let status = "Normal"
      let badge = "bg-emerald-100 text-emerald-700"

      if (newSpo2 < 92) {
        status = "Low Oxygen"
        badge = "bg-amber-100 text-amber-700"
      } else if (newSpo2 < 88) {
        status = "Hypoxia"
        badge = "bg-red-100 text-red-700"
      }

      setMetrics({
        spo2: newSpo2,
        respRate: newRespRate,
        etco2: newEtco2,
        status,
        statusBadge: badge
      })
    }, 3000) // 20 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wind className="h-6 w-6 text-cyan-500" />
            Respiratory System
          </h1>
          <p className="text-slate-500">Real-time oxygenation and ventilation monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Live Monitoring
          </Badge>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* Main Status Card */}
      <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`${metrics.statusBadge} border-0 px-3 py-1`}>
                {metrics.status}
              </Badge>
              <span className="text-sm text-slate-400">Last updated: Just now</span>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">SPO2</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{metrics.spo2}</span>
                  <span className="text-sm text-slate-400">%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Respiration Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{metrics.respRate}</span>
                  <span className="text-sm text-slate-400">bpm</span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 max-w-lg">
              Oxygen saturation levels are stable. Ventilation patterns are regular with no signs of distress.
            </p>
          </div>

          <div className="w-full md:w-1/3 bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center items-center">
             <div className="w-full h-32 bg-slate-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <Wind className="h-12 w-12 text-cyan-300 opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full animate-[shimmer_3s_infinite]"></div>
             </div>
             <p className="text-xs text-slate-400 mt-2">Pleth Waveform</p>
          </div>
        </div>
      </Card>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-cyan-100 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-cyan-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-semibold text-slate-700">EtCO2</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.etco2}</span>
            <span className="text-xs text-slate-500">mmHg</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">End-tidal CO2</p>
        </Card>

        <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-semibold text-slate-700">Lung Sounds</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">Clear</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Bilateral air entry</p>
        </Card>

        <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow bg-slate-900 text-white">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-white/10 p-2 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="font-semibold text-slate-200">Respiratory Effort</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-400">Normal</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">No accessory muscle use</p>
        </Card>
      </div>
    </div>
  )
}
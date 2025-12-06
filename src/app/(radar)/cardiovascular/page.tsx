"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Activity, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

export default function CardiovascularPage() {
  const [metrics, setMetrics] = useState({
    heartRate: 72,
    bpSys: 120,
    bpDia: 80,
    hrv: 45,
    status: "Normal",
    statusBadge: "bg-emerald-100 text-emerald-700"
  })

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate realistic fluctuations
      const newHr = Math.floor(Math.random() * (100 - 60) + 60)
      const newBpSys = Math.floor(Math.random() * (130 - 110) + 110)
      const newBpDia = Math.floor(Math.random() * (85 - 70) + 70)
      const newHrv = Math.floor(Math.random() * (80 - 30) + 30)

      let status = "Normal"
      let badge = "bg-emerald-100 text-emerald-700"

      // Simple logic for status change based on HR
      if (newHr > 90 || newBpSys > 125) {
        status = "Elevated"
        badge = "bg-amber-100 text-amber-700"
      }

      setMetrics({
        heartRate: newHr,
        bpSys: newBpSys,
        bpDia: newBpDia,
        hrv: newHrv,
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
            <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
            Cardiovascular System
          </h1>
          <p className="text-slate-500">Real-time heart and circulation monitoring</p>
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
        
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
                <p className="text-sm font-medium text-slate-500 mb-1">Heart Rate</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{metrics.heartRate}</span>
                  <span className="text-sm text-slate-400">bpm</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Blood Pressure</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{metrics.bpSys}/{metrics.bpDia}</span>
                  <span className="text-sm text-slate-400">mmHg</span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 max-w-lg">
              Cardiovascular metrics are within acceptable ranges. No immediate anomalies detected in rhythm or pressure.
            </p>
          </div>

          <div className="w-full md:w-1/3 bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center items-center">
             {/* Placeholder for ECG Graph */}
             <div className="w-full h-32 bg-slate-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <Activity className="h-12 w-12 text-rose-300 opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full animate-[shimmer_2s_infinite]"></div>
             </div>
             <p className="text-xs text-slate-400 mt-2">Live ECG Lead II</p>
          </div>
        </div>
      </Card>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-rose-100 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-rose-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-semibold text-slate-700">Heart Rate Variability</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.hrv}</span>
            <span className="text-xs text-slate-500">ms</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Indicates stress levels</p>
        </Card>

        <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-semibold text-slate-700">Cardiac Output</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">5.2</span>
            <span className="text-xs text-slate-500">L/min</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Optimal pumping efficiency</p>
        </Card>

        <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow bg-slate-900 text-white">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-white/10 p-2 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="font-semibold text-slate-200">Risk Assessment</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-400">Low Risk</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Based on current vitals</p>
        </Card>
      </div>
    </div>
  )
}
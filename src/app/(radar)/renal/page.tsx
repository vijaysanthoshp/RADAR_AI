"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplet, Activity, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

export default function RenalPage() {
  const [metrics, setMetrics] = useState({
    urea: 35,
    fluid: 0.39,
    phaseAngle: 5.5,
    status: "Normal",
    statusBadge: "bg-emerald-100 text-emerald-700"
  })

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate realistic fluctuations
      const newUrea = Math.floor(Math.random() * (80 - 20) + 20)
      const newFluid = parseFloat((Math.random() * (0.6 - 0.3) + 0.3).toFixed(2))
      const newPhaseAngle = parseFloat((Math.random() * (10.0 - 3.0) + 3.0).toFixed(1))

      let status = "Normal"
      let badge = "bg-emerald-100 text-emerald-700"

      // Logic based on classification rules
      if (newUrea > 100 || newFluid >= 0.49 || newPhaseAngle < 4.5) {
        status = "Critical"
        badge = "bg-red-100 text-red-700"
      } else if (newUrea > 80 || newFluid >= 0.46) {
        status = "Warning"
        badge = "bg-amber-100 text-amber-700"
      }

      setMetrics({
        urea: newUrea,
        fluid: newFluid,
        phaseAngle: newPhaseAngle,
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
            <Droplet className="h-6 w-6 text-blue-500 fill-blue-500" />
            Renal & Fluid System
          </h1>
          <p className="text-slate-500">Real-time kidney function and hydration monitoring</p>
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
        
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
                <p className="text-sm font-medium text-slate-500 mb-1">Urea Level</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{metrics.urea}</span>
                  <span className="text-sm text-slate-400">mg/dL</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Fluid Status (ECW/TBW)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">{metrics.fluid}</span>
                  <span className="text-sm text-slate-400">Ratio</span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 max-w-lg">
              Monitoring fluid balance and renal markers. Phase Angle indicates cellular health.
            </p>
          </div>

          <div className="w-full md:w-1/3 bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col justify-center items-center">
             <div className="w-full h-32 bg-slate-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <Droplet className="h-12 w-12 text-blue-300 opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-100/20 to-transparent w-full h-full animate-pulse"></div>
             </div>
             <p className="text-xs text-slate-400 mt-2">Hydration Index</p>
          </div>
        </div>
      </Card>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-semibold text-slate-700">Phase Angle</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{metrics.phaseAngle}</span>
            <span className="text-xs text-slate-500">deg</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Cellular membrane integrity</p>
        </Card>

        <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Droplet className="h-5 w-5 text-amber-600" />
            </div>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-semibold text-slate-700">Creatinine</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">1.1</span>
            <span className="text-xs text-slate-500">mg/dL</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Kidney filtration marker</p>
        </Card>

        <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-shadow bg-slate-900 text-white">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-white/10 p-2 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="font-semibold text-slate-200">Fluid Overload Risk</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-400">
              {metrics.fluid >= 0.46 ? "High" : "Low"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Based on ECW/TBW ratio</p>
        </Card>
      </div>
    </div>
  )
}
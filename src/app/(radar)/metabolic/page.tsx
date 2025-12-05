"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  FlaskConical, 
  Activity, 
  Circle
} from "lucide-react"
import Link from "next/link"

interface MetricCardProps {
  title: string
  value: string
  unit?: string
  status: "NORMAL" | "WARNING" | "CRITICAL"
  source: string
  icon?: React.ReactNode
}

function MetricCard({ title, value, unit, status, source, icon }: MetricCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "NORMAL":
        return "bg-emerald-100 text-emerald-700"
      case "WARNING":
        return "bg-amber-100 text-amber-700"
      case "CRITICAL":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
        <Badge className={`${getStatusColor(status)} border-0 font-medium`}>
          {status}
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">{value}</span>
          {unit && <span className="text-sm text-slate-500 font-medium">{unit}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-100 pt-3">
        {icon || <FlaskConical className="h-3 w-3" />}
        <span>Source: <span className="font-medium text-slate-600">{source}</span></span>
      </div>
    </Card>
  )
}

export default function MetabolicPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
            <ArrowLeft className="h-6 w-6 text-slate-600" />
          </Button>
        </Link>
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">System Overview</p>
          <h1 className="text-2xl font-bold text-slate-900">Metabolic System</h1>
        </div>
      </div>

      {/* System Monitoring Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-white p-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-purple-50 p-6 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-20"></div>
            <FlaskConical className="h-12 w-12 text-purple-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">System Monitoring</h2>
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-sm font-medium text-slate-500">Live Data Feed</span>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Potassium (K+)"
          value="4.8"
          unit="mmol/L"
          status="NORMAL"
          source="Biochem Patch"
          icon={<FlaskConical className="h-3 w-3" />}
        />
        <MetricCard
          title="PH Level (Acidosis)"
          value="7.35"
          status="NORMAL"
          source="Biochem Patch"
          icon={<FlaskConical className="h-3 w-3" />}
        />
        <MetricCard
          title="Chloride (Cl-)"
          value="102"
          unit="mmol/L"
          status="NORMAL"
          source="Biochem Patch"
          icon={<FlaskConical className="h-3 w-3" />}
        />
        <MetricCard
          title="T-Wave Morphology"
          value="Normal Peaking"
          status="NORMAL"
          source="ECG Patch"
          icon={<Activity className="h-3 w-3" />}
        />
        <MetricCard
          title="Blood Glucose (Est)"
          value="110"
          unit="mg/dL"
          status="NORMAL"
          source="Smart Ring"
          icon={<Circle className="h-3 w-3" />}
        />
      </div>
    </div>
  )
}
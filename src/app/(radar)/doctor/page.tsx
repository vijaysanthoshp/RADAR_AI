"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Video, 
  Calendar, 
  Footprints, // Using Footprints as a proxy for "Walk-in" icon
  ChevronRight 
} from "lucide-react"
import Link from "next/link"
import { AgenticAnalysisPanel } from "@/components/agent/AgenticAnalysisPanel"

export default function DoctorPage() {
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
          <h1 className="text-2xl font-bold text-slate-900">My Doctor</h1>
        </div>
      </div>

      {/* Doctor Profile Card */}
      <Card className="p-6 border-0 shadow-sm bg-white mb-8 flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white text-2xl font-medium shrink-0">
          PM
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dr. Piyush Mishra, MD</h2>
          <p className="text-slate-500 mb-2">Nephrologist • ID: PM-402</p>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">
            Available Now
          </Badge>
        </div>
      </Card>

      <div className="space-y-2 mb-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointment Options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Emergency Telemedicine */}
        <Card className="p-6 border-0 shadow-sm bg-red-50 hover:bg-red-100 transition-colors cursor-pointer flex flex-col items-center justify-center text-center gap-4 group h-full">
          <div className="bg-red-100 p-4 rounded-full group-hover:bg-red-200 transition-colors">
            <Video className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <span className="font-bold text-red-700 text-lg block mb-1">Emergency Telemedicine</span>
            <span className="text-sm text-red-600/80">Immediate connection</span>
          </div>
        </Card>

        {/* Scheduled Telemedicine */}
        <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4 group h-full">
          <div className="bg-blue-50 p-4 rounded-full group-hover:bg-blue-100 transition-colors">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <span className="font-bold text-slate-700 text-lg block mb-1">Scheduled Telemedicine</span>
            <span className="text-sm text-slate-500">Book a slot</span>
          </div>
        </Card>

        {/* Walk-in OPD */}
        <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4 group h-full">
          <div className="bg-emerald-50 p-4 rounded-full group-hover:bg-emerald-100 transition-colors">
            <Footprints className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <span className="font-bold text-slate-700 text-lg block mb-1">Walk-in OPD</span>
            <span className="text-sm text-slate-500">Visit clinic</span>
          </div>
        </Card>
      </div>

      {/* Agentic Analysis Section */}
      <div className="mt-8">
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Agent Analysis</p>
        </div>
        <AgenticAnalysisPanel />
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Leaf, Clock, AlertTriangle, Ambulance, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function RTARInfoPage() {
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
          <h1 className="text-2xl font-bold text-slate-900">RTAR: Renal Triage Alert & Response Criteria</h1>
          <p className="text-sm text-slate-600 mt-1">AI-powered multi-parameter risk classification for dialysis patients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* GREEN: Stable */}
        <Card className="p-6 border-t-8 border-t-emerald-500 bg-gradient-to-br from-emerald-50 to-white shadow-lg hover:shadow-xl transition-shadow h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>
            <Badge className="bg-emerald-500 text-white px-3 py-1 text-sm font-bold">GREEN</Badge>
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-3">STABLE</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Status:</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Vitals, Sensor data, Biochemistry normal
              </p>
            </div>
            
            <div className="border-t border-emerald-100 pt-4">
              <h3 className="font-semibold text-slate-700 mb-2">Action Required:</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Reminders updated. Continue routine monitoring.
              </p>
            </div>
          </div>
        </Card>

        {/* YELLOW: Urgent */}
        <Card className="p-6 border-t-8 border-t-amber-400 bg-gradient-to-br from-amber-50 to-white shadow-lg hover:shadow-xl transition-shadow h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <Badge className="bg-amber-400 text-white px-3 py-1 text-sm font-bold">YELLOW</Badge>
          </div>
          <h2 className="text-2xl font-bold text-amber-800 mb-3">URGENT</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Status:</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Confirmed fluid overload
              </p>
            </div>
            
            <div className="border-t border-amber-100 pt-4">
              <h3 className="font-semibold text-slate-700 mb-2">Action Required:</h3>
              <p className="text-amber-700 text-sm leading-relaxed font-medium">
                "Schedule Dialysis Today"<br />
                <span className="text-amber-600 font-bold">DIALYSIS CENTRE</span> in vicinity
              </p>
            </div>
          </div>
        </Card>

        {/* ORANGE: Emergency */}
        <Card className="p-6 border-t-8 border-t-orange-500 bg-gradient-to-br from-orange-50 to-white shadow-lg hover:shadow-xl transition-shadow h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <Badge className="bg-orange-500 text-white px-3 py-1 text-sm font-bold">ORANGE</Badge>
          </div>
          <h2 className="text-2xl font-bold text-orange-800 mb-3">EMERGENCY</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Status:</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Confirmed Life threatening event
              </p>
            </div>
            
            <div className="border-t border-orange-100 pt-4">
              <h3 className="font-semibold text-slate-700 mb-2">Action Required:</h3>
              <p className="text-orange-700 text-sm leading-relaxed font-medium">
                "Immediate Care Needed"<br />
                <span className="text-orange-600 font-bold">MOBILE UNITS</span> finds nearest ER with dialysis.<br />
                Clinician Alerted !!!
              </p>
            </div>
          </div>
        </Card>

        {/* RED: Critical */}
        <Card className="p-6 border-t-8 border-t-red-500 bg-gradient-to-br from-red-50 to-white shadow-lg hover:shadow-xl transition-shadow h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Ambulance className="h-6 w-6 text-red-600" />
            </div>
            <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold">RED</Badge>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-3">CRITICAL</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Status:</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Cardiac arrest detected, Fatal Event confirmed !!!
              </p>
            </div>
            
            <div className="border-t border-red-100 pt-4">
              <h3 className="font-semibold text-slate-700 mb-2">Action Required:</h3>
              <p className="text-red-700 text-sm leading-relaxed font-medium">
                <span className="text-red-600 font-bold">Automatic EMS Dispatch</span><br />
                routes ambulance, alerts caregiver.
              </p>
            </div>
          </div>
        </Card>

        {/* GREY: Advisory */}
        <Card className="p-6 border-t-8 border-t-slate-400 bg-gradient-to-br from-slate-50 to-white shadow-lg hover:shadow-xl transition-shadow h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-100 p-3 rounded-full">
              <HelpCircle className="h-6 w-6 text-slate-600" />
            </div>
            <Badge className="bg-slate-400 text-white px-3 py-1 text-sm font-bold">GREY</Badge>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">ADVISORY</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Status:</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sensor issue or slight trend or variation
              </p>
            </div>
            
            <div className="border-t border-slate-100 pt-4">
              <h3 className="font-semibold text-slate-700 mb-2">Action Required:</h3>
              <p className="text-slate-700 text-sm leading-relaxed font-medium">
                App suggests<br />
                <span className="text-slate-600 font-bold">SENSOR CHECK</span> or<br />
                <span className="text-slate-600 font-bold">TELEMEDICINE</span> booking.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Info Card */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-md mt-8">
        <h3 className="text-lg font-bold text-slate-800 mb-3">About RTAR System</h3>
        <p className="text-slate-700 text-sm leading-relaxed">
          The Renal Triage Alert & Response system uses AI-powered multi-parameter analysis to continuously monitor dialysis patients. 
          By fusing data from wearable sensors (Ring Device, Vest A, Vest B), the system provides real-time risk stratification and 
          automated response coordination, ensuring timely interventions and improved patient outcomes.
        </p>
      </Card>
    </div>
  )
}

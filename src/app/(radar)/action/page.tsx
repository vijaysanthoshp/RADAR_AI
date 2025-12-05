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
import { useState } from "react"
import { BookingModal } from "@/components/action/BookingModal"

// Dynamically import Map component with no SSR
const Map = dynamic(() => import("@/components/map/Map"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-100 rounded-lg">
      <p className="text-slate-500">Loading Map...</p>
    </div>
  )
})

export default function ActionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTarget, setSelectedTarget] = useState<{name: string, price: string} | null>(null)

  const handleBook = (name: string, price: string) => {
    setSelectedTarget({ name, price })
    setIsModalOpen(true)
  }

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
          <h1 className="text-2xl font-bold text-slate-900">Action Required</h1>
        </div>
      </div>

      {/* Urgent Status Card */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-white p-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="bg-amber-50 p-6 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-20"></div>
            <AlertTriangle className="h-12 w-12 text-amber-500 fill-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Urgent Action Required</h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0 px-3 py-1">
              Status: URGENT (Yellow)
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Diagnosis & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Diagnosis */}
          <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">1. Diagnosis</p>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Fluid Overload Detected</h2>
            <p className="text-slate-600 leading-relaxed">
              Fluid Patch indicates +2.1kg retention. Bioimpedance falling. Risk of Pulmonary Edema.
            </p>
          </Card>

          {/* 2. Action Timeline */}
          <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Action Timeline</p>
              <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                <Clock className="h-3 w-3 mr-1" />
                Critical Window
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Recommended Action Within</p>
                  <p className="text-3xl font-bold text-slate-900">4-6 Hours</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium uppercase mb-1">Urgency</p>
                  <p className="text-sm font-bold text-orange-600">High Priority</p>
                </div>
              </div>

              {/* Visual Timeline Bar */}
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-2/3 bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-500 rounded-full"></div>
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
                  <span className="font-semibold text-slate-900">Why this timeline?</span> Delaying dialysis beyond 6 hours increases risk of pulmonary edema by 40%.
                </p>
              </div>
            </div>
          </Card>

          {/* 3. Recommended Action */}
          <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">3. Recommended Action</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-emerald-600" />
                </div>
                <p className="text-slate-700 font-medium">Restrict fluid intake immediately.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-emerald-600" />
                </div>
                <p className="text-slate-700 font-medium">Prepare dialysis kit.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-1 rounded-full mt-0.5">
                  <Check className="h-3 w-3 text-emerald-600" />
                </div>
                <p className="text-slate-900 font-bold">Book a slot in the care finder.</p>
              </div>
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

"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
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
          <h1 className="text-2xl font-bold text-slate-900">RTAR Classification Guide</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* GREEN: Stable */}
        <Card className="p-6 border-l-8 border-l-emerald-500 bg-emerald-50/50 border-t-0 border-r-0 border-b-0 shadow-sm h-full">
          <h2 className="text-lg font-bold text-emerald-800 mb-1">GREEN: Stable</h2>
          <p className="text-emerald-700 font-medium">
            Vitals and biochemistry normal. No action needed.
          </p>
        </Card>

        {/* BLUE: Advisory */}
        <Card className="p-6 border-l-8 border-l-blue-500 bg-blue-50/50 border-t-0 border-r-0 border-b-0 shadow-sm h-full">
          <h2 className="text-lg font-bold text-blue-800 mb-1">BLUE: Advisory</h2>
          <p className="text-blue-700 font-medium">
            Slight trend variation or sensor issue. Check connections.
          </p>
        </Card>

        {/* YELLOW: Urgent */}
        <Card className="p-6 border-l-8 border-l-amber-400 bg-amber-50/50 border-t-0 border-r-0 border-b-0 shadow-sm h-full">
          <h2 className="text-lg font-bold text-amber-800 mb-1">YELLOW: Urgent</h2>
          <p className="text-amber-700 font-medium">
            Fluid overload or mild hyperkalemia. Schedule dialysis within 24h.
          </p>
        </Card>

        {/* ORANGE: Emergency */}
        <Card className="p-6 border-l-8 border-l-orange-500 bg-orange-50/50 border-t-0 border-r-0 border-b-0 shadow-sm h-full">
          <h2 className="text-lg font-bold text-orange-800 mb-1">ORANGE: Emergency</h2>
          <p className="text-orange-700 font-medium">
            Life threatening event. Immediate care needed in ER.
          </p>
        </Card>

        {/* RED: Critical */}
        <Card className="p-6 border-l-8 border-l-red-500 bg-red-50/50 border-t-0 border-r-0 border-b-0 shadow-sm h-full">
          <h2 className="text-lg font-bold text-red-800 mb-1">RED: Critical</h2>
          <p className="text-red-700 font-medium">
            Cardiac arrest or shock detected. Auto-EMS dispatched.
          </p>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
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
          <h1 className="text-2xl font-bold text-slate-900">History</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Routine Dialysis - Green */}
        <Card className="p-6 border-l-8 border-l-emerald-500 bg-white border-t-0 border-r-0 border-b-0 shadow-sm hover:shadow-md transition-all h-full">
          <div className="mb-1">
            <span className="text-sm text-slate-400 font-medium">Nov 24, 2025</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Routine Dialysis</h2>
          <p className="text-slate-500 text-sm">
            Apollo Clinic • <span className="text-slate-500">Successful</span>
          </p>
        </Card>

        {/* Yellow Alert: Fluid - Yellow */}
        <Card className="p-6 border-l-8 border-l-amber-400 bg-white border-t-0 border-r-0 border-b-0 shadow-sm hover:shadow-md transition-all h-full">
          <div className="mb-1">
            <span className="text-sm text-slate-400 font-medium">Nov 20, 2025</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Yellow Alert: Fluid</h2>
          <p className="text-slate-500 text-sm">
            Resolved via Medication
          </p>
        </Card>
      </div>
    </div>
  )
}

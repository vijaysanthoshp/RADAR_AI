"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface StyleData {
  color: string
  bg: string
  bar: string
  badge: string
  badgeColor: string
}

interface MetricData {
  value: number
  unit: string
  status: string
  styles: StyleData
}

interface FluidMetricData extends MetricData {
  phaseAngle: number
}

interface FusionStyles {
  borderColor: string
  gradient: string
  textColor: string
  badge: string
  iconColor: string
}

interface FusionData {
  finalRisk: string
  summary: string
  urgentActions: string
  longTermAdvice: string
  styles: FusionStyles
}

export interface SensorData {
  urea: MetricData
  fluid: FluidMetricData
  heartRate: MetricData
  spo2: MetricData
  respiratoryRate: MetricData
  perfusionIndex: MetricData
  fusion: FusionData
}

export interface ChartDataPoint {
  time: number
  urea: number
  fluid: number
  heartRate: number
  spo2: number
  respiratoryRate: number
  perfusionIndex: number
}

const INITIAL_DATA: SensorData = {
  urea: { 
    value: 0, unit: "mg/dL", status: "GREEN", 
    styles: { color: "text-slate-400", bg: "bg-slate-50", bar: "bg-slate-200", badge: "Loading...", badgeColor: "bg-slate-100 text-slate-500" } 
  },
  fluid: { 
    value: 0, unit: "ECW/TBW", phaseAngle: 0, status: "GREEN", 
    styles: { color: "text-slate-400", bg: "bg-slate-50", bar: "bg-slate-200", badge: "Loading...", badgeColor: "bg-slate-100 text-slate-500" } 
  },
  heartRate: { 
    value: 0, unit: "bpm", status: "GREEN", 
    styles: { color: "text-slate-400", bg: "bg-slate-50", bar: "bg-slate-200", badge: "Loading...", badgeColor: "bg-slate-100 text-slate-500" } 
  },
  spo2: { 
    value: 0, unit: "%", status: "GREEN", 
    styles: { color: "text-slate-400", bg: "bg-slate-50", bar: "bg-slate-200", badge: "Loading...", badgeColor: "bg-slate-100 text-slate-500" } 
  },
  respiratoryRate: { 
    value: 0, unit: "brpm", status: "GREEN", 
    styles: { color: "text-slate-400", bg: "bg-slate-50", bar: "bg-slate-200", badge: "Loading...", badgeColor: "bg-slate-100 text-slate-500" } 
  },
  perfusionIndex: { 
    value: 0, unit: "", status: "GREEN", 
    styles: { color: "text-slate-400", bg: "bg-slate-50", bar: "bg-slate-200", badge: "Loading...", badgeColor: "bg-slate-100 text-slate-500" } 
  },
  fusion: {
    finalRisk: "GREEN",
    summary: "Initializing system...",
    urgentActions: "Please wait while we connect to sensors.",
    longTermAdvice: "",
    styles: { borderColor: "border-slate-200", gradient: "from-slate-400 to-slate-500", textColor: "text-slate-600", badge: "Initializing", iconColor: "text-white" }
  }
}

interface SensorContextType {
  data: SensorData
  history: ChartDataPoint[]
  startTime: number
}

const SensorContext = createContext<SensorContextType | undefined>(undefined)

export function SensorProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SensorData>(INITIAL_DATA)
  const [history, setHistory] = useState<ChartDataPoint[]>([])
  const [startTime] = useState<number>(Date.now())

  useEffect(() => {
    const eventSource = new EventSource('/api/data')

    eventSource.onmessage = (event) => {
      try {
        const newData: SensorData = JSON.parse(event.data)
        setData(newData)
        
        // Update history for chart
        setHistory(prev => {
          const now = Date.now()
          const newPoint: ChartDataPoint = {
            time: now,
            urea: newData.urea.value,
            fluid: newData.fluid.value * 100, // Scale up for visibility on chart
            heartRate: newData.heartRate.value,
            spo2: newData.spo2.value,
            respiratoryRate: newData.respiratoryRate.value,
            perfusionIndex: newData.perfusionIndex.value
          }
          
          // Keep data for the last 5 minutes to ensure smooth scrolling
          // The domain logic will handle the visibility (3.75m past, 1.25m future)
          const windowSize = 5 * 60 * 1000 
          const cutoff = now - windowSize
          
          const newHistory = [...prev, newPoint].filter(point => point.time > cutoff)
          return newHistory
        })

      } catch (error) {
        console.error("Failed to parse sensor data", error)
      }
    }

    return () => {
      eventSource.close()
    }
  }, [])

  return (
    <SensorContext.Provider value={{ data, history, startTime }}>
      {children}
    </SensorContext.Provider>
  )
}

export function useSensorData() {
  const context = useContext(SensorContext)
  if (context === undefined) {
    throw new Error('useSensorData must be used within a SensorProvider')
  }
  return context
}

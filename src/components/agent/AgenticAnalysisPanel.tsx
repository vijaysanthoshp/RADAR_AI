/**
 * R.A.D.A.R. Agentic Analysis Display Component
 * Shows the full reasoning process of the autonomous medical agent
 */

"use client"

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  BookOpen,
  TrendingUp,
  Bell,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useSensorData } from '../data/sensor-context'

interface AgentStep {
  tool: string
  input: any
  observation: string
}

interface AgentAnalysis {
  diagnosis: string
  diagnosisDetail: string
  urgency: 'Low' | 'Medium' | 'High'
  timeline: string
  timelineReason: string
  actions: string[]
  clinicalReasoning: string
  alertStatus: string
}

const toolIcons: Record<string, any> = {
  get_patient_history: Activity,
  query_medical_guidelines: BookOpen,
  analyze_risk_trajectory: TrendingUp,
  escalate_alert: Bell,
  recommend_consultation: Users,
}

const toolColors: Record<string, string> = {
  get_patient_history: 'text-blue-600 bg-blue-50',
  query_medical_guidelines: 'text-purple-600 bg-purple-50',
  analyze_risk_trajectory: 'text-orange-600 bg-orange-50',
  escalate_alert: 'text-red-600 bg-red-50',
  recommend_consultation: 'text-green-600 bg-green-50',
}

export function AgenticAnalysisPanel() {
  const { data } = useSensorData()
  const [analysis, setAnalysis] = useState<AgentAnalysis | null>(null)
  const [reasoning, setReasoning] = useState<AgentStep[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showReasoning, setShowReasoning] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const runAgenticAnalysis = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/agent-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensorData: data }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        const errorMessage = errorData.technicalDetails || errorData.message || errorData.error || 'Analysis failed'
        throw new Error(errorMessage)
      }

      const result = await response.json()
      
      setAnalysis(result.analysis)
      setReasoning(result.agentReasoning?.steps || [])
      
      console.log('[Agent Full Output]:', result.agentReasoning?.fullOutput)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Agent analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-500'
      case 'Medium': return 'bg-orange-500'
      case 'Low': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Trigger Button */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🤖 Autonomous Medical Agent Analysis
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              The R.A.D.A.R. agent uses multi-step reasoning with tool access to:
              query patient history, analyze risk trajectories, access medical guidelines,
              and autonomously escalate alerts when needed.
            </p>
            <Button
              onClick={runAgenticAnalysis}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Agent Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Run Agentic Analysis
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Analysis Error: {error}</span>
          </div>
        </Card>
      )}

      {/* Reasoning Steps */}
      {reasoning.length > 0 && (
        <Card className="p-6">
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setShowReasoning(!showReasoning)}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Agent Reasoning Process</h3>
              <Badge variant="outline" className="ml-2">
                {reasoning.length} tools used
              </Badge>
            </div>
            {showReasoning ? <ChevronUp /> : <ChevronDown />}
          </div>

          {showReasoning && (
            <div className="space-y-4">
              {reasoning.map((step, index) => {
                const Icon = toolIcons[step.tool] || Activity
                const colorClass = toolColors[step.tool] || 'text-gray-600 bg-gray-50'
                
                return (
                  <div key={index} className="border-l-4 border-purple-300 pl-4 py-3 bg-gray-50 rounded-r">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm text-purple-900">
                            Step {index + 1}: {step.tool.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          <span className="font-medium">Input:</span> 
                          <code className="ml-2 bg-white px-2 py-1 rounded">
                            {JSON.stringify(step.input).substring(0, 100)}...
                          </code>
                        </div>
                        <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                          <span className="font-medium text-purple-700">Result:</span>
                          <p className="mt-1 whitespace-pre-wrap">
                            {typeof step.observation === 'string' 
                              ? step.observation.substring(0, 300) + (step.observation.length > 300 ? '...' : '')
                              : JSON.stringify(step.observation, null, 2).substring(0, 300)
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      )}

      {/* Final Analysis */}
      {analysis && (
        <Card className="p-6 border-2 border-purple-200">
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 ${getUrgencyColor(analysis.urgency)} rounded-lg`}>
              {analysis.urgency === 'High' ? (
                <AlertTriangle className="w-6 h-6 text-white" />
              ) : (
                <CheckCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{analysis.diagnosis}</h2>
                <Badge className={`${getUrgencyColor(analysis.urgency)} text-white`}>
                  {analysis.urgency} Urgency
                </Badge>
                {analysis.alertStatus === 'escalated' && (
                  <Badge className="bg-red-600 text-white">
                    <Bell className="w-3 h-3 mr-1" />
                    Alert Escalated
                  </Badge>
                )}
              </div>
              <p className="text-gray-700 mb-4">{analysis.diagnosisDetail}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-2 mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <span className="font-semibold text-orange-900">Action Timeline: </span>
              <span className="text-orange-700">{analysis.timeline}</span>
              <p className="text-sm text-orange-600 mt-1">{analysis.timelineReason}</p>
            </div>
          </div>

          {/* Clinical Reasoning */}
          {analysis.clinicalReasoning && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Agent's Clinical Reasoning
              </h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {analysis.clinicalReasoning}
              </p>
            </div>
          )}

          {/* Actions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Recommended Actions:</h4>
            <div className="space-y-2">
              {analysis.actions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-800">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

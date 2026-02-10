"use client"

import { Suspense, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, X, Activity } from 'lucide-react'
import * as THREE from 'three'

interface SensorInfo {
  name: string
  purpose: string
  description: string
  position: [number, number, number]
}

const SENSORS: SensorInfo[] = [
  {
    name: "ECG Sensor",
    purpose: "Heart Activity Monitoring",
    description: "Continuously monitors electrical signals from the heart to detect arrhythmias, heart rate variability, and other cardiac conditions. Provides real-time ECG waveforms for immediate analysis.",
    position: [0.35, 0.35, 0.45]  // Upper right chest - square ECG sensor
  },
  {
    name: "SpO2 Sensor",
    purpose: "Blood Oxygen Monitoring",
    description: "Measures peripheral oxygen saturation levels in the blood using photoplethysmography. Critical for detecting hypoxemia and respiratory issues in real-time.",
    position: [-0.38, -0.35, 0.45]  // Lower left - small SpO2 sensor with green light
  },
  {
    name: "Multi-Parameter Sensor",
    purpose: "Comprehensive Vital Monitoring",
    description: "Advanced sensor module that tracks temperature, heart rate, respiratory rate, and activity levels. Displays real-time readings on integrated OLED screen for immediate patient assessment.",
    position: [0.38, -0.35, 0.45]  // Lower right - large display sensor
  }
]

interface ModelProps {
  url: string
  onSensorClick: (sensor: SensorInfo) => void
}

function SensorMarker({ position, onClick }: { position: [number, number, number], onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  
  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? "#10b981" : "#10b981"}
        emissive={hovered ? "#10b981" : "#10b981"}
        emissiveIntensity={hovered ? 0.8 : 0}
        transparent
        opacity={hovered ? 0.6 : 0}
      />
      {hovered && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color="#3b82f6"
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
      )}
    </mesh>
  )
}

function Model({ url, onSensorClick }: ModelProps) {
  const { scene } = useGLTF(url)
  
  return (
    <group>
      <primitive object={scene} scale={1.5} />
      {SENSORS.map((sensor, index) => (
        <SensorMarker
          key={index}
          position={sensor.position}
          onClick={() => onSensorClick(sensor)}
        />
      ))}
    </group>
  )
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-white text-lg font-medium">Loading 3D Model...</p>
      </div>
    </div>
  )
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 max-w-md p-6 bg-red-900/20 border border-red-700 rounded-lg">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <p className="text-white text-lg font-medium mb-2">Failed to Load 3D Model</p>
          <p className="text-red-300 text-sm">{error.message || 'Please check if the model file exists in the public folder'}</p>
        </div>
      </div>
    </div>
  )
}

interface ModelViewerProps {
  modelPath: string
  title?: string
  description?: string
}

export function ModelViewer({ modelPath, title, description }: ModelViewerProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedSensor, setSelectedSensor] = useState<SensorInfo | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSensorClick = (sensor: SensorInfo) => {
    setSelectedSensor(sensor)
  }

  const closeSensorDialog = () => {
    setSelectedSensor(null)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="w-full h-full bg-slate-950 border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
          <h2 className="text-2xl font-bold text-white mb-2">
            {title || '3D Medical Model Viewer'}
          </h2>
        </div>
        <div className="relative w-full" style={{ height: 'calc(100vh - 250px)' }}>
          <LoadingFallback />
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full bg-slate-950 border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
        <h2 className="text-2xl font-bold text-white mb-2">
          {title || '3D Medical Model Viewer'}
        </h2>
        {description && (
          <p className="text-slate-400 text-sm">{description}</p>
        )}
      </div>

      {/* 3D Canvas Container */}
      <div className="relative w-full" style={{ height: 'calc(100vh - 250px)' }}>
        <Canvas
          shadows
          className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
          gl={{ antialias: true, alpha: true }}
        >
          {/* Camera Setup */}
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            castShadow
          />

          {/* Environment for reflections */}
          <Environment preset="studio" />

          {/* 3D Model */}
          <Suspense fallback={null}>
            <Model url={modelPath} onSensorClick={handleSensorClick} />
          </Suspense>

          {/* Orbit Controls for interaction */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        </Canvas>

        {/* Controls Info */}
        <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 text-white text-sm">
          <p className="font-semibold mb-2">Controls:</p>
          <ul className="space-y-1 text-slate-300">
            <li>🖱️ <strong>Left Click + Drag:</strong> Rotate</li>
            <li>🖱️ <strong>Right Click + Drag:</strong> Pan</li>
            <li>🖱️ <strong>Scroll:</strong> Zoom in/out</li>
            <li>🟢 <strong>Click Green Dots:</strong> Sensor Info</li>
          </ul>
        </div>

        {/* Sensor Info Badge */}
        <div className="absolute top-6 right-6 bg-emerald-900/90 backdrop-blur-sm border border-emerald-700 rounded-lg p-3 text-white text-sm">
          <p className="font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {SENSORS.length} Active Sensors
          </p>
        </div>
      </div>

      {/* Sensor Information Dialog */}
      <Dialog open={!!selectedSensor} onOpenChange={closeSensorDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
              <Activity className="h-6 w-6" />
              {selectedSensor?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-base">
              {selectedSensor?.purpose}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedSensor?.description}
              </p>
            </div>
            <Button
              onClick={closeSensorDialog}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// Preload models for better performance
useGLTF.preload('/model.glb')

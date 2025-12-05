"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Component to update map view when position changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap()
  map.setView(center)
  return null
}

export default function Map() {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude])
          setLoading(false)
        },
        (err) => {
          console.error("Error getting location:", err)
          // Default to a fallback location (e.g., New York) if permission denied
          setPosition([40.7128, -74.0060])
          setLoading(false)
        }
      )
    } else {
      // Fallback
      setPosition([40.7128, -74.0060])
      setLoading(false)
    }
  }, [])

  if (loading || !position) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-100 rounded-lg">
        <p className="text-slate-500">Locating nearby care centers...</p>
      </div>
    )
  }

  // Simulated nearby locations based on user's position
  const nearbyLocations = [
    {
      name: "Apollo Clinic",
      coords: [position[0] + 0.01, position[1] + 0.01] as [number, number],
      type: "Clinic"
    },
    {
      name: "Mobile Unit 4",
      coords: [position[0] - 0.005, position[1] - 0.005] as [number, number],
      type: "Mobile Unit"
    }
  ]

  return (
    <MapContainer 
      key={`${position[0]}-${position[1]}`}
      center={position} 
      zoom={13} 
      scrollWheelZoom={false} 
      className="h-full w-full rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User Location */}
      <Marker position={position} icon={icon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Nearby Locations */}
      {nearbyLocations.map((loc, idx) => (
        <Marker key={idx} position={loc.coords} icon={icon}>
          <Popup>
            <div className="font-semibold">{loc.name}</div>
            <div className="text-xs text-slate-500">{loc.type}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

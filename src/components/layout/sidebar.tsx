"use client"

import { Button } from "@/components/ui/button"
import { 
  UserCog,
  History,
  Map,
  Info,
  Power,
  MessageSquare
} from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"

import { useSensorData } from "@/components/data/sensor-context"

interface SidebarProps {
  userName: string
}

export function Sidebar({ userName }: SidebarProps) {
  const { data } = useSensorData()
  
  const getStyles = (risk: string) => {
    switch (risk) {
      case "RED":
        return { 
          container: "bg-red-900/30 border-red-700/50", 
          badge: "bg-red-600/20 text-red-500 border-red-600/30" 
        }
      case "ORANGE":
        return { 
          container: "bg-orange-900/30 border-orange-700/50", 
          badge: "bg-orange-600/20 text-orange-500 border-orange-600/30" 
        }
      case "YELLOW":
        return { 
          container: "bg-yellow-900/30 border-yellow-700/50", 
          badge: "bg-yellow-600/20 text-yellow-500 border-yellow-600/30" 
        }
      case "BLUE":
        return { 
          container: "bg-blue-900/30 border-blue-700/50", 
          badge: "bg-blue-600/20 text-blue-500 border-blue-600/30" 
        }
      case "GREEN":
        return { 
          container: "bg-emerald-900/30 border-emerald-700/50", 
          badge: "bg-emerald-600/20 text-emerald-500 border-emerald-600/30" 
        }
      default:
        return { 
          container: "bg-slate-900/30 border-slate-700/50", 
          badge: "bg-slate-600/20 text-slate-500 border-slate-600/30" 
        }
    }
  }

  const styles = getStyles(data.fusion.finalRisk)

  return (
    <aside className="hidden md:flex w-72 flex-col bg-[#1a1b4b] text-white border-r border-gray-800 fixed inset-y-0 z-50 overflow-hidden">
      {/* User Profile Section */}
      <div className="p-8 bg-gradient-to-b from-[#2e3085] to-[#1a1b4b]">
        <div className="flex flex-col items-center text-center">
          <div className="h-20 w-20 bg-[#3b82f6] rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg border-4 border-[#1a1b4b]">
            {userName.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-white">{userName}</h2>
          <p className="text-sm text-blue-200">ID: RAD-2025-X99</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link href="/doctor" className="block w-full">
          <Button variant="ghost" className="w-full justify-start gap-4 text-gray-300 hover:text-white hover:bg-white/10 h-12 text-base font-normal">
            <UserCog className="h-5 w-5" />
            My Doctor
          </Button>
        </Link>
        <Link href="/history" className="block w-full">
          <Button variant="ghost" className="w-full justify-start gap-4 text-gray-300 hover:text-white hover:bg-white/10 h-12 text-base font-normal">
            <History className="h-5 w-5" />
            Past History
          </Button>
        </Link>
        <Link href="/action" className="block w-full">
          <Button variant="ghost" className="w-full justify-start gap-4 text-gray-300 hover:text-white hover:bg-white/10 h-12 text-base font-normal">
            <Map className="h-5 w-5" />
            Track Units (Map)
          </Button>
        </Link>
        <Link href="/rtar-info" className="block w-full">
          <Button variant="ghost" className="w-full justify-start gap-4 text-gray-300 hover:text-white hover:bg-white/10 h-12 text-base font-normal">
            <Info className="h-5 w-5" />
            RTAR Info
          </Button>
        </Link>
        <Link href="/chatbot" className="block w-full">
          <Button variant="ghost" className="w-full justify-start gap-4 text-gray-300 hover:text-white hover:bg-white/10 h-12 text-base font-normal">
            <MessageSquare className="h-5 w-5" />
            AI Assistant
          </Button>
        </Link>

        <div className="mt-8 px-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Alert Status</p>
          <div className={`${styles.container} border rounded-lg p-1 transition-colors duration-300`}>
             <div className={`${styles.badge} px-3 py-2 rounded text-sm font-medium text-center border transition-colors duration-300`}>
               RTAR Class: {data.fusion.styles.badge}
             </div>
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-white/10">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-4 text-red-400 hover:text-red-300 hover:bg-red-900/20 h-12 text-base font-normal"
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
        >
          <Power className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { 
  Menu, 
  Bell,
  LogOut
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface HeaderProps {
  userName: string
}

export function Header({ userName }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 md:hidden">
        <Button variant="ghost" size="icon" className="-ml-2">
          <Menu className="h-6 w-6 text-slate-600" />
        </Button>
        <span className="font-bold text-lg text-slate-800">R.A.D.A.R.</span>
      </div>

      <div className="hidden md:block">
        <Link href="/dashboard" className="font-bold text-2xl text-slate-800 hover:text-slate-600 transition-colors">
          R.A.D.A.R.
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold border border-teal-200">
          {userName.charAt(0).toUpperCase()}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-slate-600" />
        </Button>
      </div>
    </header>
  )
}

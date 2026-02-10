import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ChatWidget } from "@/components/chat/chat-widget"
import { ChatProvider } from "@/components/chat/chat-context"
import { SensorProvider } from "@/components/data/sensor-context"
import { EmergencyVoiceButton } from "@/components/voice/EmergencyVoiceButton"
import { createClient } from "@/lib/supabase/server"

export default async function RadarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userName = user.user_metadata?.name || user.email || "User"

  return (
    <SensorProvider>
      <ChatProvider>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar userName={userName} />
          <main className="flex-1 md:ml-72 transition-all duration-300">
            <Header userName={userName} />
            {children}
            <EmergencyVoiceButton />
            <ChatWidget />
          </main>
        </div>
      </ChatProvider>
    </SensorProvider>
  )
}
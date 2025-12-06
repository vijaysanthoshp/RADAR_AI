import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ChatWidget } from "@/components/chat/chat-widget"
import { ChatProvider } from "@/components/chat/chat-context"
import { SensorProvider } from "@/components/data/sensor-context"

export default async function RadarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  const userName = session?.user?.name || "User"

  return (
    <SensorProvider>
      <ChatProvider>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar userName={userName} />
          <main className="flex-1 md:ml-72 transition-all duration-300">
            <Header userName={userName} />
            {children}
            <ChatWidget />
          </main>
        </div>
      </ChatProvider>
    </SensorProvider>
  )
}

"use client"

import { ThemeProvider } from "next-themes"
import { VoiceProvider } from "@/contexts/VoiceContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <VoiceProvider>
        {children}
      </VoiceProvider>
    </ThemeProvider>
  )
}

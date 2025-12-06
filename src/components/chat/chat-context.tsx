"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatContextType {
  messages: Message[]
  addMessage: (message: Message) => void
  sendMessage: (text: string) => Promise<void>
  isLoading: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Nephrology AI Assistant. I can analyze your latest vitals and provide insights. How can I help?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    }

    addMessage(newUserMessage)
    setIsLoading(true)

    try {
      // Prepare conversation history for the API
      const apiMessages = messages.concat(newUserMessage).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.content || "I'm sorry, I couldn't generate a response.",
        sender: 'bot',
        timestamp: new Date()
      }
      addMessage(newBotMessage)

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error processing your request.",
        sender: 'bot',
        timestamp: new Date()
      }
      addMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ChatContext.Provider value={{ messages, addMessage, sendMessage, isLoading }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

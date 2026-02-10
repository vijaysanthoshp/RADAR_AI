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
    if (!text.trim() || isLoading) {
      console.log('[Chat] Message blocked - empty or loading:', { text: text.trim(), isLoading });
      return;
    }

    console.log('[Chat] Sending message:', text);

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    }

    addMessage(newUserMessage)
    setIsLoading(true)

    try {
      console.log('[Chat] Starting API call process...');
      
      // Prepare conversation history for the AGENTIC API
      const apiMessages = messages.concat(newUserMessage).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));
      console.log('[Chat] Prepared messages:', apiMessages.length);

      // Try to get current sensor data from context if available
      let sensorData = null;
      try {
        console.log('[Chat] Fetching sensor data...');
        const dataController = new AbortController();
        const dataTimeout = setTimeout(() => dataController.abort(), 2000); // 2 second timeout
        
        const dataResponse = await fetch('/api/data', { 
          method: 'GET',
          signal: dataController.signal 
        });
        console.log('[Chat] Data response status:', dataResponse.status);
        
        if (dataResponse.ok && dataResponse.body) {
          // Read only the first chunk since it's an SSE stream
          const reader = dataResponse.body.getReader();
          const decoder = new TextDecoder();
          const { value } = await reader.read();
          clearTimeout(dataTimeout);
          reader.cancel(); // Close the stream
          
          if (value) {
            const text = decoder.decode(value);
            const dataMatch = text.match(/data: (.+)/);
            if (dataMatch) {
              const parsed = JSON.parse(dataMatch[1]);
              sensorData = {
                urea: { value: parsed.urea.value, risk: parsed.urea.risk },
                fluid: { value: parsed.fluid.value, risk: parsed.fluid.risk },
                heartRate: { value: parsed.heartRate.value, risk: parsed.heartRate.risk },
                spo2: { value: parsed.spo2.value, risk: parsed.spo2.risk },
              };
              console.log('[Chat] Sensor data fetched successfully');
            }
          }
        }
      } catch (sensorError) {
        console.log('[Chat] Could not fetch current sensor data, continuing without it:', sensorError);
      }

      // Call the AGENTIC chat endpoint with tools (with 60s timeout)
      console.log('[Chat] Calling agent-chat API...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch('/api/agent-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: apiMessages,
          sensorData: sensorData, // Provide context to the agent
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Chat Error] API returned non-OK status:', response.status, errorText);
        throw new Error(`Failed to get response: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Chat Response] Raw data:', data);
      
      // Show tool usage info if available
      let responseText = data.content || data.response || data.output || "I'm sorry, I couldn't generate a response.";
      console.log('[Chat Response] Extracted text:', responseText);
      
      if (data.reasoning && data.reasoning.length > 0) {
        const toolsUsed = data.reasoning.map((r: any) => r.tool).join(', ');
        console.log(`[Agent Tools Used]: ${toolsUsed}`);
      }
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      }
      console.log('[Chat] Adding bot message:', newBotMessage);
      addMessage(newBotMessage)

    } catch (error) {
      console.error('[Chat Error] Full error:', error);
      
      let errorText = "Sorry, I encountered an error processing your request.";
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorText = "Request timed out. The server took too long to respond. Please try again.";
        } else {
          errorText = `Error: ${error.message}`;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
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

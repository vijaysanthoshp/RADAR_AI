"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChat } from "@/components/chat/chat-context"
import { useVoice } from "@/contexts/VoiceContext"

export default function ChatbotPage() {
  const { messages, sendMessage, isLoading } = useChat()
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  // Voice features
  const { 
    isListening, 
    transcript, 
    interimTranscript,
    voiceEnabled, 
    toggleVoice,
    startListening, 
    stopListening,
    stopSpeaking,
    speak 
  } = useVoice()
  const [autoReadResponses, setAutoReadResponses] = useState(true)
  const lastMessageCountRef = useRef(messages.length)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-read new AI responses
  useEffect(() => {
    if (autoReadResponses && voiceEnabled && messages.length > lastMessageCountRef.current) {
      const latestMessage = messages[messages.length - 1]
      if (latestMessage.sender === 'assistant') {
        speak(latestMessage.text, { urgency: 'normal' })
      }
    }
    lastMessageCountRef.current = messages.length
  }, [messages, autoReadResponses, voiceEnabled, speak])

  // Handle voice transcript - auto-send when complete
  useEffect(() => {
    if (transcript && !isListening) {
      setInputValue(transcript)
      // Auto-send after voice input completes
      setTimeout(async () => {
        if (transcript.trim() && !isLoading) {
          stopSpeaking() // Stop any ongoing speech
          await sendMessage(transcript)
          setInputValue("")
        }
      }, 500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isListening])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return
    
    // Stop any ongoing speech when sending a new message
    stopSpeaking()
    
    const text = inputValue
    setInputValue("")
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening()
    } else {
      setInputValue("") // Clear text input when starting voice
      startListening()
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="h-6 w-6 text-slate-600" />
            </Button>
          </Link>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">System Overview</p>
            <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
          </div>
        </div>

        {/* Voice Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={autoReadResponses ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoReadResponses(!autoReadResponses)}
            className="gap-2"
          >
            {autoReadResponses ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden sm:inline">Auto-Read</span>
          </Button>
          <Button
            variant={voiceEnabled ? "default" : "outline"}
            size="sm"
            onClick={toggleVoice}
            className="gap-2"
          >
            {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            <span className="hidden sm:inline">{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden border-0 shadow-sm bg-white">
        {/* Messages List */}
        <div 
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {message.sender === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div
                  className={`p-3 rounded-2xl text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {message.sender === 'user' ? (
                    message.text
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:my-2">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-1 last:mb-0" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-1 last:mb-0" {...props} />,
                          li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-sm font-bold mb-1" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-sm font-bold mb-1" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                          a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}
                  <div
                    className={`text-[10px] mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%] flex-row">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-slate-200 text-slate-600">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="p-3 rounded-2xl text-sm bg-slate-100 text-slate-800 rounded-tl-none">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          {/* Voice Transcript Display */}
          {isListening && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <Mic className="h-4 w-4 text-blue-600 animate-pulse" />
                <span className="text-xs font-medium text-blue-600">Listening...</span>
              </div>
              {(interimTranscript || transcript) && (
                <p className="text-sm text-slate-700">
                  {transcript}
                  <span className="text-slate-400">{interimTranscript}</span>
                </p>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              placeholder={isListening ? "Listening to your voice..." : "Type your message or use voice..."}
              value={isListening ? (transcript + interimTranscript) : inputValue}
              onChange={(e) => !isListening && setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || isListening}
              className="flex-1 bg-white border-slate-200 focus-visible:ring-blue-500 text-slate-900"
            />
            
            {/* Voice Input Button */}
            {voiceEnabled && (
              <Button
                onClick={handleVoiceInput}
                disabled={isLoading}
                variant={isListening ? "default" : "outline"}
                className={isListening ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" : ""}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
            
            {/* Send Button */}
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isLoading || isListening}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

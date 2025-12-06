"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, Bot, User, Minimize2, Loader2, Maximize2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useChat } from "@/components/chat/chat-context"

export function ChatWidget() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  const { messages, sendMessage, isLoading } = useChat()

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return
    
    const text = inputValue
    setInputValue("")
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleMaximize = () => {
    setIsOpen(false)
    router.push('/chatbot')
  }

  // Hide widget on the dedicated chatbot page
  if (pathname === '/chatbot') {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="mb-4 w-[90vw] h-[50vh] md:w-[50vw] md:h-[50vh] flex flex-col shadow-xl border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-1 rounded-full">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm">AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-slate-400 hover:text-white hover:bg-white/10"
                onClick={handleMaximize}
                title="Maximize to full page"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-slate-400 hover:text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollAreaRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2.5 rounded-2xl text-xs ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
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
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-none shadow-sm p-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about your vitals..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1 h-8 text-xs bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-slate-900"
              />
              <Button 
                size="icon"
                onClick={handleSendMessage} 
                disabled={!inputValue.trim() || isLoading}
                className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white shrink-0"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-slate-700 hover:bg-slate-800 rotate-90' 
            : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageSquare className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Loader2 } from "lucide-react"
import Image from "next/image"
import {
  fetchTokenData,
  analyzeSentiment,
  analyzeTechnical,
  assessRisk,
  analyzeSocialHype,
  scanContractSecurity,
  calculateExitStrategy,
  predictPrice,
  checkLiquidityLock,
  type Chain,
} from "@/lib/crypto-api"
import { chatWithDobby } from "@/lib/ai-api"

interface DobbyChatProps {
  tokenAddress: string
  chain: Chain
}

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function DobbyChat({ tokenAddress, chain }: DobbyChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Yo! I'm Dobby, your unhinged memecoin advisor. I've analyzed this token inside and out. Ask me anything - I'll give it to you straight, no BS. What do you wanna know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tokenContext, setTokenContext] = useState<any>(null)
  const [isLoadingContext, setIsLoadingContext] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadContext = async () => {
      setIsLoadingContext(true)
      try {
        const tokenData = await fetchTokenData(tokenAddress, chain)
        const sentiment = await analyzeSentiment(tokenAddress, chain)
        const technical = await analyzeTechnical(tokenData)
        const risk = await assessRisk(tokenData, chain)

        // Load additional context
        const socialHype = await analyzeSocialHype(tokenAddress, tokenData.name)
        const security = await scanContractSecurity(tokenAddress, chain)
        const exitStrategy = await calculateExitStrategy(tokenData)
        const prediction = await predictPrice(tokenData, sentiment)
        const liquidityLock = await checkLiquidityLock(tokenAddress, chain)

        setTokenContext({
          tokenData,
          sentiment,
          technical,
          risk,
          socialHype,
          security,
          exitStrategy,
          prediction,
          liquidityLock,
        })
      } catch (error) {
        console.error("Error loading token context:", error)
      } finally {
        setIsLoadingContext(false)
      }
    }
    loadContext()
  }, [tokenAddress, chain])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await chatWithDobby(input, tokenContext, messages)

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error chatting with Dobby:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Ugh, something broke. Try again in a sec.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestedQuestions = [
    "Is this a rug pull?",
    "Should I buy this?",
    "What's the risk level?",
    "When should I take profits?",
    "Is the liquidity locked?",
    "What's your honest opinion?",
  ]

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1 glow-purple">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              <Image src="/images/dobby-avatar.webp" alt="Dobby" width={64} height={64} className="object-cover" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold flex items-center gap-2">
              Ask Dobby
              <Badge variant="secondary" className="text-xs">
                Powered by Dobby-Unhinged
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground">
              {isLoadingContext ? "Loading analysis data..." : "Unfiltered insights with complete token analysis"}
            </p>
          </div>
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-muted/20">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
                  : "bg-muted border border-border/50"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-muted border border-border/50 rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Dobby is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && !isLoadingContext && (
        <div className="px-6 pb-4 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:border-primary/50 border border-transparent transition-all"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-6 border-t border-border/50 bg-muted/20">
        <div className="flex gap-2">
          <Input
            placeholder="Ask Dobby anything about this memecoin..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || isLoadingContext}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isLoadingContext}
            className="glow-purple"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Dobby gives unfiltered opinions based on complete analysis. Always DYOR before investing.
        </p>
      </div>
    </Card>
  )
}

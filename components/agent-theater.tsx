"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Loader2, Sparkles, Zap } from "lucide-react"
import { fetchTokenData, analyzeSentiment, analyzeTechnical, assessRisk, type Chain } from "@/lib/crypto-api"
import { generateAgentInsight, type AgentMessage } from "@/lib/ai-api"

interface AgentTheaterProps {
  tokenAddress: string
  chain: Chain
  isAnalyzing: boolean
}

const agents = [
  {
    id: "data",
    name: "Data Collector",
    avatar: "/images/agent-data.webp",
    color: "border-primary/50",
    glow: "glow-purple",
    bgGlow: "bg-primary/10",
  },
  {
    id: "sentiment",
    name: "Sentiment Analyzer",
    avatar: "/images/agent-sentiment.webp",
    color: "border-success/50",
    glow: "glow-green",
    bgGlow: "bg-success/10",
  },
  {
    id: "technical",
    name: "Technical Analyst",
    avatar: "/images/agent-technical.webp",
    color: "border-warning/50",
    glow: "glow-blue",
    bgGlow: "bg-blue-500/10",
  },
  {
    id: "risk",
    name: "Risk Assessor",
    avatar: "/images/agent-risk.webp",
    color: "border-destructive/50",
    glow: "glow-red",
    bgGlow: "bg-destructive/10",
  },
]

export function AgentTheater({ tokenAddress, chain, isAnalyzing }: AgentTheaterProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [activeAgent, setActiveAgent] = useState<string | null>(null)
  const [completedAgents, setCompletedAgents] = useState<Set<string>>(new Set())
  const isRunningRef = useRef(false)
  const currentTokenRef = useRef<string>("")

  useEffect(() => {
    if (!tokenAddress) return

    if (isRunningRef.current || currentTokenRef.current === tokenAddress) {
      return
    }

    const runAnalysis = async () => {
      isRunningRef.current = true
      currentTokenRef.current = tokenAddress
      setMessages([])
      setCompletedAgents(new Set())

      try {
        // Agent 1: Data Collector
        setActiveAgent("data")
        await new Promise((resolve) => setTimeout(resolve, 500))
        const tokenData = await fetchTokenData(tokenAddress, chain)
        const dataInsight = await generateAgentInsight("data", tokenData)
        setMessages((prev) => [
          ...prev,
          {
            agent: "data",
            message: dataInsight,
            timestamp: Date.now(),
            confidence: 95,
          },
        ])
        setCompletedAgents((prev) => new Set(prev).add("data"))

        // Agent 2: Sentiment Analyzer
        setActiveAgent("sentiment")
        await new Promise((resolve) => setTimeout(resolve, 800))
        const sentimentData = await analyzeSentiment(tokenAddress, chain)
        const sentimentInsight = await generateAgentInsight("sentiment", sentimentData)
        setMessages((prev) => [
          ...prev,
          {
            agent: "sentiment",
            message: sentimentInsight,
            timestamp: Date.now(),
            confidence: sentimentData.score,
          },
        ])
        setCompletedAgents((prev) => new Set(prev).add("sentiment"))

        // Agent 3: Technical Analyst
        setActiveAgent("technical")
        await new Promise((resolve) => setTimeout(resolve, 600))
        const technicalData = await analyzeTechnical(tokenData)
        const technicalInsight = await generateAgentInsight("technical", { ...technicalData, ...tokenData })
        setMessages((prev) => [
          ...prev,
          {
            agent: "technical",
            message: technicalInsight,
            timestamp: Date.now(),
            confidence: 88,
          },
        ])
        setCompletedAgents((prev) => new Set(prev).add("technical"))

        // Agent 4: Risk Assessor
        setActiveAgent("risk")
        await new Promise((resolve) => setTimeout(resolve, 700))
        const riskData = await assessRisk(tokenData, chain)
        const riskInsight = await generateAgentInsight("risk", riskData)
        setMessages((prev) => [
          ...prev,
          {
            agent: "risk",
            message: riskInsight,
            timestamp: Date.now(),
            confidence: 100 - riskData.score,
          },
        ])
        setCompletedAgents((prev) => new Set(prev).add("risk"))

        // Meta-agent summary
        setActiveAgent("meta")
        await new Promise((resolve) => setTimeout(resolve, 500))
        setMessages((prev) => [
          ...prev,
          {
            agent: "meta",
            message: `Analysis complete! ${tokenData.symbol} shows ${technicalData.trend} trend with ${riskData.score < 30 ? "low" : riskData.score < 60 ? "moderate" : "high"} risk. ${sentimentData.trending ? "Currently trending!" : "Monitor for opportunities."}`,
            timestamp: Date.now(),
            confidence: 92,
          },
        ])

        setActiveAgent(null)
      } catch (error) {
        console.error("Agent analysis error:", error)
        setActiveAgent(null)
      } finally {
        isRunningRef.current = false
      }
    }

    runAnalysis()

    return () => {
      isRunningRef.current = false
    }
  }, [tokenAddress, chain])

  useEffect(() => {
    if (tokenAddress !== currentTokenRef.current) {
      currentTokenRef.current = ""
      isRunningRef.current = false
    }
  }, [tokenAddress])

  return (
    <Card className="p-6 border-primary/20 glass overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 animate-pulse" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)] animate-pulse"
        style={{ animationDuration: "3s" }}
      />

      <div className="relative z-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <Zap className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-ping" />
            </div>
            <h3 className="text-xl font-bold gradient-text">Live Agent Theater</h3>
            {activeAgent && (
              <Badge variant="secondary" className="ml-auto animate-pulse">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Processing...
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Watch agents collaborate in real-time</p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full" style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(139, 92, 246, 0.8)" />
                  <stop offset="50%" stopColor="rgba(236, 72, 153, 0.8)" />
                  <stop offset="100%" stopColor="rgba(139, 92, 246, 0.8)" />
                </linearGradient>
              </defs>
              {agents.map((_, index) => {
                if (index === agents.length - 1) return null
                const isActive =
                  activeAgent === agents[index].id ||
                  activeAgent === agents[index + 1].id ||
                  (completedAgents.has(agents[index].id) && completedAgents.has(agents[index + 1].id))
                return (
                  <line
                    key={index}
                    x1={`${(index * 100) / (agents.length - 1) + 12.5}%`}
                    y1="50%"
                    x2={`${((index + 1) * 100) / (agents.length - 1) + 12.5}%`}
                    y2="50%"
                    stroke={isActive ? "url(#lineGradient)" : "rgba(100, 100, 100, 0.2)"}
                    strokeWidth={isActive ? "3" : "2"}
                    strokeDasharray="5,5"
                    className={isActive ? "animate-pulse" : ""}
                    style={{
                      filter: isActive ? "drop-shadow(0 0 4px rgba(139, 92, 246, 0.6))" : "none",
                      transition: "all 0.3s ease",
                    }}
                  />
                )
              })}
            </svg>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {agents.map((agent, index) => {
              const isActive = activeAgent === agent.id
              const isCompleted = completedAgents.has(agent.id)
              const isWaiting = !isActive && !isCompleted && messages.length > 0

              return (
                <Card
                  key={agent.id}
                  className={`p-4 text-center transition-all duration-500 ${agent.color} ${
                    isActive
                      ? `${agent.glow} scale-110 shadow-2xl ${agent.bgGlow} border-2`
                      : isCompleted
                        ? "opacity-90 scale-100 border-success/30"
                        : isWaiting
                          ? "opacity-40 scale-95"
                          : "opacity-60 scale-95"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isActive ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : undefined,
                  }}
                >
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    {isActive && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-spin opacity-50 blur-md" />
                        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                      </>
                    )}
                    <div
                      className={`relative w-full h-full rounded-full overflow-hidden border-2 ${
                        isActive
                          ? "border-primary shadow-lg shadow-primary/50"
                          : isCompleted
                            ? "border-success"
                            : "border-border"
                      } transition-all duration-300`}
                    >
                      <Image
                        src={agent.avatar || "/placeholder.svg"}
                        alt={agent.name}
                        fill
                        className={`object-cover transition-all duration-300 ${
                          isActive ? "scale-110 brightness-110" : isCompleted ? "brightness-100" : "brightness-75"
                        }`}
                      />
                    </div>
                    {isActive && (
                      <div className="absolute -top-1 -right-1 bg-background rounded-full p-1 shadow-lg">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      </div>
                    )}
                    {isCompleted && !isActive && (
                      <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-1 animate-in zoom-in-50 shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold mb-2">{agent.name}</p>
                  {isActive && (
                    <Badge variant="secondary" className="text-xs animate-pulse">
                      Analyzing...
                    </Badge>
                  )}
                  {isCompleted && !isActive && (
                    <Badge variant="outline" className="text-xs border-success text-success">
                      Complete
                    </Badge>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((msg, index) => {
            const agent = agents.find((a) => a.id === msg.agent)
            return (
              <div
                key={index}
                className="flex gap-3 animate-in slide-in-from-bottom-4 fade-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationDuration: "500ms",
                  animationFillMode: "both",
                }}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border shadow-lg">
                    <Image
                      src={agent?.avatar || "/images/logo-sentient.png"}
                      alt={agent?.name || "Meta Agent"}
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold gradient-text">{agent?.name || "Meta Agent"}</span>
                    {msg.confidence && (
                      <Badge variant="outline" className="text-xs">
                        {msg.confidence}% confidence
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

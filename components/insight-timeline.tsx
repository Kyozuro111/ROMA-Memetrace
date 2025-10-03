"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { fetchTokenData, analyzeSentiment, analyzeTechnical, assessRisk, type Chain } from "@/lib/crypto-api"

interface InsightTimelineProps {
  tokenAddress: string
  chain: Chain
}

interface Insight {
  time: string
  title: string
  description: string
  type: "info" | "success" | "warning" | "danger"
  source: string
}

export function InsightTimeline({ tokenAddress, chain }: InsightTimelineProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const isLoadingRef = useRef(false)
  const currentTokenRef = useRef<string>("")

  useEffect(() => {
    if (isLoadingRef.current || currentTokenRef.current === tokenAddress) {
      return
    }

    const loadInsights = async () => {
      isLoadingRef.current = true
      currentTokenRef.current = tokenAddress

      try {
        const tokenData = await fetchTokenData(tokenAddress, chain)
        const sentiment = await analyzeSentiment(tokenAddress, chain)
        const technical = await analyzeTechnical(tokenData)
        const risk = await assessRisk(tokenData, chain)

        const newInsights: Insight[] = []

        newInsights.push({
          time: new Date().toLocaleTimeString(),
          title: "Token Data Retrieved",
          description: `${tokenData.name} (${tokenData.symbol}) - $${tokenData.price.toFixed(6)}`,
          type: "info",
          source: "Data Collector",
        })

        if (sentiment.trending) {
          newInsights.push({
            time: new Date().toLocaleTimeString(),
            title: "Trending Alert",
            description: `${sentiment.mentions} mentions detected. High social activity!`,
            type: "success",
            source: "Sentiment Analyzer",
          })
        }

        if (technical.trend === "bullish") {
          newInsights.push({
            time: new Date().toLocaleTimeString(),
            title: "Bullish Momentum",
            description: technical.priceAction,
            type: "success",
            source: "Technical Analyst",
          })
        }

        if (risk.warnings.length > 0) {
          risk.warnings.forEach((warning) => {
            newInsights.push({
              time: new Date().toLocaleTimeString(),
              title: "Risk Warning",
              description: warning,
              type: risk.score > 60 ? "danger" : "warning",
              source: "Risk Assessor",
            })
          })
        }

        if (tokenData.liquidity > 100000) {
          newInsights.push({
            time: new Date().toLocaleTimeString(),
            title: "Healthy Liquidity",
            description: `$${tokenData.liquidity.toLocaleString()} in liquidity pool`,
            type: "success",
            source: "Data Collector",
          })
        }

        setInsights(newInsights)
      } catch (error) {
        console.error("Insight timeline error:", error)
      } finally {
        isLoadingRef.current = false
      }
    }

    loadInsights()

    return () => {
      isLoadingRef.current = false
    }
  }, [tokenAddress, chain])

  useEffect(() => {
    if (tokenAddress !== currentTokenRef.current) {
      currentTokenRef.current = ""
      isLoadingRef.current = false
    }
  }, [tokenAddress])

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning" />
      case "danger":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      default:
        return <TrendingUp className="w-4 h-4 text-primary" />
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "success":
        return "default"
      case "warning":
      case "danger":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="p-6 border-primary/20">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Insight Timeline</h3>
        <p className="text-sm text-muted-foreground">Key findings from agent analysis</p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex gap-3 animate-in slide-in-from-right-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex-shrink-0 pt-1">{getIcon(insight.type)}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold">{insight.title}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {insight.time}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
              <Badge variant={getBadgeVariant(insight.type)} className="text-xs">
                {insight.source}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

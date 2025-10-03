"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchTokenData, analyzeSentiment, analyzeTechnical, assessRisk, type Chain } from "@/lib/crypto-api"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

interface RiskRadarProps {
  tokenAddress: string
  chain: Chain
}

export function RiskRadar({ tokenAddress, chain }: RiskRadarProps) {
  const [radarData, setRadarData] = useState<any[]>([])
  const [overallRisk, setOverallRisk] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const tokenData = await fetchTokenData(tokenAddress, chain)
        const sentiment = await analyzeSentiment(tokenAddress, chain)
        const technical = await analyzeTechnical(tokenData)
        const risk = await assessRisk(tokenData, chain)

        // Calculate scores (0-100, higher is better)
        const liquidityScore = Math.min(100, (tokenData.liquidity / 100000) * 100)
        const volumeScore = Math.min(100, (tokenData.volume24h / tokenData.marketCap) * 1000)
        const sentimentScore = sentiment.score
        const safetyScore = 100 - risk.score

        const data = [
          { metric: "Sentiment", value: sentimentScore },
          { metric: "Liquidity", value: liquidityScore },
          { metric: "Volume", value: volumeScore },
          { metric: "Safety", value: safetyScore },
          { metric: "Trend", value: technical.trend === "bullish" ? 80 : technical.trend === "neutral" ? 50 : 20 },
        ]

        setRadarData(data)
        setOverallRisk(risk.score)
      } catch (error) {
        console.error("[ROMA] Error loading radar data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [tokenAddress, chain])

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-success"
    if (score < 60) return "text-warning"
    return "text-destructive"
  }

  const getRiskLabel = (score: number) => {
    if (score < 30) return "Low Risk"
    if (score < 60) return "Moderate Risk"
    return "High Risk"
  }

  return (
    <Card className="p-6 glass border-2 border-pink-500/20 animate-in fade-in slide-in-from-left-4 hover:scale-105 transition-all duration-300 glow-pink">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold gradient-text">Risk Radar</h3>
          <Badge variant="outline" className={`${getRiskColor(overallRisk)} border-current`}>
            {getRiskLabel(overallRisk)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Multi-dimensional risk assessment</p>
      </div>

      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500 glow-pink" />
            <div className="text-sm text-muted-foreground shimmer">Analyzing risk factors...</div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ff1b8d" strokeWidth={1.5} strokeOpacity={0.4} />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "hsl(var(--foreground))", fontSize: 13, fontWeight: 600 }}
                stroke="#ff6b35"
                strokeWidth={2}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                stroke="#ff8c42"
                strokeWidth={1.5}
              />
              <Radar name="Score" dataKey="value" stroke="#ff1b8d" fill="#ff1b8d" fillOpacity={0.6} strokeWidth={3} />
            </RadarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {radarData.map((item, index) => (
              <div
                key={item.metric}
                className="flex items-center justify-between p-3 rounded-lg glass border border-pink-500/20 hover:border-pink-500/50 transition-all animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-sm font-medium text-foreground">{item.metric}</span>
                <span className="text-sm font-bold gradient-text">{item.value.toFixed(0)}/100</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

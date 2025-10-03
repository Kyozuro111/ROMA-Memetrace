"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Brain } from "lucide-react"
import type { PricePrediction, Chain } from "@/lib/crypto-api"
import { predictPrice, fetchTokenData, analyzeSentiment } from "@/lib/crypto-api"

interface PricePredictionProps {
  tokenAddress: string
  chain: Chain
}

export function PricePredictionCard({ tokenAddress, chain }: PricePredictionProps) {
  const [data, setData] = useState<PricePrediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchTokenData(tokenAddress, chain), analyzeSentiment(tokenAddress, chain)])
      .then(([tokenData, sentiment]) => predictPrice(tokenData, sentiment))
      .then(setData)
      .finally(() => setLoading(false))
  }, [tokenAddress, chain])

  if (loading) {
    return (
      <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
          </div>
        </div>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm glow-purple">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Price Prediction
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">24h Prediction</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {data.prediction24h.change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span
                  className={`text-xl font-bold ${data.prediction24h.change > 0 ? "text-success" : "text-destructive"}`}
                >
                  {data.prediction24h.change > 0 ? "+" : ""}
                  {data.prediction24h.change.toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Confidence: {data.prediction24h.confidence.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">7d Prediction</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {data.prediction7d.change > 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span
                  className={`text-xl font-bold ${data.prediction7d.change > 0 ? "text-success" : "text-destructive"}`}
                >
                  {data.prediction7d.change > 0 ? "+" : ""}
                  {data.prediction7d.change.toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Confidence: {data.prediction7d.confidence.toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50">
          <p className="text-sm font-semibold mb-2">Key Factors</p>
          <div className="space-y-1">
            {data.factors.map((factor, i) => (
              <div key={i} className="text-xs text-muted-foreground">
                • {factor}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

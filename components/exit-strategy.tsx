"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp } from "lucide-react"
import type { ExitStrategy, Chain } from "@/lib/crypto-api"
import { calculateExitStrategy, fetchTokenData } from "@/lib/crypto-api"

interface ExitStrategyProps {
  tokenAddress: string
  chain: Chain
}

export function ExitStrategyCard({ tokenAddress, chain }: ExitStrategyProps) {
  const [data, setData] = useState<ExitStrategy | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTokenData(tokenAddress, chain)
      .then((tokenData) => calculateExitStrategy(tokenData))
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
            <Target className="w-5 h-5" />
            Exit Strategy
          </h3>
          <Badge variant="outline">{data.riskAdjustedSize}</Badge>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Price Targets</p>
            <div className="space-y-2">
              {data.targets.slice(0, 5).map((target) => (
                <div key={target.multiplier} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{target.multiplier}x</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono">${target.targetPrice.toFixed(8)}</span>
                    <Badge variant="secondary" className="text-xs">
                      {target.potentialReturn}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border/50">
            <p className="text-sm font-semibold mb-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Suggested Take-Profit Levels
            </p>
            <div className="space-y-2">
              {data.suggestedTakeProfit.map((tp) => (
                <div key={tp.level} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                  <div>
                    <div className="text-sm font-medium">{tp.level}</div>
                    <div className="text-xs text-muted-foreground">Sell {tp.percentage}%</div>
                  </div>
                  <div className="text-sm font-mono">${tp.price.toFixed(8)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

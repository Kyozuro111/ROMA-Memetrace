"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import type { WhaleActivity, Chain } from "@/lib/crypto-api"
import { fetchWhaleActivity } from "@/lib/crypto-api"

interface WhaleTrackerProps {
  tokenAddress: string
  chain: Chain
}

export function WhaleTracker({ tokenAddress, chain }: WhaleTrackerProps) {
  const [data, setData] = useState<WhaleActivity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWhaleActivity(tokenAddress, chain)
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
          <h3 className="text-lg font-semibold">Whale Activity</h3>
          {data.whaleAlert && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              Whale Alert
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Top Holders</p>
            <div className="space-y-2">
              {data.topHolders.slice(0, 5).map((holder, i) => (
                <div key={holder.address} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    #{i + 1} {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                  </span>
                  <span className="font-mono">{holder.percentage.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Recent Large Transactions</p>
            <div className="space-y-2">
              {data.recentTransactions.slice(0, 3).map((tx) => (
                <div key={tx.txHash} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                  <div className="flex items-center gap-2">
                    {tx.type === "buy" ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className="text-sm capitalize">{tx.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">${tx.usdValue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

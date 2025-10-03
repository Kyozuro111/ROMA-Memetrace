"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react"
import type { SocialHype, Chain } from "@/lib/crypto-api"
import { analyzeSocialHype, fetchTokenData } from "@/lib/crypto-api"

interface SocialHypeProps {
  tokenAddress: string
  tokenName: string
  chain: Chain
}

export function SocialHypeScore({ tokenAddress, tokenName, chain }: SocialHypeProps) {
  const [data, setData] = useState<SocialHype | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tokenSymbol, setTokenSymbol] = useState<string>("")

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchTokenData(tokenAddress, chain)
      .then((tokenData) => {
        setTokenSymbol(tokenData.symbol)
        return analyzeSocialHype(tokenAddress, tokenData.symbol)
      })
      .then((result) => {
        if (result && typeof result === "object" && "hypeScore" in result) {
          setData(result)
        } else {
          console.error("Invalid social hype data structure:", result)
          setError("Invalid data received")
        }
      })
      .catch((err) => {
        console.error("Social hype error:", err)
        setError(err.message || "Failed to load social data")
      })
      .finally(() => setLoading(false))
  }, [tokenAddress, chain])

  if (loading) {
    return (
      <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-20 bg-muted rounded" />
        </div>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Social Hype</h3>
          <p className="text-sm text-muted-foreground">{error || "Unable to load social data"}</p>
        </div>
      </Card>
    )
  }

  const twitterMentions = data.twitterMentions24h ?? 0
  const redditPosts = data.redditPosts24h ?? 0
  const telegramMembers = data.telegramMembers
  const hypeScore = data.hypeScore ?? 0
  const trendingVelocity = data.trendingVelocity ?? "stable"
  const isOrganic = data.isOrganic ?? true

  const getHypeColor = (score: number) => {
    if (score >= 60) return "text-success"
    if (score >= 30) return "text-warning"
    return "text-destructive"
  }

  const getQualityColor = (quality: string) => {
    if (quality === "high") return "default"
    if (quality === "medium") return "secondary"
    return "outline"
  }

  const getSourceBadge = (source: string) => {
    const sourceMap: Record<string, string> = {
      coingecko: "CoinGecko",
      opendeepsearch: "ODS",
      serper: "Serper",
      estimated: "Estimated",
      unavailable: "N/A",
    }
    return sourceMap[source] || source
  }

  const velocityIcon =
    trendingVelocity === "accelerating" ? (
      <TrendingUp className="w-4 h-4 text-success" />
    ) : trendingVelocity === "declining" ? (
      <TrendingDown className="w-4 h-4 text-destructive" />
    ) : (
      <Minus className="w-4 h-4 text-muted-foreground" />
    )

  return (
    <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm glow-purple">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Social Hype</h3>
          <div className="flex items-center gap-2">
            <Badge variant={isOrganic ? "default" : "destructive"}>{isOrganic ? "Organic" : "Suspicious"}</Badge>
            {data.dataQuality && (
              <Badge variant={getQualityColor(data.dataQuality)} className="text-xs">
                {data.dataQuality.charAt(0).toUpperCase() + data.dataQuality.slice(1)} Quality
              </Badge>
            )}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              Social metrics are approximate and aggregated from multiple sources. Data should be used as relative
              indicators, not absolute values.
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Hype Score</span>
            <div className="flex items-center gap-2">
              <div className={`text-2xl font-bold ${getHypeColor(hypeScore)}`}>{hypeScore}/100</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Twitter Mentions (24h)</p>
                {data.dataSources?.twitter && (
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    {getSourceBadge(data.dataSources.twitter)}
                  </Badge>
                )}
              </div>
              <p className="text-lg font-semibold">{twitterMentions.toLocaleString()}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Reddit Posts (24h)</p>
                {data.dataSources?.reddit && (
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    {getSourceBadge(data.dataSources.reddit)}
                  </Badge>
                )}
              </div>
              <p className="text-lg font-semibold">{redditPosts.toLocaleString()}</p>
            </div>
          </div>

          {telegramMembers !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Telegram Members</p>
                {data.dataSources?.telegram && (
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    {getSourceBadge(data.dataSources.telegram)}
                  </Badge>
                )}
              </div>
              <p className="text-lg font-semibold">{telegramMembers.toLocaleString()}</p>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <span className="text-sm">Trending Velocity</span>
            <div className="flex items-center gap-2">
              {velocityIcon}
              <span className="text-sm font-semibold capitalize">{trendingVelocity}</span>
            </div>
          </div>

          {data.notes && data.notes.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                Data Notes
              </p>
              {data.notes.map((note, i) => (
                <div key={i} className="text-xs text-muted-foreground pl-4">
                  • {note}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

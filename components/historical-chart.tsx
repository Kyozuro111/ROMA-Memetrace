"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { fetchTokenData, type Chain } from "@/lib/crypto-api"
import { TrendingUp, TrendingDown } from "lucide-react"

interface HistoricalChartProps {
  tokenAddress: string
  chain: Chain
}

export function HistoricalChart({ tokenAddress, chain }: HistoricalChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [priceChange, setPriceChange] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const tokenData = await fetchTokenData(tokenAddress, chain)

        // Generate 7 days of historical data (simulated for demo)
        // In production, fetch real historical data from CoinGecko or DexScreener
        const data = Array.from({ length: 7 }, (_, i) => {
          const daysAgo = 6 - i
          const randomChange = (Math.random() - 0.5) * 0.2
          const price = tokenData.price * (1 + randomChange)

          return {
            date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            price: price,
            volume: tokenData.volume24h * (0.8 + Math.random() * 0.4),
          }
        })

        setChartData(data)
        setPriceChange(tokenData.priceChange24h)
      } catch (error) {
        console.error("Error loading chart data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [tokenAddress, chain])

  return (
    <Card className="p-6 border-primary/20">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">7-Day Price History</h3>
          <div className={`flex items-center gap-1 ${priceChange >= 0 ? "text-success" : "text-destructive"}`}>
            {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-semibold">
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Recent price movement and volume</p>
      </div>

      {isLoading ? (
        <div className="h-[250px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading chart...</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} tickFormatter={(value) => `$${value.toFixed(6)}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
              formatter={(value: any) => [`$${value.toFixed(8)}`, "Price"]}
            />
            <Area type="monotone" dataKey="price" stroke="#a855f7" strokeWidth={2} fill="url(#priceGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}

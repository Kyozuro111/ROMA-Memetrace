"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Activity, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AgentTheater } from "@/components/agent-theater"
import { RiskRadar } from "@/components/risk-radar"
import { InsightTimeline } from "@/components/insight-timeline"
import { SocialHypeScore } from "@/components/social-hype"
import { SecurityScan } from "@/components/security-scan"
import { ExitStrategyCard } from "@/components/exit-strategy"
import { PricePredictionCard } from "@/components/price-prediction"
import { DobbyChat } from "@/components/dobby-chat"
import type { Chain } from "@/lib/crypto-api"

export default function DashboardPage() {
  const [tokenAddress, setTokenAddress] = useState("")
  const [selectedChain, setSelectedChain] = useState<Chain>("ethereum")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzedToken, setAnalyzedToken] = useState<string | null>(null)
  const agentTheaterRef = useRef<HTMLDivElement>(null)

  const chains: Array<{ id: Chain; name: string; color: string }> = [
    { id: "solana", name: "Solana", color: "bg-purple-500" },
    { id: "ethereum", name: "Ethereum", color: "bg-blue-500" },
    { id: "bsc", name: "BSC", color: "bg-yellow-500" },
    { id: "base", name: "Base", color: "bg-blue-400" },
  ]

  const handleAnalyze = () => {
    if (!tokenAddress) return
    setIsAnalyzing(true)
    setAnalyzedToken(tokenAddress)

    setTimeout(() => {
      agentTheaterRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    }, 300)
  }

  const handleReset = () => {
    setTokenAddress("")
    setAnalyzedToken(null)
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen gradient-bg">
      <header className="border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <Image
              src="/images/logo-sentient.png"
              alt="Sentient"
              width={32}
              height={32}
              className="glow-purple rounded-lg animate-pulse"
            />
            <span className="text-xl font-bold gradient-text">ROMA Memetrace</span>
          </Link>
          <Badge variant="secondary" className="gap-2 pulse-glow">
            <Activity className="w-3 h-3" />
            All Systems Operational
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 mb-8 glass border-2 border-primary/30 glow-purple animate-in fade-in slide-in-from-top-4">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 gradient-text">Analyze Memecoin</h1>
              <p className="text-muted-foreground">Enter a token contract address and select the blockchain network</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {chains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => setSelectedChain(chain.id)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                    selectedChain === chain.id
                      ? "border-primary bg-primary/20 glow-purple"
                      : "border-border/50 hover:border-primary/50 glass"
                  }`}
                  disabled={isAnalyzing}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${chain.color} animate-pulse`} />
                    <span className="font-semibold">{chain.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Input
                placeholder={
                  selectedChain === "solana" ? "Enter Solana token address..." : "Enter contract address (0x...)"
                }
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="flex-1 h-12 text-base glass border-2 border-primary/20 focus:border-primary/50 focus:glow-purple transition-all"
                disabled={isAnalyzing}
              />
              {analyzedToken ? (
                <Button
                  size="lg"
                  onClick={handleReset}
                  variant="outline"
                  className="hover:scale-105 transition-transform glass bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={!tokenAddress}
                  className="glow-purple hover:scale-105 transition-transform"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Analyze
                </Button>
              )}
            </div>

            {/* Example Addresses */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Try examples:</span>
              <button
                onClick={() => {
                  setSelectedChain("ethereum")
                  setTokenAddress("0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE")
                }}
                className="text-xs text-primary hover:underline"
              >
                SHIB (ETH)
              </button>
              <button
                onClick={() => {
                  setSelectedChain("solana")
                  setTokenAddress("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263")
                }}
                className="text-xs text-primary hover:underline"
              >
                BONK (SOL)
              </button>
            </div>
          </div>
        </Card>

        {analyzedToken && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div ref={agentTheaterRef} className="scroll-mt-20">
              <AgentTheater tokenAddress={analyzedToken} chain={selectedChain} isAnalyzing={isAnalyzing} />
            </div>

            {/* Risk Radar and Timeline - Side by Side */}
            <div className="grid lg:grid-cols-2 gap-8">
              <RiskRadar tokenAddress={analyzedToken} chain={selectedChain} />
              <InsightTimeline tokenAddress={analyzedToken} chain={selectedChain} />
            </div>

            {/* SocialHypeScore and SecurityScan - Side by Side */}
            <div className="grid lg:grid-cols-2 gap-6">
              <SocialHypeScore tokenAddress={analyzedToken} tokenName="Token" chain={selectedChain} />
              <SecurityScan tokenAddress={analyzedToken} chain={selectedChain} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <ExitStrategyCard tokenAddress={analyzedToken} chain={selectedChain} />
              <PricePredictionCard tokenAddress={analyzedToken} chain={selectedChain} />
            </div>

            {/* Dobby AI Chat Assistant */}
            <DobbyChat tokenAddress={analyzedToken} chain={selectedChain} />
          </div>
        )}

        {!analyzedToken && (
          <div className="text-center py-20 animate-in fade-in zoom-in-95">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center glow-purple pulse-glow">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold gradient-text">Ready to Analyze</h3>
              <p className="text-muted-foreground leading-relaxed">
                Enter a memecoin contract address above to watch ROMA agents collaborate and provide deep insights
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Card className="p-4 text-center glass border-2 border-primary/20 hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold gradient-text">4</div>
                  <div className="text-xs text-muted-foreground">AI Agents</div>
                </Card>
                <Card className="p-4 text-center glass border-2 border-accent/20 hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold gradient-text">4</div>
                  <div className="text-xs text-muted-foreground">Blockchains</div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-border/50 py-12 mt-20 glass">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-sentient.png"
                alt="Sentient"
                width={40}
                height={40}
                className="glow-pink rounded-lg animate-pulse"
              />
              <span className="text-2xl font-bold gradient-text">ROMA Memetrace</span>
            </div>

            <div className="flex items-center gap-2 text-center flex-wrap justify-center">
              <span className="text-muted-foreground">Built by</span>
              <a
                href="https://x.com/Kyozuro_1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass border border-pink-500/30 hover:border-pink-500/60 transition-all hover:scale-105 glow-pink group"
              >
                <svg
                  className="w-4 h-4 fill-current text-pink-500 group-hover:text-pink-400 transition-colors"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="font-semibold gradient-text">Kyozuro</span>
              </a>
              <span className="text-muted-foreground">with</span>
              <span className="text-2xl">❤️</span>
              <span className="text-muted-foreground">for</span>
              <span className="font-semibold gradient-text">Sentient Community</span>
            </div>

            <div className="text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Powered by ROMA & Dobby-Unhinged
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

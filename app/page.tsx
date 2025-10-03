import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Shield, Zap, Eye, BarChart3, Search, Activity } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg">
      <header className="border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-sentient.png"
              alt="Sentient"
              width={32}
              height={32}
              className="glow-purple rounded-lg animate-pulse"
            />
            <span className="text-xl font-bold gradient-text">ROMA Memetrace</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-primary transition-all hover:scale-105"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-primary transition-all hover:scale-105"
            >
              How It Works
            </Link>
            <Link
              href="#agents"
              className="text-sm text-muted-foreground hover:text-primary transition-all hover:scale-105"
            >
              Agents
            </Link>
            <Button asChild className="glow-purple hover:scale-105 transition-transform">
              <Link href="/dashboard">Launch App</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <Badge variant="secondary" className="px-4 py-1.5 glow-purple pulse-glow">
            <Sparkles className="w-3 h-3 mr-1.5" />
            Powered by ROMA Multi-Agent AI
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance">
            <span className="gradient-text">ROMA</span> Memecoin Intelligence
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Advanced multi-agent AI system analyzing memecoins across Solana, Ethereum, BSC, and Base. Real-time
            insights powered by ROMA, with Dobby providing unfiltered analysis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="glow-purple hover:scale-105 transition-transform">
              <Link href="/dashboard">
                Start Analyzing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover:scale-105 transition-transform bg-transparent">
              <Link href="#agents">Meet the Agents</Link>
            </Button>
          </div>

          <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>4 AI Agents Active</span>
            </div>
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 delay-100">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 delay-200">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Multi-Chain Support</span>
            </div>
          </div>
        </div>
      </section>

      <section id="agents" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Meet Your AI Agent Team</h2>
          <p className="text-muted-foreground text-lg">Four specialized agents working together for you</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 space-y-4 glass hover:scale-105 transition-all duration-300 glow-purple float-animation">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden glow-purple">
                <Image src="/images/agent-data.webp" alt="Data Collector" width={96} height={96} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center">Data Collector</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Gathers on-chain data, price history, volume, liquidity, and holder distribution across all chains
            </p>
          </Card>

          <Card className="p-6 space-y-4 glass hover:scale-105 transition-all duration-300 glow-green float-animation delay-100">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center overflow-hidden glow-green">
                <Image src="/images/agent-sentiment.webp" alt="Sentiment Analyzer" width={96} height={96} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center">Sentiment Analyzer</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Scans Twitter, Reddit, and crypto forums to gauge community sentiment and detect trending signals
            </p>
          </Card>

          <Card className="p-6 space-y-4 glass hover:scale-105 transition-all duration-300 glow-cyan float-animation delay-200">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden glow-cyan">
                <Image src="/images/agent-technical.webp" alt="Technical Analyst" width={96} height={96} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center">Technical Analyst</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Analyzes chart patterns, volume trends, and trading signals to identify opportunities
            </p>
          </Card>

          <Card className="p-6 space-y-4 glass hover:scale-105 transition-all duration-300 glow-red float-animation delay-300">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center overflow-hidden glow-red">
                <Image src="/images/agent-risk.webp" alt="Risk Assessor" width={96} height={96} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center">Risk Assessor</h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Detects rug pull risks, honeypots, and evaluates liquidity health to protect your investments
            </p>
          </Card>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Why ROMA Memetrace?</h2>
          <p className="text-muted-foreground text-lg">Multi-agent intelligence meets memecoin chaos</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4 glass hover:scale-105 transition-all duration-300 hover:glow-purple">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center glow-purple">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Live Agent Theater</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Watch agents discuss and collaborate in real-time. See their thoughts, findings, and reasoning process
            </p>
          </Card>

          <Card className="p-6 space-y-4 glass hover:scale-105 transition-all duration-300 hover:glow-cyan">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center glow-cyan">
              <BarChart3 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Risk Radar</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Visual radar chart showing sentiment, liquidity, holder distribution, volume trends, and rug pull risk
            </p>
          </Card>

          <Card className="p-6 space-y-4 glass hover:scale-105 transition-all duration-300 hover:glow-blue">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center glow-blue">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold">Multi-Chain Support</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Analyze memecoins on Solana, Ethereum, BSC, and Base with unified insights across all chains
            </p>
          </Card>

          <Card className="p-6 space-y-4 glass hover:scale-105 transition-all duration-300 hover:glow-purple">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center glow-purple">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Timeline of Insights</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track every insight discovered by agents with timestamps, sources, and confidence scores
            </p>
          </Card>

          <Card className="p-6 space-y-4 glass hover:scale-105 transition-all duration-300 hover:glow-green">
            <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center glow-green">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">100% Free</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No API keys needed. No subscriptions. Just paste a contract address and get instant analysis
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">How ROMA Works</h2>
            <p className="text-muted-foreground text-lg">Transparent AI collaboration you can watch in real-time</p>
          </div>

          <div className="space-y-6 px-4 md:px-0">
            {[
              {
                step: "01",
                title: "Enter Memecoin Address",
                description: "Paste any token contract address from Solana, Ethereum, BSC, or Base",
                icon: <Search className="w-6 h-6" />,
                color: "from-pink-500/20 to-rose-500/20",
                borderColor: "border-pink-500/50",
                glowColor: "glow-pink",
              },
              {
                step: "02",
                title: "Agents Activate",
                description: "Watch 4 specialized agents spring into action, each with their own expertise",
                icon: <Sparkles className="w-6 h-6" />,
                color: "from-orange-500/20 to-amber-500/20",
                borderColor: "border-orange-500/50",
                glowColor: "glow-orange",
              },
              {
                step: "03",
                title: "Real-time Collaboration",
                description: "See agents communicate, share findings, and build a comprehensive analysis",
                icon: <Activity className="w-6 h-6" />,
                color: "from-rose-500/20 to-pink-500/20",
                borderColor: "border-rose-500/50",
                glowColor: "glow-pink",
              },
              {
                step: "04",
                title: "Get Actionable Insights",
                description: "Receive risk scores, sentiment analysis, and trading recommendations",
                icon: <BarChart3 className="w-6 h-6" />,
                color: "from-amber-500/20 to-orange-500/20",
                borderColor: "border-amber-500/50",
                glowColor: "glow-orange",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-6 items-start animate-in fade-in slide-in-from-left-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-xl glass border-2 ${item.borderColor} flex items-center justify-center ${item.glowColor} pulse-glow bg-gradient-to-br ${item.color}`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center space-y-6 glass border-2 border-primary/30 glow-purple pulse-glow">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">Ready to Decode Memecoins?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Join traders using advanced multi-agent analysis to make smarter memecoin investments
          </p>
          <Button asChild size="lg" className="glow-purple hover:scale-110 transition-transform">
            <Link href="/dashboard">
              Launch Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </Card>
      </section>

      <footer className="border-t border-border/50 py-12 glass">
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

const API_KEYS = {
  COINGECKO: process.env.COINGECKO_API_KEY || "",
  BIRDEYE: process.env.BIRDEYE_API_KEY || "",
  ETHERSCAN: process.env.ETHERSCAN_API_KEY || "",
  SOLSCAN: process.env.SOL_API_KEY || "",
}

export type Chain = "solana" | "ethereum" | "bsc" | "base"

export interface TokenData {
  address: string
  chain: Chain
  name: string
  symbol: string
  price: number
  priceChange24h: number
  volume24h: number
  marketCap: number
  liquidity: number
  holders: number
  createdAt: string
}

export interface WhaleActivity {
  topHolders: Array<{
    address: string
    balance: number
    percentage: number
  }>
  recentTransactions: Array<{
    type: "buy" | "sell"
    amount: number
    usdValue: number
    timestamp: string
    txHash: string
  }>
  whaleAlert: boolean
}

export interface SocialHype {
  twitterMentions24h: number
  redditPosts24h: number
  telegramMembers?: number
  trendingVelocity: "accelerating" | "stable" | "declining"
  hypeScore: number // 0-100
  isOrganic: boolean
  dataSources: {
    twitter: "coingecko" | "opendeepsearch" | "serper" | "estimated" | "unavailable"
    reddit: "coingecko" | "opendeepsearch" | "serper" | "estimated" | "unavailable"
    telegram: "coingecko" | "unavailable"
  }
  dataQuality: "high" | "medium" | "low"
  notes?: string[]
}

export interface LiquidityLock {
  isLocked: boolean
  lockedAmount: number
  lockedPercentage: number
  unlockDate?: string
  lockProvider?: string
  dataSource: "dexscreener" | "birdeye" | "estimated" | "unavailable"
  confidence: "high" | "medium" | "low"
}

export interface ContractSecurity {
  isHoneypot: boolean
  hasHiddenFees: boolean
  canMint: boolean
  canBurn: boolean
  ownershipRenounced: boolean
  securityScore: number // 0-100
  risks: string[]
}

export interface ExitStrategy {
  currentMarketCap: number
  targets: Array<{
    multiplier: number
    targetMC: number
    targetPrice: number
    potentialReturn: string
  }>
  suggestedTakeProfit: Array<{
    level: string
    percentage: number
    price: number
  }>
  riskAdjustedSize: string
}

export interface SimilarToken {
  address: string
  name: string
  symbol: string
  similarity: number
  outcome: "success" | "failed" | "active"
  maxMarketCap: number
  currentMarketCap: number
  roi: number
}

export interface PricePrediction {
  prediction24h: {
    price: number
    change: number
    confidence: number
  }
  prediction7d: {
    price: number
    change: number
    confidence: number
  }
  factors: string[]
}

export interface SentimentData {
  score: number // 0-100
  mentions: number
  trending: boolean
  sources: Array<{
    platform: string
    sentiment: "positive" | "neutral" | "negative"
    url: string
  }>
}

export interface TechnicalData {
  trend: "bullish" | "bearish" | "neutral"
  volumeTrend: "increasing" | "decreasing" | "stable"
  priceAction: string
  support: number
  resistance: number
}

export interface RiskData {
  score: number // 0-100, higher is riskier
  rugPullRisk: number
  honeypotRisk: number
  liquidityLocked: boolean
  contractVerified: boolean
  warnings: string[]
}

// Fetch token data from CoinGecko and chain-specific APIs
export async function fetchTokenData(address: string, chain: Chain): Promise<TokenData> {
  try {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "fetchTokenData", address, chain }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to fetch token data")
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching token data:", error)
    throw new Error(error.message || "Failed to fetch token data")
  }
}

export async function analyzeSentiment(address: string, chain: Chain): Promise<SentimentData> {
  const response = await fetch("/api/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "analyzeSentiment", address, chain }),
  })
  return await response.json()
}

export async function analyzeTechnical(tokenData: TokenData): Promise<TechnicalData> {
  const response = await fetch("/api/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "analyzeTechnical", tokenData }),
  })
  return await response.json()
}

export async function assessRisk(tokenData: TokenData, chain: Chain): Promise<RiskData> {
  const response = await fetch("/api/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "assessRisk", tokenData, chain }),
  })
  return await response.json()
}

export async function fetchWhaleActivity(address: string, chain: Chain): Promise<WhaleActivity> {
  const response = await fetch("/api/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "fetchWhaleActivity", address, chain }),
  })
  return await response.json()
}

export async function analyzeSocialHype(address: string, tokenName: string): Promise<SocialHype> {
  const response = await fetch("/api/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "analyzeSocialHype", address, tokenName }),
  })
  return await response.json()
}

export async function checkLiquidityLock(address: string, chain: Chain): Promise<LiquidityLock> {
  const response = await fetch("/api/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "checkLiquidityLock", address, chain }),
  })
  return await response.json()
}

export async function scanContractSecurity(address: string, chain: Chain): Promise<ContractSecurity> {
  const response = await fetch("/api/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "scanContractSecurity", address, chain }),
  })
  return await response.json()
}

export async function calculateExitStrategy(tokenData: TokenData): Promise<ExitStrategy> {
  const response = await fetch("/api/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "calculateExitStrategy", tokenData }),
  })
  return await response.json()
}

export async function findSimilarTokens(tokenData: TokenData): Promise<SimilarToken[]> {
  const response = await fetch("/api/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "findSimilarTokens", tokenData }),
  })
  return await response.json()
}

export async function predictPrice(tokenData: TokenData, sentiment: SentimentData): Promise<PricePrediction> {
  const response = await fetch("/api/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "predictPrice", tokenData, sentiment }),
  })
  return await response.json()
}

function getCoingeckoChainId(chain: Chain): string {
  switch (chain) {
    case "solana":
      return "solana"
    case "ethereum":
      return "ethereum"
    case "bsc":
      return "binance-smart-chain"
    case "base":
      return "base"
    default:
      return "ethereum"
  }
}

import type { Chain, TokenData, SentimentData } from "./crypto-api"

// Client-side API wrapper to call our API routes
export const cryptoApiClient = {
  async fetchTokenData(address: string, chain: Chain) {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "fetchTokenData", address, chain }),
    })
    if (!response.ok) throw new Error("Failed to fetch token data")
    return response.json()
  },

  async analyzeSentiment(address: string, chain: Chain) {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "analyzeSentiment", address, chain }),
    })
    if (!response.ok) throw new Error("Failed to analyze sentiment")
    return response.json()
  },

  async analyzeTechnical(tokenData: TokenData) {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "analyzeTechnical", tokenData }),
    })
    if (!response.ok) throw new Error("Failed to analyze technical")
    return response.json()
  },

  async assessRisk(tokenData: TokenData, chain: Chain) {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "assessRisk", tokenData, chain }),
    })
    if (!response.ok) throw new Error("Failed to assess risk")
    return response.json()
  },

  async fetchWhaleActivity(address: string, chain: Chain) {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "fetchWhaleActivity", address, chain }),
    })
    if (!response.ok) throw new Error("Failed to fetch whale activity")
    return response.json()
  },

  async analyzeSocialHype(address: string, tokenName: string) {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "analyzeSocialHype", address, tokenData: { name: tokenName } }),
    })
    if (!response.ok) throw new Error("Failed to analyze social hype")
    return response.json()
  },

  async checkLiquidityLock(address: string, chain: Chain) {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "checkLiquidityLock", address, chain }),
    })
    if (!response.ok) throw new Error("Failed to check liquidity lock")
    return response.json()
  },

  async scanContractSecurity(address: string, chain: Chain) {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "scanContractSecurity", address, chain }),
    })
    if (!response.ok) throw new Error("Failed to scan contract security")
    return response.json()
  },

  async calculateExitStrategy(tokenData: TokenData) {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "calculateExitStrategy", tokenData }),
    })
    if (!response.ok) throw new Error("Failed to calculate exit strategy")
    return response.json()
  },

  async findSimilarTokens(tokenData: TokenData) {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "findSimilarTokens", tokenData }),
    })
    if (!response.ok) throw new Error("Failed to find similar tokens")
    return response.json()
  },

  async predictPrice(tokenData: TokenData, sentiment: SentimentData) {
    const response = await fetch("/api/crypto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "predictPrice", tokenData, sentiment }),
    })
    if (!response.ok) throw new Error("Failed to predict price")
    return response.json()
  },
}

export const aiApiClient = {
  async generateAgentInsight(agent: "data" | "sentiment" | "technical" | "risk", context: any) {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generateAgentInsight", agent, context }),
    })
    if (!response.ok) throw new Error("Failed to generate agent insight")
    const data = await response.json()
    return data.result
  },

  async chatWithDobby(
    userMessage: string,
    tokenContext: any,
    conversationHistory: Array<{ role: string; content: string }>,
  ) {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "chatWithDobby", userMessage, tokenContext, conversationHistory }),
    })
    if (!response.ok) throw new Error("Failed to chat with Dobby")
    const data = await response.json()
    return data.result
  },
}

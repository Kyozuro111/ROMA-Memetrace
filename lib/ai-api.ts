const API_KEYS = {
  GROQ: process.env.GROQ_API_KEY || "",
  FIREWORKS: process.env.FIREWORKS_API_KEY || "",
  OPENROUTER: process.env.OPENROUTER_API_KEY || "",
}

export interface AgentMessage {
  agent: "data" | "sentiment" | "technical" | "risk" | "meta"
  message: string
  timestamp: number
  confidence?: number
}

export async function generateAgentInsight(
  agent: "data" | "sentiment" | "technical" | "risk",
  context: any,
): Promise<string> {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generateAgentInsight", agent, context }),
    })

    if (!response.ok) {
      throw new Error("AI API request failed")
    }

    const data = await response.json()
    return data.insight
  } catch (error) {
    console.error(`Error generating ${agent} insight:`, error)
    return getFallbackInsight(agent, context)
  }
}

function getSystemPrompt(agent: string): string {
  const prompts = {
    data: "You are a Data Collector agent analyzing memecoin on-chain data. Be concise and factual. Focus on key metrics.",
    sentiment:
      "You are a Sentiment Analyzer agent tracking social media buzz. Be enthusiastic but honest about community sentiment.",
    technical:
      "You are a Technical Analyst agent reading charts and patterns. Use trading terminology and be analytical.",
    risk: "You are a Risk Assessor agent identifying dangers. Be cautious and highlight red flags clearly.",
  }
  return prompts[agent as keyof typeof prompts] || prompts.data
}

function buildPrompt(agent: string, context: any): string {
  switch (agent) {
    case "data":
      return `Analyze this memecoin data: Price: $${context.price}, Market Cap: $${context.marketCap}, Volume: $${context.volume24h}, Liquidity: $${context.liquidity}. Give a brief insight in 1-2 sentences.`
    case "sentiment":
      return `This memecoin has ${context.mentions} social mentions with a sentiment score of ${context.score}/100. Is it trending? Give insight in 1-2 sentences.`
    case "technical":
      return `Price change 24h: ${context.priceChange24h}%, Trend: ${context.trend}, Volume trend: ${context.volumeTrend}. Provide technical analysis in 1-2 sentences.`
    case "risk":
      return `Risk score: ${context.score}/100, Rug pull risk: ${context.rugPullRisk}, Warnings: ${context.warnings.join(", ")}. Assess the risk in 1-2 sentences.`
    default:
      return "Analyze this memecoin."
  }
}

function getFallbackInsight(agent: string, context: any): string {
  const fallbacks = {
    data: `Found token data: $${context.price} price with $${context.volume24h.toLocaleString()} daily volume. Market cap is $${context.marketCap.toLocaleString()}.`,
    sentiment: `Detected ${context.mentions} social mentions with ${context.score > 60 ? "positive" : context.score > 40 ? "neutral" : "negative"} sentiment overall.`,
    technical: `Price is ${context.priceChange24h > 0 ? "up" : "down"} ${Math.abs(context.priceChange24h).toFixed(2)}% in 24h. ${context.trend === "bullish" ? "Bullish momentum detected." : context.trend === "bearish" ? "Bearish pressure present." : "Sideways movement."}`,
    risk: `Risk score: ${context.score}/100. ${context.warnings.length > 0 ? context.warnings[0] : "Standard risk factors detected."}`,
  }
  return fallbacks[agent as keyof typeof fallbacks] || "Analysis complete."
}

export async function chatWithDobby(
  userMessage: string,
  tokenContext: any,
  conversationHistory: Array<{ role: string; content: string }>,
): Promise<string> {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "chatWithDobby", userMessage, tokenContext, conversationHistory }),
    })

    if (!response.ok) {
      throw new Error("Dobby API request failed")
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error("Error chatting with Dobby:", error)
    return "Yo, my API connection is acting up. Try asking again in a sec, or maybe rephrase your question."
  }
}

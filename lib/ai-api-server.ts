// Server-side AI implementations that make actual API calls

const API_KEYS = {
  GROQ: process.env.GROQ_API_KEY || "",
  FIREWORKS: process.env.FIREWORKS_API_KEY || "",
  OPENROUTER: process.env.OPENROUTER_API_KEY || "",
}

export async function generateAgentInsight(
  agent: "data" | "sentiment" | "technical" | "risk",
  context: any,
): Promise<string> {
  try {
    const prompt = buildPrompt(agent, context)

    console.log(`[ROMA Server] Generating ${agent} insight with Groq`)

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEYS.GROQ}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: getSystemPrompt(agent),
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      console.error(`[ROMA Server] Groq API error: ${response.status}`)
      throw new Error("AI API request failed")
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error(`[ROMA Server] Error generating ${agent} insight:`, error)
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
    let contextSummary = ""
    if (tokenContext) {
      const { tokenData, sentiment, technical, risk, security, exitStrategy, prediction, socialHype, liquidityLock } =
        tokenContext

      contextSummary = `
COMPLETE TOKEN ANALYSIS:

Basic Info:
- Name: ${tokenData.name} (${tokenData.symbol})
- Chain: ${tokenData.chain.toUpperCase()}
- Contract: ${tokenData.address}
- Price: $${tokenData.price.toFixed(8)}
- Market Cap: $${tokenData.marketCap.toLocaleString()}
- 24h Change: ${tokenData.priceChange24h > 0 ? "+" : ""}${tokenData.priceChange24h.toFixed(2)}%
- Volume 24h: $${tokenData.volume24h.toLocaleString()}
- Liquidity: $${tokenData.liquidity.toLocaleString()}
- Holders: ${tokenData.holders.toLocaleString()}

Sentiment Analysis:
- Overall Score: ${sentiment.score}/100 (${sentiment.score > 70 ? "Very Positive" : sentiment.score > 50 ? "Positive" : sentiment.score > 30 ? "Neutral" : "Negative"})
- Social Mentions: ${sentiment.mentions.toLocaleString()}
- Trending: ${sentiment.trending ? "YES - Hot right now!" : "No"}

Technical Analysis:
- Trend: ${technical.trend.toUpperCase()} ${technical.trend === "bullish" ? "📈" : technical.trend === "bearish" ? "📉" : "➡️"}
- Volume Trend: ${technical.volumeTrend}
- Price Action: ${technical.priceAction}

Risk Assessment:
- Overall Risk Score: ${risk.score}/100 ${risk.score > 70 ? "🔴 HIGH RISK" : risk.score > 40 ? "🟡 MEDIUM RISK" : "🟢 LOW RISK"}
- Rug Pull Risk: ${risk.rugPullRisk}/100
- Honeypot Risk: ${risk.honeypotRisk}/100
${risk.warnings.length > 0 ? `- ⚠️ WARNINGS: ${risk.warnings.join("; ")}` : "- No major warnings"}
`
    }

    console.log("[ROMA Server] Chatting with Dobby via Fireworks AI")

    const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEYS.FIREWORKS}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new",
        messages: [
          {
            role: "system",
            content: `You are Dobby, an unhinged but brilliant memecoin advisor. You're blunt, sometimes rude, but always honest and helpful. You give straight talk about crypto investments without sugar-coating.

${contextSummary}

Based on this analysis, answer the user's questions with specific insights and data.`,
          },
          ...conversationHistory.slice(-6).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.9,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      console.error(`[ROMA Server] Fireworks API error: ${response.status}`)
      throw new Error("Dobby API request failed")
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("[ROMA Server] Error chatting with Dobby:", error)
    return "Yo, my API connection is acting up. Try asking again in a sec, or maybe rephrase your question."
  }
}

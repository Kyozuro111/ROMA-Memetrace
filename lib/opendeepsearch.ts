// OpenDeepSearch integration for accurate web search and social data
// Uses Serper/Tavily for search and provides semantic reranking

const API_KEYS = {
  SERPER: process.env.SERPER_API_KEY || "",
  TAVILY: process.env.TAVILY_API_KEY || "",
}

export interface SearchResult {
  title: string
  url: string
  snippet: string
  date?: string
  relevanceScore: number
}

export interface DeepSearchOptions {
  mode?: "default" | "pro"
  maxResults?: number
  timeRange?: "24h" | "7d" | "30d" | "all"
}

/**
 * Performs deep search using OpenDeepSearch methodology
 * Combines multiple search providers with semantic reranking
 */
export async function deepSearch(query: string, options: DeepSearchOptions = {}): Promise<SearchResult[]> {
  const { mode = "default", maxResults = 10, timeRange = "24h" } = options

  console.log(`[OpenDeepSearch] Searching: "${query}" (${mode} mode, ${timeRange})`)

  // Try Serper first (Google Search API)
  if (API_KEYS.SERPER) {
    try {
      const results = await searchWithSerper(query, timeRange, maxResults)
      if (results.length > 0) {
        console.log(`[OpenDeepSearch] Found ${results.length} results via Serper`)
        return mode === "pro" ? await rerankResults(results, query) : results
      }
    } catch (error) {
      console.error("[OpenDeepSearch] Serper error:", error)
    }
  }

  // Fallback to Tavily
  if (API_KEYS.TAVILY) {
    try {
      const results = await searchWithTavily(query, timeRange, maxResults)
      console.log(`[OpenDeepSearch] Found ${results.length} results via Tavily`)
      return mode === "pro" ? await rerankResults(results, query) : results
    } catch (error) {
      console.error("[OpenDeepSearch] Tavily error:", error)
    }
  }

  console.warn("[OpenDeepSearch] No search providers available")
  return []
}

async function searchWithSerper(query: string, timeRange: string, maxResults: number): Promise<SearchResult[]> {
  const timeMap: Record<string, string> = {
    "24h": "qdr:d",
    "7d": "qdr:w",
    "30d": "qdr:m",
    all: "",
  }

  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": API_KEYS.SERPER,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: query,
      num: maxResults,
      gl: "us",
      hl: "en",
      tbs: timeMap[timeRange] || "",
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Serper API returned ${response.status}`)
  }

  const data = await response.json()
  const results: SearchResult[] = []

  // Process organic results
  if (data.organic) {
    for (const item of data.organic) {
      results.push({
        title: item.title || "",
        url: item.link || "",
        snippet: item.snippet || "",
        date: item.date,
        relevanceScore: 1.0,
      })
    }
  }

  // Process news results if available
  if (data.news) {
    for (const item of data.news) {
      results.push({
        title: item.title || "",
        url: item.link || "",
        snippet: item.snippet || "",
        date: item.date,
        relevanceScore: 1.0,
      })
    }
  }

  return results.slice(0, maxResults)
}

async function searchWithTavily(query: string, timeRange: string, maxResults: number): Promise<SearchResult[]> {
  const daysMap: Record<string, number> = {
    "24h": 1,
    "7d": 7,
    "30d": 30,
    all: 365,
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: API_KEYS.TAVILY,
      query,
      search_depth: "basic",
      max_results: maxResults,
      days: daysMap[timeRange] || 1,
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Tavily API returned ${response.status}`)
  }

  const data = await response.json()
  const results: SearchResult[] = []

  if (data.results) {
    for (const item of data.results) {
      results.push({
        title: item.title || "",
        url: item.url || "",
        snippet: item.content || "",
        relevanceScore: item.score || 1.0,
      })
    }
  }

  return results
}

/**
 * Rerank results using semantic similarity (Pro mode)
 * In a full implementation, this would use embeddings and reranking models
 * For now, we use keyword matching and source quality
 */
async function rerankResults(results: SearchResult[], query: string): Promise<SearchResult[]> {
  const queryTerms = query.toLowerCase().split(/\s+/)

  // Score each result based on relevance
  const scoredResults = results.map((result) => {
    let score = result.relevanceScore

    // Boost for query terms in title
    const titleLower = result.title.toLowerCase()
    for (const term of queryTerms) {
      if (titleLower.includes(term)) {
        score += 0.3
      }
    }

    // Boost for query terms in snippet
    const snippetLower = result.snippet.toLowerCase()
    for (const term of queryTerms) {
      if (snippetLower.includes(term)) {
        score += 0.1
      }
    }

    // Boost for high-quality sources
    const url = result.url.toLowerCase()
    if (url.includes("reddit.com/r/cryptocurrency") || url.includes("reddit.com/r/cryptomoonshots")) {
      score += 0.5
    }
    if (url.includes("twitter.com") || url.includes("x.com")) {
      score += 0.3
    }
    if (url.includes("medium.com") || url.includes("substack.com")) {
      score += 0.2
    }

    // Boost for recent content
    if (result.date) {
      const date = new Date(result.date)
      const hoursAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60)
      if (hoursAgo < 24) {
        score += 0.4
      } else if (hoursAgo < 168) {
        score += 0.2
      }
    }

    return { ...result, relevanceScore: score }
  })

  // Sort by score descending
  return scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
}

/**
 * Search for crypto token mentions across social platforms
 */
export async function searchTokenMentions(
  tokenSymbol: string,
  tokenName: string,
  timeRange: "24h" | "7d" = "24h",
): Promise<{
  twitter: SearchResult[]
  reddit: SearchResult[]
  news: SearchResult[]
  totalMentions: number
}> {
  console.log(`[OpenDeepSearch] Searching mentions for ${tokenSymbol} (${tokenName})`)

  const searchTerm = tokenSymbol.length < 10 ? tokenSymbol : tokenName.split(" ")[0]

  // Search Twitter/X
  const twitterQuery = `site:twitter.com OR site:x.com "$${searchTerm}" crypto`
  const twitterResults = await deepSearch(twitterQuery, { timeRange, maxResults: 20 })

  // Search Reddit
  const redditQuery = `site:reddit.com/r/CryptoMoonShots OR site:reddit.com/r/cryptocurrency "${searchTerm}" crypto`
  const redditResults = await deepSearch(redditQuery, { timeRange, maxResults: 20 })

  // Search crypto news
  const newsQuery = `"${searchTerm}" cryptocurrency token`
  const newsResults = await deepSearch(newsQuery, { timeRange, maxResults: 10 })

  const totalMentions = twitterResults.length + redditResults.length + newsResults.length

  console.log(
    `[OpenDeepSearch] Found ${twitterResults.length} Twitter, ${redditResults.length} Reddit, ${newsResults.length} news mentions`,
  )

  return {
    twitter: twitterResults,
    reddit: redditResults,
    news: newsResults,
    totalMentions,
  }
}

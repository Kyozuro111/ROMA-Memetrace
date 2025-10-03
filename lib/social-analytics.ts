import {
  fetchTwitterMetrics as fetchTwitterMetricsUtils,
  fetchRedditMetrics as fetchRedditMetricsUtils,
} from "./social-analytics-utils"
import type { RedditMetrics, SocialHypeData } from "./types"

const bearerToken = process.env.TWITTER_BEARER_TOKEN

export async function fetchTwitterMetrics(tokenSymbol: string, tokenAddress: string) {
  if (!bearerToken) {
    return {
      mentions: 0,
      recentTweets: 0,
      sentiment: "neutral",
      trendingScore: 0,
    }
  }

  try {
    const query = `${tokenSymbol} OR ${tokenAddress} -is:retweet lang:en`
    const url = `https://api.twitter.com/2/tweets/counts/recent?query=${encodeURIComponent(query)}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })

    if (!response.ok) {
      console.error("Twitter API error:", response.status, await response.text())
      return {
        mentions: 0,
        recentTweets: 0,
        sentiment: "neutral",
        trendingScore: 0,
      }
    }

    const data = await response.json()
    const totalCount = data.meta?.total_tweet_count || 0

    let trendingScore = 0
    if (totalCount > 1000) trendingScore = 90
    else if (totalCount > 500) trendingScore = 75
    else if (totalCount > 100) trendingScore = 50
    else if (totalCount > 50) trendingScore = 30
    else if (totalCount > 10) trendingScore = 15
    else trendingScore = 5

    const sentiment = totalCount > 100 ? "positive" : totalCount > 20 ? "neutral" : "negative"

    return {
      mentions: totalCount,
      recentTweets: totalCount,
      sentiment,
      trendingScore,
    }
  } catch (error) {
    console.error("Twitter fetch error:", error)
    return {
      mentions: 0,
      recentTweets: 0,
      sentiment: "neutral",
      trendingScore: 0,
    }
  }
}

export async function fetchRedditMetrics(tokenSymbol: string): Promise<RedditMetrics> {
  const serperKey = process.env.SERPER_API_KEY
  const tavilyKey = process.env.TAVILY_API_KEY

  if (serperKey) {
    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": serperKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: `site:reddit.com ${tokenSymbol} crypto`,
          num: 10,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const results = data.organic || []
        const postCount = results.length

        return {
          posts: postCount,
          comments: postCount * 15,
          sentiment: postCount > 5 ? "bullish" : postCount > 2 ? "neutral" : "bearish",
        }
      }
    } catch (error) {
      console.error("Serper error:", error)
    }
  }

  if (tavilyKey) {
    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: tavilyKey,
          query: `site:reddit.com ${tokenSymbol} crypto`,
          max_results: 10,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const results = data.results || []
        const postCount = results.length

        return {
          posts: postCount,
          comments: postCount * 15,
          sentiment: postCount > 5 ? "bullish" : postCount > 2 ? "neutral" : "bearish",
        }
      }
    } catch (error) {
      console.error("Tavily error:", error)
    }
  }

  return {
    posts: 0,
    comments: 0,
    sentiment: "neutral",
  }
}

export async function calculateSocialHype(tokenSymbol: string, tokenAddress: string): Promise<SocialHypeData> {
  const [twitter, reddit] = await Promise.all([
    fetchTwitterMetricsUtils(tokenSymbol, tokenAddress),
    fetchRedditMetricsUtils(tokenSymbol),
  ])

  const twitterWeight = 0.7
  const redditWeight = 0.3

  const twitterScore = Math.min(100, (twitter.mentions / 10) * twitterWeight * 100)
  const redditScore = Math.min(100, (reddit.posts / 5) * redditWeight * 100)

  const hypeScore = Math.round(twitterScore + redditScore)

  let velocity: "rising" | "stable" | "declining" = "stable"
  if (twitter.trendingScore > 60) velocity = "rising"
  else if (twitter.trendingScore < 20) velocity = "declining"

  const hasRealData = twitter.mentions > 0 || reddit.posts > 0

  return {
    twitter,
    reddit,
    hypeScore,
    velocity,
    quality: hasRealData ? "real" : "estimated",
  }
}

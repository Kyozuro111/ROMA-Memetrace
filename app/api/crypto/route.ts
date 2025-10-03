import { type NextRequest, NextResponse } from "next/server"
import * as cryptoApiServer from "@/lib/crypto-api-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, address, chain, tokenData, sentiment, tokenName } = body

    console.log(`[ROMA API] Received action: ${action}`)

    let result

    switch (action) {
      case "fetchTokenData":
        result = await cryptoApiServer.fetchTokenData(address, chain)
        break
      case "analyzeSentiment":
        result = await cryptoApiServer.analyzeSentiment(address, chain)
        break
      case "analyzeTechnical":
        result = await cryptoApiServer.analyzeTechnical(tokenData)
        break
      case "assessRisk":
        result = await cryptoApiServer.assessRisk(tokenData, chain)
        break
      case "fetchWhaleActivity":
        result = await cryptoApiServer.fetchWhaleActivity(address, chain)
        break
      case "analyzeSocialHype":
        result = await cryptoApiServer.analyzeSocialHype(address, tokenName || tokenData?.name || "Unknown Token")
        break
      case "checkLiquidityLock":
        result = await cryptoApiServer.checkLiquidityLock(address, chain)
        break
      case "scanContractSecurity":
        result = await cryptoApiServer.scanContractSecurity(address, chain)
        break
      case "calculateExitStrategy":
        result = await cryptoApiServer.calculateExitStrategy(tokenData)
        break
      case "findSimilarTokens":
        result = await cryptoApiServer.findSimilarTokens(tokenData)
        break
      case "predictPrice":
        result = await cryptoApiServer.predictPrice(tokenData, sentiment)
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("[ROMA API] Error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

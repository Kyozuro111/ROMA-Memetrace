import { type NextRequest, NextResponse } from "next/server"
import * as aiApiServer from "@/lib/ai-api-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, agent, context, userMessage, tokenContext, conversationHistory } = body

    console.log(`[ROMA AI API] Received action: ${action}`)

    let result

    switch (action) {
      case "generateAgentInsight":
        result = await aiApiServer.generateAgentInsight(agent, context)
        return NextResponse.json({ insight: result })
      case "chatWithDobby":
        result = await aiApiServer.chatWithDobby(userMessage, tokenContext, conversationHistory)
        return NextResponse.json({ response: result })
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("[ROMA AI API] Error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

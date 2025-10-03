import { type NextRequest, NextResponse } from "next/server"
import { calculateSocialHype } from "@/lib/social-analytics"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const symbol = searchParams.get("symbol")
    const address = searchParams.get("address")

    if (!symbol || !address) {
      return NextResponse.json({ error: "Missing symbol or address" }, { status: 400 })
    }

    const socialData = await calculateSocialHype(symbol, address)

    return NextResponse.json(socialData)
  } catch (error) {
    console.error("Social hype API error:", error)
    return NextResponse.json({ error: "Failed to fetch social data" }, { status: 500 })
  }
}

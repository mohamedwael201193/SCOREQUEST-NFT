import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServerClient()

  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .order("time_taken", { ascending: true })
      .limit(10)

    if (error) {
      console.error("Error fetching leaderboard:", error)
      return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()

  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { player_name, wallet_address, score, time_taken } = body

    // Validate required fields
    if (!player_name || typeof score !== "number" || typeof time_taken !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("leaderboard")
      .insert([
        {
          player_name,
          wallet_address: wallet_address || null,
          score,
          time_taken,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error inserting score:", error)
      return NextResponse.json({ error: "Failed to save score" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

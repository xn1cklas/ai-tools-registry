import { NextResponse } from "next/server"
import { loadDemos } from "@/lib/demos"

export async function GET() {
  try {
    const demos = await loadDemos()
    return NextResponse.json({
      weather: { json: demos.weather.json },
      news: { json: demos.news.json },
      websearch: { json: demos.websearch.json },
      markdown: { json: demos.markdown.json },
      // stats demo is client-fetched in component; expose null to keep shape consistent
      stats: { json: demos.stats?.json ?? null },
    })
  } catch (err) {
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}


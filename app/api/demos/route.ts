import { NextResponse } from "next/server"
import { loadDemos } from "@/lib/demos"

export async function GET() {
  try {
    const demos = await loadDemos()
    return NextResponse.json({
      weather: { json: demos.weather.json },
      news: { json: demos.news.json },
      // expose provider demo jsons for playground if needed later
      websearchBrave: { json: demos.websearch.variants?.[1]?.json ?? null },
      websearchDDG: { json: demos.websearch.variants?.[2]?.json ?? null },
      websearchExa: { json: demos.websearch.variants?.[3]?.json ?? null },
      websearchPerplexity: {
        json: demos.websearch.variants?.[4]?.json ?? null,
      },

      // stats demo is client-fetched in component; expose null to keep shape consistent
      stats: { json: demos.stats?.json ?? null },
    })
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}

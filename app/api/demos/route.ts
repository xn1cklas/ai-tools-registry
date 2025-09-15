import { NextResponse } from "next/server"
import { loadDemosFromRegistry, type DemoEntry } from "@/lib/demos-helpers"

export async function GET() {
  try {
    const demos = (await loadDemosFromRegistry()) as Record<
      string,
      DemoEntry
    > & {
      entries: string[]
    }

    const out: Record<
      string,
      {
        label: string
        json: unknown
        variants?: Record<string, { label: string; json: unknown }>
      }
    > = {}

    for (const name of demos.entries) {
      const base = demos[name]
      if (!base) continue
      const variants: Record<string, { label: string; json: unknown }> = {}
      for (const v of base.variants || []) {
        variants[v.key] = { label: v.label, json: v.json }
      }
      out[name] = {
        label: base.heading || name,
        json: base.json,
        variants: Object.keys(variants).length ? variants : undefined,
      }
    }

    return NextResponse.json({ tools: out })
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}

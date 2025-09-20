import { UIToolInvocation, tool } from "ai"
import { z } from "zod"

import { WebSearchSchema, WebSearchItem } from "./schema"

const FirecrawlSearchItemSchema = z
  .object({
    title: z.string().optional(),
    url: z.string().url().optional(),
    description: z.string().optional(),
    snippet: z.string().optional(),
    content: z.string().optional(),
  })
  .passthrough()

const FirecrawlSearchResponseSchema = z
  .object({
    results: z.array(FirecrawlSearchItemSchema).optional(),
    data: z.array(FirecrawlSearchItemSchema).optional(),
  })
  .passthrough()

export const webSearchFirecrawlTool = tool({
  name: "websearch-firecrawl",
  description:
    "Search the web using Firecrawl Search API. Requires FIRECRAWL_API_KEY. See https://www.firecrawl.dev/",
  inputSchema: z.object({
    query: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
  }),
  outputSchema: WebSearchSchema,
  execute: async ({ query, limit }) => {
    const apiKey = process.env.FIRECRAWL_API_KEY
    if (!apiKey) {
      throw new Error(
        "FIRECRAWL_API_KEY is required to use the Firecrawl websearch provider"
      )
    }

    const res = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, limit }),
    })

    if (!res.ok) throw new Error(`Firecrawl API failed: ${res.status}`)

    const data = FirecrawlSearchResponseSchema.parse(await res.json())

    const items = Array.isArray(data.results)
      ? data.results!
      : Array.isArray(data.data)
        ? data.data!
        : []

    const results: WebSearchItem[] = (items || [])
      .slice(0, limit)
      .map((r) => {
        const url = r.url || ""
        let source: string | undefined
        try {
          source = url ? new URL(url).hostname : undefined
        } catch {
          source = undefined
        }
        return {
          title: r.title || url || "Untitled",
          url,
          snippet: r.snippet || r.description || r.content || undefined,
          source: source || "Firecrawl",
        }
      })
      .filter((r) => !!r.url)

    return { query, results }
  },
})

export type WebSearchToolInvocation = UIToolInvocation<
  typeof webSearchFirecrawlTool
>

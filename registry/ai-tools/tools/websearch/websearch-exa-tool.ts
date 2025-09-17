import { UIToolInvocation, tool } from "ai"
import { z } from "zod"

import { WebSearchSchema, WebSearchItem } from "./schema"

const ExaSearchHitSchema = z
  .object({
    title: z.string().optional(),
    url: z.string().url().optional(),
    text: z.string().optional(),
    snippet: z.string().optional(),
  })
  .passthrough()

const ExaSearchResponseSchema = z
  .object({
    results: z.array(ExaSearchHitSchema).optional(),
  })
  .passthrough()

export const webSearchExaTool = tool({
  name: "websearch-exa",
  description:
    "Search the web using EXA Search API. Requires EXA_API_KEY. See https://docs.exa.ai/reference/getting-started",
  inputSchema: z.object({
    query: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
  }),
  outputSchema: WebSearchSchema,
  execute: async ({ query, limit }) => {
    const apiKey = process.env.EXA_API_KEY
    if (!apiKey) {
      throw new Error(
        "EXA_API_KEY is required to use the EXA websearch provider"
      )
    }

    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        numResults: limit,
      }),
    })

    if (!res.ok) throw new Error(`EXA API failed: ${res.status}`)
    const data = ExaSearchResponseSchema.parse(await res.json())

    const results: WebSearchItem[] = (data.results || [])
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
          snippet: r.snippet || r.text || undefined,
          source,
        }
      })
      .filter((r) => !!r.url)

    return { query, results }
  },
})

export type WebSearchToolInvocation = UIToolInvocation<typeof webSearchExaTool>

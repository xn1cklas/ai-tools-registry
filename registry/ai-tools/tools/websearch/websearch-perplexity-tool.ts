import { perplexity } from "@ai-sdk/perplexity"
import { tool, generateObject } from "ai"
import { z } from "zod"

import { WebSearchSchema, WebSearchResult } from "./schema"

export const webSearchPerplexityTool = tool({
  name: "websearch-perplexity",
  description:
    "Search the web using Perplexity Sonar via Vercel AI SDK. Requires Perplexity API key. See Vercel docs.",
  inputSchema: z.object({
    query: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
  }),
  outputSchema: WebSearchSchema,
  execute: async ({ query, limit }) => {
    // Use Sonar (or Sonar Pro) for search-grounded results

    const { object } = await generateObject({
      model: perplexity("sonar"),
      schema: WebSearchSchema,
      system:
        "You are a search assistant. Return strictly the JSON schema provided. For each result include title, url, a short snippet, and a source hostname.",
      prompt: `Search the web for: ${query}. Return up to ${limit} high-quality, diverse results with proper URLs.`,
    })

    // Ensure limit is respected in case the model over-returns
    const normalized: WebSearchResult = {
      query,
      results: (object.results || []).slice(0, limit).map((r) => {
        let source = r.source
        if (!source) {
          try {
            source = new URL(r.url).hostname
          } catch {
            source = undefined
          }
        }
        return { title: r.title, url: r.url, snippet: r.snippet, source }
      }),
    }
    return normalized
  },
})

export default webSearchPerplexityTool

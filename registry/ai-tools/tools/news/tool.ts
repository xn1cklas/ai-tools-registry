import { UIToolInvocation, tool } from "ai"
import { z } from "zod"

export const NewsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url().optional(),
  publishedAt: z.string().optional(),
})

export const NewsSearchSchema = z.object({
  topic: z.string(),
  items: z.array(NewsItemSchema),
})

// Tool first
export const newsSearchTool = tool({
  name: "news",
  description: "Return recent headlines related to a topic.",
  inputSchema: z.object({
    topic: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
  }),
  outputSchema: NewsSearchSchema,
  execute: async ({ topic, limit }) => {
    // Use Hacker News Algolia Search API (no API key required)
    const url = `https://hn.algolia.com/api/v1/search?${new URLSearchParams({
      query: topic,
      tags: "story",
      hitsPerPage: String(limit),
    }).toString()}`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`News API failed: ${res.status}`)
    const data = (await res.json()) as AlgoliaSearchResponse

    const items: NewsItem[] = (data.hits || []).map((h) => ({
      id: String(h.objectID),
      title: h.title || h.story_title || "(untitled)",
      url: h.url || h.story_url || undefined,
      publishedAt: h.created_at || undefined,
    }))

    return { topic, items }
  },
})

// Public result shapes for UI
export type NewsItem = z.infer<typeof NewsItemSchema>
export type NewsSearchResult = z.infer<typeof NewsSearchSchema>

// Response types from Algolia API
interface AlgoliaHit {
  objectID: string
  title?: string
  story_title?: string
  url?: string
  story_url?: string
  created_at?: string
}

interface AlgoliaSearchResponse {
  hits: AlgoliaHit[]
}

export type NewsToolType = UIToolInvocation<typeof newsSearchTool>

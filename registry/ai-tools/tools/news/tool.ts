import { tool } from "ai"
import { z } from "zod"

// Tool first
export const newsSearchTool = tool({
  description: "Return recent headlines related to a topic.",
  inputSchema: z.object({
    topic: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
  }),
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

export default newsSearchTool

// Public result shapes for UI
export interface NewsItem {
  id: string
  title: string
  url?: string
  publishedAt?: string
}

export interface NewsSearchResult {
  topic: string
  items: NewsItem[]
}

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

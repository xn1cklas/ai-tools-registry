import { z } from "zod"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Tool } from "ai"

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

export const newsSearchTool: Tool = {
  name: "newsSearch",
  description: "Return recent headlines related to a topic (demo/mock).",
  inputSchema: z.object({
    topic: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
  }),
  execute: async ({
    topic,
    limit,
  }: {
    topic: string
    limit: number
  }): Promise<NewsSearchResult> => {
    const items: NewsItem[] = Array.from({ length: limit }).map((_, i) => ({
      id: `${topic}-${i + 1}`,
      title: `${topic} headline ${i + 1}`,
      url: `https://example.com/${encodeURIComponent(topic)}/${i + 1}`,
      publishedAt: new Date(Date.now() - i * 3600_000).toISOString(),
    }))
    return { topic, items }
  },
}

export default newsSearchTool

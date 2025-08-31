import { z } from "zod"

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

export const newsSearchTool = {
  name: "newsSearch",
  description: "Return recent headlines related to a topic.",
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
    throw new Error(
      "newsSearch not implemented. Connect a news provider and return { topic, items: [{ id, title, url?, publishedAt? }] }."
    )
  },
}

export default newsSearchTool

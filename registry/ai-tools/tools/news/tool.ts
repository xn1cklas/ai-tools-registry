import { dynamicTool, tool } from "ai"
import { z } from "zod"

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

export const newsSearchTool = tool({
  description: "Return recent headlines related to a topic.",
  inputSchema: z.object({
    topic: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
  }),
  execute: async ({ topic, limit }) => {
    return {
      topic,
      items: [
        {
          id: "1",
          title: "News",
          url: "https://www.google.com",
          publishedAt: "2021-01-01",
        },
      ],
    }
  },
})

export default newsSearchTool

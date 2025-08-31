import { tool } from "ai"
import { z } from "zod"

export interface WebSearchItem {
  title: string
  url: string
  snippet?: string
  source?: string
}

export interface WebSearchResult {
  query: string
  results: WebSearchItem[]
}

export const webSearchTool = tool({
  description: "Search the web and return relevant results.",
  inputSchema: z.object({
    query: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
    lang: z.string().optional(),
    country: z.string().optional(),
  }),
  execute: async ({ query, limit }) => {
    return {
      query,
      results: [
        {
          title: `Search results for: ${query}`,
          url: "https://example.com/search",
          snippet: `Demo search results for "${query}". This is a placeholder implementation.`,
          source: "Demo Search Engine",
        },
        {
          title: `More results for: ${query}`,
          url: "https://example.com/more-results",
          snippet: `Additional demo results for "${query}".`,
          source: "Demo Search Engine",
        },
      ].slice(0, limit),
    }
  },
})

export default webSearchTool

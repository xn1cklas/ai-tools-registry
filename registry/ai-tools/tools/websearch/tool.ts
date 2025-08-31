import { z } from "zod"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Tool } from "ai"

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

export const webSearchTool: /* Tool */ any = {
  name: "webSearch",
  description: "Search the web and return relevant results.",
  inputSchema: z.object({
    query: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
    lang: z.string().optional(),
    country: z.string().optional(),
  }),
  execute: async ({ query, limit }: { query: string; limit: number }): Promise<WebSearchResult> => {
    throw new Error(
      "webSearch not implemented. Connect a web search provider (e.g. Tavily, Brave, Bing) and return { query, results: [{ title, url, snippet?, source? }] }."
    )
  },
}

export default webSearchTool


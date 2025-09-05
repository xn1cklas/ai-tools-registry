import { tool } from "ai"
import { z } from "zod"

export const WebSearchItemSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  snippet: z.string().optional(),
  source: z.string().optional(),
})

export const WebSearchSchema = z.object({
  query: z.string(),
  results: z.array(WebSearchItemSchema),
})

export type WebSearchItem = z.infer<typeof WebSearchItemSchema>
export type WebSearchResult = z.infer<typeof WebSearchSchema>

export const webSearchTool = tool({
  name: "websearch",
  description: "Search the web and return relevant results.",
  inputSchema: z.object({
    query: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
    lang: z.string().optional(),
    country: z.string().optional(),
  }),
  outputSchema: WebSearchSchema,
  execute: async ({ query, limit, lang, country }) => {
    const results: WebSearchItem[] = []
    return { query, results }
  },
})

export default webSearchTool

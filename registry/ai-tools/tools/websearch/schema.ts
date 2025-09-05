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

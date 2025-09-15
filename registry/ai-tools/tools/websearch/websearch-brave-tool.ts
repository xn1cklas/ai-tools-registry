import { UIToolInvocation, tool } from "ai"
import { z } from "zod"

import { WebSearchItem, WebSearchSchema } from "./schema"

export const webSearchBraveTool = tool({
  name: "websearch-brave",
  description:
    "Search the web using the Brave Search API. Requires BRAVE_SEARCH_API_KEY.",
  inputSchema: z.object({
    query: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
    lang: z.string().optional(),
    country: z.string().optional(),
  }),
  outputSchema: WebSearchSchema,
  execute: async ({ query, limit, lang, country }) => {
    const braveToken = process.env.BRAVE_SEARCH_API_KEY
    if (!braveToken) {
      throw new Error(
        "BRAVE_SEARCH_API_KEY is required to use the Brave websearch tool"
      )
    }

    const params = new URLSearchParams({
      q: query,
      count: String(limit),
    })
    if (country) params.set("country", country)
    if (lang) params.set("search_lang", lang)

    const url = `https://api.search.brave.com/res/v1/web/search?${params.toString()}`
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": braveToken,
      },
    })

    if (!res.ok) throw new Error(`Brave API failed: ${res.status}`)

    const data = BraveSearchSchema.parse(await res.json())

    const items = Array.isArray(data.web?.results)
      ? data.web!.results!
      : Array.isArray(data.results)
        ? data.results!
        : []

    const results: WebSearchItem[] = items
      .slice(0, limit)
      .map((r: BraveWebResult) => {
        const title = r.title || r.url || "Untitled"
        const url = r.url || ""
        let source: string | undefined
        try {
          source =
            r.profile?.long_name || (url ? new URL(url).hostname : undefined)
        } catch {
          source = r.profile?.long_name || undefined
        }
        return {
          title,
          url,
          snippet: r.description || undefined,
          source: source || "Brave",
        }
      })
      .filter((r: WebSearchItem) => !!r.url)

    return { query, results }
  },
})

export default webSearchBraveTool

export const BraveProfileSchema = z
  .object({
    name: z.string().optional(),
    url: z.string().url().optional(),
    long_name: z.string().optional(),
    img: z.string().url().optional(),
  })
  .passthrough()

export const BraveWebResultSchema = z
  .object({
    title: z.string().optional(),
    url: z.string().url().optional(),
    description: z.string().optional(),
    profile: BraveProfileSchema.optional(),
  })
  .passthrough()

export const BraveWebSchema = z
  .object({
    results: z.array(BraveWebResultSchema).optional(),
  })
  .passthrough()

export const BraveSearchSchema = z
  .object({
    type: z.string().optional(),
    web: BraveWebSchema.optional(),
    results: z.array(BraveWebResultSchema).optional(),
  })
  .passthrough()

export type BraveWebResult = z.infer<typeof BraveWebResultSchema>

export type WebSearchToolType = UIToolInvocation<typeof webSearchBraveTool>

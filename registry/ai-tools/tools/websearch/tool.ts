import { tool } from "ai"
import { z } from "zod"

// Tool first
export const webSearchTool = tool({
  description: "Search the web and return relevant results.",
  inputSchema: z.object({
    query: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
    lang: z.string().optional(),
    country: z.string().optional(),
  }),
  execute: async ({ query, limit, lang, country }) => {
    // Prefer Brave Search API if a token is provided, else fall back to DuckDuckGo IA API
    const braveToken = process.env.BRAVE_SEARCH_API_KEY

    if (braveToken) {
      try {
        const params = new URLSearchParams({
          q: query,
          count: String(limit),
        })
        // Pass through optional hints where possible (Brave will ignore unknown params)
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
          .map((r) => {
            const title = r.title || r.url || "Untitled"
            const url = r.url || ""
            let source: string | undefined
            try {
              source =
                r.profile?.long_name ||
                (url ? new URL(url).hostname : undefined)
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
          .filter((r) => !!r.url)

        if (results.length > 0) {
          return { query, results }
        }
        // If Brave returned no results, fall through to DDG
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message)
        }
        // Swallow and fall back to DDG
      }
    } else {
      console.info("Brave Search API key not found, falling back to DuckDuckGo")
    }

    // DuckDuckGo Instant Answer API (free, no key). Not full web search
    const url = `https://api.duckduckgo.com/?${new URLSearchParams({
      q: query,
      format: "json",
      no_redirect: "1",
      no_html: "1",
      t: "ai-tools-registry",
      kl: lang ? `${lang}-en` : "",
    }).toString()}`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`Search API failed: ${res.status}`)
    const data = DDGResponseSchema.parse(await res.json())

    const flatten = (
      items: DDGRelated[] = [],
      acc: DDGTopic[] = []
    ): DDGTopic[] => {
      for (const it of items) {
        if ("Topics" in it) flatten(it.Topics as DDGRelated[], acc)
        else acc.push(it)
      }
      return acc
    }

    const related = flatten(data.RelatedTopics)
    const results: WebSearchItem[] = related.slice(0, limit).map((r) => {
      let hostname: string | undefined
      try {
        hostname = new URL(r.FirstURL).hostname
      } catch {
        hostname = undefined
      }
      return {
        title: r.Text,
        url: r.FirstURL,
        snippet: undefined,
        source: hostname || "DuckDuckGo",
      }
    })

    return { query, results }
  },
})

export default webSearchTool

// Public result shapes for UI
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

// DuckDuckGo Instant Answer types
// DuckDuckGo Instant Answer types (runtime-validated)
export const DDGTopicSchema = z
  .object({
    FirstURL: z.string().url(),
    Text: z.string(),
  })
  .passthrough()

export type DDGTopic = z.infer<typeof DDGTopicSchema>

export const DDGRelatedGroupSchema = z
  .object({
    Name: z.string().optional(),
    Topics: z.array(DDGTopicSchema),
  })
  .passthrough()

export type DDGRelatedGroup = z.infer<typeof DDGRelatedGroupSchema>

export const DDGRelatedSchema = z.union([DDGTopicSchema, DDGRelatedGroupSchema])
export type DDGRelated = z.infer<typeof DDGRelatedSchema>

export const DDGResponseSchema = z
  .object({
    Results: z.array(DDGTopicSchema).optional(),
    RelatedTopics: z.array(DDGRelatedSchema).optional(),
  })
  .passthrough()

export type DDGResponse = z.infer<typeof DDGResponseSchema>

// Brave Search Web API types (minimal, aligned to used fields)
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

export type BraveProfile = z.infer<typeof BraveProfileSchema>
export type BraveWebResult = z.infer<typeof BraveWebResultSchema>
export type BraveWeb = z.infer<typeof BraveWebSchema>
export type BraveSearchResponse = z.infer<typeof BraveSearchSchema>

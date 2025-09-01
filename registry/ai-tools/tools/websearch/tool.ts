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
  execute: async ({ query, limit, lang }) => {
    // Use DuckDuckGo Instant Answer API (free, no key). This is not full web search
    // but provides related topics with titles and URLs.
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
    const data = (await res.json()) as DDGResponse

    const flatten = (items: DDGRelated[] = [], acc: DDGTopic[] = []): DDGTopic[] => {
      for (const it of items) {
        // If group
        if ((it as DDGRelatedGroup).Topics) flatten((it as DDGRelatedGroup).Topics, acc)
        else if ((it as DDGTopic).FirstURL && (it as DDGTopic).Text) acc.push(it as DDGTopic)
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
interface DDGTopic {
  FirstURL: string
  Text: string
}

interface DDGRelatedGroup {
  Name?: string
  Topics: DDGTopic[]
}

type DDGRelated = DDGTopic | DDGRelatedGroup

interface DDGResponse {
  Results?: DDGTopic[]
  RelatedTopics?: DDGRelated[]
}

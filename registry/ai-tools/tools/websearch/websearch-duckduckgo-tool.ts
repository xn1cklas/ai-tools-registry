import { UIToolInvocation, tool } from "ai"
import { z } from "zod"

import { WebSearchSchema, WebSearchItem } from "./schema"

export const webSearchDDGTool = tool({
  name: "websearch-ddg",
  description:
    "Search the web using DuckDuckGo Instant Answer (no key required).",
  inputSchema: z.object({
    query: z.string().min(1),
    limit: z.number().min(1).max(20).default(5),
    lang: z.string().optional(),
  }),
  outputSchema: WebSearchSchema,
  execute: async ({ query, limit, lang }) => {
    const url = `https://api.duckduckgo.com/?${new URLSearchParams({
      q: query,
      format: "json",
      no_redirect: "1",
      no_html: "1",
      t: "ai-tools-registry",
      kl: lang ? `${lang}-en` : "",
    }).toString()}`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`DuckDuckGo API failed: ${res.status}`)
    const data = DDGResponseSchema.parse(await res.json())

    const flatten = (
      items: DDGRelated[] = [],
      acc: DDGTopic[] = []
    ): DDGTopic[] => {
      for (const it of items) {
        if ((it as any).Topics) acc = flatten((it as any).Topics, acc)
        else if ((it as any).FirstURL && (it as any).Text) acc.push(it as any)
      }
      return acc
    }

    const related = flatten(data.RelatedTopics)
    const results: WebSearchItem[] = (related || [])
      .slice(0, limit)
      .map((r) => {
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

export type WebSearchToolInvocation = UIToolInvocation<typeof webSearchDDGTool>

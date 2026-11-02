import { tool } from "ai"
import { ArcmiraClient } from "arcmira"
import { z } from "zod"

// Preserve coverage notes, source metadata and any limits applied by the API.
const searchResult = z.looseObject({
  query: z.string(),
  window: z.looseObject({
    after: z.string().nullable(),
    before: z.string().nullable(),
  }),
  chunks: z
    .array(
      z.looseObject({
        video_id: z.string(),
        text: z.string(),
        start_seconds: z.number().nullable(),
        watch_url: z.string(),
      })
    )
    .max(5),
  note: z.string(),
})

export const arcmiraTranscriptSearch = tool({
  description:
    "Search indexed YouTube transcripts for one topic or phrase. Return up to five timestamped passages with source links and the applied coverage window.",
  inputSchema: z.object({
    q: z.string().trim().min(2).describe("A spoken phrase or topic"),
    after: z.iso.date().optional().describe("Inclusive publication date"),
    before: z.iso.date().optional().describe("Exclusive publication date"),
  }),
  execute: async (input, { abortSignal }) => {
    const apiKey = process.env.ARCMIRA_API_KEY
    if (!apiKey) {
      throw new Error(
        "Set ARCMIRA_API_KEY on the server. See https://arcmira.com/docs/authentication"
      )
    }
    const client = new ArcmiraClient({ apiKey, maxRetries: 0 })
    const result = await client.transcripts.search(
      { ...input, limit: 5 },
      { abortSignal }
    )
    return searchResult.parse(result)
  },
})

import { tool } from "ai"
import { z } from "zod"

export const translateTool = tool({
  description: "Translate a given text into a target language.",
  inputSchema: z.object({
    text: z.string().min(1),
    targetLanguage: z
      .string()
      .default("en")
      .describe("Target language code e.g. es, fr, de"),
    sourceLanguage: z
      .string()
      .default("en")
      .describe("Source language code e.g. en, fr, de"),
  }),
  execute: async ({ text, targetLanguage, sourceLanguage }) => {
    // Use MyMemory Translation API (free, no key). Requires explicit langpair.
    const url = `https://api.mymemory.translated.net/get?${new URLSearchParams({
      q: text,
      langpair: `${sourceLanguage}|${targetLanguage}`,
    }).toString()}`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`Translate API failed: ${res.status}`)
    const data = (await res.json()) as MyMemoryResponse
    const translated = data?.responseData?.translatedText || text
    return { text, targetLanguage, translated }
  },
})

export interface TranslateResult {
  text: string
  targetLanguage: string
  translated: string
}

// MyMemory response type
interface MyMemoryResponse {
  responseData: { translatedText: string; match?: number }
  responseStatus: number
  matches?: unknown[]
}

export default translateTool

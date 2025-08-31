import { tool } from "ai"
import { z } from "zod"

export interface TimeNowResult {
  timeZone: string
  iso: string
  formatted: string
}

export const timeNowTool = tool({
  description: "Get the current time for a given IANA timezone.",
  inputSchema: z.object({
    timeZone: z.string().default("UTC"),
    locale: z.string().default("en-US"),
  }),
  execute: async ({ timeZone, locale }) => {
    const now = new Date()
    return {
      timeZone,
      iso: now.toISOString(),
      formatted: now.toLocaleString(locale, { timeZone }),
    }
  },
})

export default timeNowTool

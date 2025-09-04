import { tool } from "ai"
import { z } from "zod"

export const TimeNowSchema = z.object({
  timeZone: z.string(),
  iso: z.string(),
  formatted: z.string(),
})

export type TimeNowResult = z.infer<typeof TimeNowSchema>

export const timeNowTool = tool({
  name: "time",
  description: "Get the current time for a given IANA timezone.",
  inputSchema: z.object({
    timeZone: z.string().default("UTC"),
    locale: z.string().default("en-US"),
  }),
  outputSchema: TimeNowSchema,
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

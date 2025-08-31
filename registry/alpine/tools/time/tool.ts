import { z } from "zod"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Tool } from "ai"

export interface TimeNowResult {
  timeZone: string
  iso: string
  formatted: string
}

export const timeNowTool: Tool = {
  name: "timeNow",
  description: "Get the current time for a given IANA timezone.",
  inputSchema: z.object({
    timeZone: z.string().default("UTC"),
    locale: z.string().default("en-US"),
  }),
  execute: async ({
    timeZone,
    locale,
  }: {
    timeZone: string
    locale: string
  }): Promise<TimeNowResult> => {
    const date = new Date()
    const formatted = new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date)
    return { timeZone, iso: date.toISOString(), formatted }
  },
}

export default timeNowTool

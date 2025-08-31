import { z } from "zod"

import type { Tool } from "ai"

export interface TimeNowResult {
  timeZone: string
  iso: string
  formatted: string
}

export const timeNowTool = {
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
    throw new Error(
      "timeNow not implemented. Use Intl.DateTimeFormat or a time API and return { timeZone, iso, formatted }."
    )
  },
}

export default timeNowTool

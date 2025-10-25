import { z } from "zod"

export const CurrencyConverterInputSchema = z.object({
  amount: z.number().positive().describe("Amount to convert"),
  from: z
    .string()
    .length(3)
    .regex(/^[A-Z]{3}$/)
    .describe(
      "Source currency code using the ISO 4217 three-letter format (e.g., 'USD' for US Dollar, 'EUR' for Euro)."
    ),
  to: z
    .string()
    .length(3)
    .regex(/^[A-Z]{3}$/)
    .describe(
      "Target currency code using the ISO 4217 three-letter format (e.g., 'GBP' for British Pound, 'JPY' for Japanese Yen)."
    ),
})
export type CurrencyConverterInputSchemaType = z.infer<
  typeof CurrencyConverterInputSchema
>

export const CurrencyConverterOutputSchema =
  CurrencyConverterInputSchema.extend({
    rate: z.number().describe("Conversion rate"),
    converted: z.number().describe("Converted amount"),
    lastUpdated: z.string().describe("Last updated date"),
  })
export type CurrencyConverterOutputSchemaType = z.infer<
  typeof CurrencyConverterOutputSchema
>

export interface ExchangeRateResponse {
  result: string
  provider: string
  documentation: string
  terms_of_use: string
  time_last_update_unix: number
  time_last_update_utc: string
  time_next_update_unix: number
  time_next_update_utc: string
  time_eol_unix: number
  base_code: string
  rates: Record<string, number>
}

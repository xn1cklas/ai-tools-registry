import { z } from "zod"

export const CurrencyConverterInputSchema = z.object({
  amount: z.number().positive().describe("Amount to convert"),
  from: z.string().describe("Source currency code (e.g., USD, EUR, BTC)"),
  to: z.string().describe("Target currency code (e.g., EUR, JPY, ETH)"),
  date: z
    .string()
    .optional()
    .describe("Optional date for historical rates (YYYY-MM-DD format)"),
})
export type CurrencyConverterInputSchemaType = z.infer<
  typeof CurrencyConverterInputSchema
>

export const CurrencyConverterOutputSchema =
  CurrencyConverterInputSchema.extend({
    // Make date required
    date: z.string().describe("Date for historical rates (YYYY-MM-DD format)"),
    rate: z.number().describe("Conversion rate"),
    converted: z.number().describe("Converted amount"),
    lastUpdated: z.string().describe("Last updated date"),
  })
export type CurrencyConverterOutputSchemaType = z.infer<
  typeof CurrencyConverterOutputSchema
>

import { tool } from "ai"
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
    rate: z.number().describe("Conversion rate"),
    converted: z.number().describe("Converted amount"),
    lastUpdated: z.string().describe("Last updated date"),
  })
export type CurrencyConverterOutputSchemaType = z.infer<
  typeof CurrencyConverterOutputSchema
>

export const currencyConverterTool = tool({
  description:
    "Convert currencies with real-time rates, including crypto currencies.",
  inputSchema: CurrencyConverterInputSchema,
  outputSchema: CurrencyConverterOutputSchema,
  execute: async ({
    amount,
    from,
    to,
    date,
  }): Promise<CurrencyConverterOutputSchemaType> => {
    // Use exchangerate-api.com (free tier, no API key required)
    const baseUrl = "https://api.exchangerate-api.com/v4/latest"
    const url = date ? `https://api.exchangerate-api.com/v4/${date}` : baseUrl

    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Currency API failed: ${res.status}`)
    }

    const data = (await res.json()) as ExchangeRateResponse

    // Get the conversion rate
    const fromRate = data.rates[from.toUpperCase()]
    const toRate = data.rates[to.toUpperCase()]

    if (!fromRate || !toRate) {
      throw new Error(`Currency not supported: ${from} or ${to}`)
    }

    // Calculate conversion (convert to base currency first, then to target)
    const baseAmount = amount / fromRate
    const convertedAmount = baseAmount * toRate

    return {
      amount,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      rate: toRate / fromRate,
      converted: convertedAmount,
      date: data.date,
      lastUpdated: data.date,
    }
  },
})

interface ExchangeRateResponse {
  base: string
  date: string
  rates: Record<string, number>
}

export default currencyConverterTool

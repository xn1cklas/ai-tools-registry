import { tool, UIToolInvocation } from "ai"
import {
  CurrencyConverterInputSchema,
  CurrencyConverterOutputSchema,
  type ExchangeRateResponse,
} from "./schema"

export const currencyConverterTool = tool({
  name: "currency",
  description:
    "Convert currencies with real-time rates using the Open Exchange Rates API.",
  inputSchema: CurrencyConverterInputSchema,
  outputSchema: CurrencyConverterOutputSchema,
  execute: async ({ amount, from, to }) => {
    // Read more about the Open Exchange Rates API at:
    // https://www.exchangerate-api.com/docs/free
    const url = "https://open.er-api.com/v6/latest/USD"

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
      lastUpdated: data.time_last_update_utc,
    }
  },
})

export default currencyConverterTool

export type CurrencyConverterToolType = UIToolInvocation<
  typeof currencyConverterTool
>

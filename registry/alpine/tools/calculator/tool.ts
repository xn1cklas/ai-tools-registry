import { z } from "zod"

import type { Tool } from "ai"

export interface CalculatorResult {
  a: number
  b: number
  operator: "+" | "-" | "*" | "/"
  result: number
}

export const calculatorTool = {
  name: "calculator",
  description: "Simple calculator for basic arithmetic.",
  inputSchema: z.object({
    a: z.number(),
    b: z.number(),
    operator: z.enum(["+", "-", "*", "/"]).default("+"),
  }),
  execute: async ({
    a,
    b,
    operator,
  }: {
    a: number
    b: number
    operator: "+" | "-" | "*" | "/"
  }): Promise<CalculatorResult> => {
    throw new Error(
      "calculator not implemented. Provide your own implementation to return { a, b, operator, result }."
    )
  },
}

export default calculatorTool

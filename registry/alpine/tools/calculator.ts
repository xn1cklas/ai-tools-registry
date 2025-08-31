import { z } from "zod"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type {} from "ai"

export interface CalculatorResult {
  a: number
  b: number
  operator: "+" | "-" | "*" | "/"
  result: number
}

export const calculatorTool = {
  name: "calculator",
  description: "Simple calculator for basic arithmetic.",
  parameters: z.object({
    a: z.number(),
    b: z.number(),
    operator: z.enum(["+", "-", "*", "/"]).default("+"),
  }),
  execute: async ({ a, b, operator }: { a: number; b: number; operator: "+" | "-" | "*" | "/" }): Promise<CalculatorResult> => {
    let result = 0
    switch (operator) {
      case "+":
        result = a + b
        break
      case "-":
        result = a - b
        break
      case "*":
        result = a * b
        break
      case "/":
        result = b === 0 ? NaN : a / b
        break
    }
    return { a, b, operator, result }
  },
}

export default calculatorTool


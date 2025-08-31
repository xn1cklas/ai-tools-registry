import { tool } from "ai"
import { z } from "zod"

export const calculatorTool = tool({
  description: "Simple calculator for basic arithmetic.",
  inputSchema: z.object({
    a: z.number(),
    b: z.number(),
    operator: z.enum(["+", "-", "*", "/"]).default("+"),
  }),
  execute: async ({ a, b, operator }) => {
    let result: number
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
        result = a / b
        break
      default:
        result = a + b
    }
    return { a, b, operator, result }
  },
})

export interface CalculatorResult {
  a: number
  b: number
  operator: "+" | "-" | "*" | "/"
  result: number
}

export default calculatorTool

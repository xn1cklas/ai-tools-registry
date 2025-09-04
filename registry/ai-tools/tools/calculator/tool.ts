import { tool } from "ai"
import { z } from "zod"

export const CalculatorSchema = z.object({
  a: z.number(),
  b: z.number(),
  operator: z.enum(["+", "-", "*", "/"]),
  result: z.number(),
})

export type CalculatorResult = z.infer<typeof CalculatorSchema>

export const calculatorTool = tool({
  name: "calculator",
  description: "Simple calculator for basic arithmetic.",
  inputSchema: z.object({
    a: z.number(),
    b: z.number(),
    operator: z.enum(["+", "-", "*", "/"]).default("+"),
  }),
  outputSchema: CalculatorSchema,
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
export default calculatorTool

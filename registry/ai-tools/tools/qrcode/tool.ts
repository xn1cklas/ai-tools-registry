import { UIToolInvocation, tool } from "ai"
import { z } from "zod"
import QRCode from "qrcode"

export const QRCodeSchema = z.object({
  data: z.string(),
  size: z.number(),
  output: z.string(),
})

export type QRCodeResult = z.infer<typeof QRCodeSchema>

export const qrCodeTool = tool({
  name: "qrcode",
  description: "Generate QR codes for text, URLs, or other data.",
  inputSchema: z.object({
    data: z
      .string()
      .min(1)
      .describe("The text or URL to encode in the QR code"),
    size: z
      .number()
      .min(100)
      .max(500)
      .default(300)
      .describe("Size of the QR code in pixels"),
  }),
  outputSchema: QRCodeSchema,
  execute: async ({ data, size }) => {
    const output = await QRCode.toDataURL(data, {
      width: size,
      margin: 4,
    })

    const result: QRCodeResult = {
      data,
      size,
      output,
    }

    return result
  },
})

export type QRCodeToolType = UIToolInvocation<typeof qrCodeTool>

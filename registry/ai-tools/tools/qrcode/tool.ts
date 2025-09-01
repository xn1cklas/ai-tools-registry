import { tool } from "ai"
import { z } from "zod"
import QRCode from "qrcode"

export const qrCodeTool = tool({
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

export interface QRCodeResult {
  data: string
  size: number
  output: string
}

export default qrCodeTool

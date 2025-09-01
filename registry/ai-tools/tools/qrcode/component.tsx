"use client"

import * as React from "react"
import type { QRCodeResult } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import { Button } from "@/registry/ai-tools/ui/button"

export function QRCodeDisplay({ data }: { data: QRCodeResult }) {
  const [downloading, setDownloading] = React.useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Convert data URL to blob
      const response = await fetch(data.output)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "qrcode.png"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download QR code:", error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>QR Code</CardTitle>
        <CardDescription>
          {data.data.length > 50 ? `${data.data.slice(0, 50)}...` : data.data}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="rounded-lg bg-white p-4">
          <img
            src={data.output}
            alt="QR Code"
            width={data.size}
            height={data.size}
            className="max-w-full h-auto"
            style={{ maxWidth: "300px" }}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Size: {data.size}px
        </div>
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full"
        >
          {downloading ? "Downloading..." : "Download PNG"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default QRCodeDisplay

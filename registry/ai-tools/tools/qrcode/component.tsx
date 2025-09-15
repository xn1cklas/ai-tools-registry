"use client"

import * as React from "react"
import type { QRCodeToolType } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import { Button } from "@/registry/ai-tools/ui/button"
import { CheckIcon, DownloadIcon } from "lucide-react"

export function QRCodeDisplay(part: QRCodeToolType) {
  if (part.output === undefined) return <div>Invalid tool type</div>
  const data = part.output
  const [downloading, setDownloading] = React.useState(false)
  const [downloaded, setDownloaded] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)
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
      setDownloaded(true)
      // Brief success state similar to copy buttons
      setTimeout(() => setDownloaded(false), 1200)
    } catch (error) {
      console.error("Failed to download QR code:", error)
      setError("Failed to download. Please try again.")
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
        <div
          className="w-full rounded-lg bg-white p-4"
          style={{ maxWidth: `${data.size}px` }}
        >
          <img
            src={data.output}
            alt={`QR code encoding ${
              data.data.length > 50
                ? `'${data.data.slice(0, 50)}...'`
                : `'${data.data}'`
            }`}
            width={data.size}
            height={data.size}
            loading="lazy"
            decoding="async"
            className="h-auto w-full"
          />
        </div>
        <div className="text-sm text-muted-foreground">Size: {data.size}px</div>
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full"
          aria-busy={downloading}
          aria-live="polite"
          aria-label={
            downloaded
              ? "QR code saved"
              : downloading
                ? "Downloading QR code"
                : "Download QR code as PNG"
          }
        >
          {downloaded ? (
            <>
              <CheckIcon className="mr-1.5" />
              Saved
            </>
          ) : (
            <>
              <DownloadIcon className="mr-1.5" />
              {downloading ? "Downloading..." : "Download PNG"}
            </>
          )}
        </Button>
        {error ? (
          <div
            role="status"
            aria-live="assertive"
            className="w-full text-sm text-red-600"
          >
            {error}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default QRCodeDisplay

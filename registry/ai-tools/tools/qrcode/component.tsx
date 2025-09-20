"use client"

import * as React from "react"
import type { QRCodeToolType } from "./tool"
import { Button } from "@/registry/ai-tools/ui/button"
import { CheckIcon, DownloadIcon } from "lucide-react"
import { Loader } from "@/registry/ai-elements/loader"
import { CodeBlock } from "@/registry/ai-elements/code-block"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/registry/ai-tools/ui/card"
import { Skeleton } from "@/registry/ai-tools/ui/skeleton"

export function QRCodeDisplay({ invocation }: { invocation: QRCodeToolType }) {
  const part = invocation
  const cardBaseClass =
    "not-prose flex w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background/95 py-0 text-foreground shadow-sm"
  const headerBaseClass =
    "flex flex-col gap-2 border-b border-border/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
  const contentBaseClass = "px-6 py-5"
  const renderHeader = (
    title: React.ReactNode,
    description?: React.ReactNode,
    actions?: React.ReactNode
  ) => {
    const descriptionNode =
      typeof description === "string" ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : (
        (description ?? null)
      )

    return (
      <CardHeader className={headerBaseClass}>
        {(title || descriptionNode) && (
          <div className="space-y-1">
            {title ? (
              <h3 className="text-sm font-semibold leading-none tracking-tight text-foreground">
                {title}
              </h3>
            ) : null}
            {descriptionNode}
          </div>
        )}
        {actions ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {actions}
          </div>
        ) : null}
      </CardHeader>
    )
  }
  if (part.state === "input-streaming") {
    return (
      <Card className={cn(cardBaseClass, "max-w-sm animate-in fade-in-50")}>
        {renderHeader("QR Code", "Waiting for data…")}
        <CardContent
          className={cn(
            contentBaseClass,
            "space-y-4 text-sm text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Loader /> Preparing request
          </div>
          <div className="space-y-3">
            <Skeleton className="mx-auto h-[280px] w-full max-w-[280px] rounded-2xl" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className={cn(cardBaseClass, "max-w-sm animate-in fade-in-50")}>
        {renderHeader("QR Code", "Generating…")}
        <CardContent className={cn(contentBaseClass, "space-y-4")}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader /> Running tool
          </div>
          <div className="space-y-3">
            <Skeleton className="mx-auto h-[280px] w-full max-w-[280px] rounded-2xl" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.state === "output-error") {
    return (
      <Card className={cn(cardBaseClass, "max-w-sm animate-in fade-in-50")}>
        {renderHeader("QR Code", "Error")}
        <CardContent className={contentBaseClass}>
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {part.errorText ||
              "An error occurred while generating the QR code."}
          </div>
        </CardContent>
      </Card>
    )
  }
  if (part.output === undefined) return null
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
    <Card className={cn(cardBaseClass, "max-w-sm animate-in fade-in-50")}>
      {renderHeader(
        "QR Code",
        data.data.length > 50 ? `${data.data.slice(0, 50)}…` : data.data
      )}
      <CardContent
        className={cn(
          contentBaseClass,
          "flex flex-col items-center gap-4 pb-6"
        )}
      >
        <div
          className="relative w-full max-w-[280px] overflow-hidden rounded-2xl border border-border/40 bg-background/80 p-4 shadow-inner"
          style={{ maxWidth: `${data.size}px` }}
        >
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-muted/40 to-transparent"
            aria-hidden
          />
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
            className="relative z-10 h-auto w-full"
          />
        </div>
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
            className="w-full text-sm text-destructive"
          >
            {error}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default QRCodeDisplay

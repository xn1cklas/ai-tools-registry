"use client"

import * as React from "react"
import { Separator } from "@/registry/alpine/ui/separator"
import { Button } from "@/registry/alpine/ui/button"
import { AddCommand } from "@/components/add-command"
import { OpenInV0 } from "@/components/open-in-v0"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { CodeBlock } from "@/components/code-block"
import { CopyIcon } from "lucide-react"
import { registryItemSchema } from "shadcn/schema"
import { z } from "zod"

export function ToolDemoCard({
  registryItem,
  json,
  code,
  renderer,
  heading,
  subheading,
}: {
  registryItem: z.infer<typeof registryItemSchema>
  json: unknown
  code: string
  renderer?: React.ReactNode
  heading: string
  subheading?: string
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const hasRenderer = Boolean(renderer)
  const [view, setView] = React.useState<"output" | "component">(hasRenderer ? "component" : "output")

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 bg-muted/30">
      <header className="md:col-span-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{heading}</div>
          <Separator orientation="vertical" className="!h-4 hidden md:flex" />
          {subheading ? (
            <div className="text-sm text-muted-foreground hidden md:flex">{subheading}</div>
          ) : null}
        </div>
        <div className="flex gap-2">
          <AddCommand registryItem={registryItem} />
          <OpenInV0 name={registryItem.name} />
        </div>
      </header>

      {/* Left: Always show code with copy */}
      <div className="relative rounded-md bg-background p-4 border">
        <div className="text-xs text-muted-foreground mb-2">Usage (code)</div>
        <Button
          size="icon"
          variant="outline"
          className="absolute top-3 right-3 size-8 rounded-sm"
          onClick={() => copyToClipboard(code)}
          aria-label="Copy code"
          title="Copy code"
        >
          <CopyIcon className="h-4 w-4" />
        </Button>
        <CodeBlock code={code} />
        {isCopied && (
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">Copied</div>
        )}
      </div>

      {/* Right: Toggle between component and output (if renderer available) */}
      <div className="relative rounded-md bg-background p-4 border flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">{view === "component" ? "Component" : "Output (JSON)"}</div>
          {hasRenderer ? (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={view === "component" ? "default" : "outline"}
                className="rounded-sm"
                onClick={() => setView("component")}
              >
                Component
              </Button>
              <Button
                size="sm"
                variant={view === "output" ? "default" : "outline"}
                className="rounded-sm"
                onClick={() => setView("output")}
              >
                Output
              </Button>
            </div>
          ) : null}
        </div>

        {view === "component" && hasRenderer ? (
          <div className="min-h-[200px] flex items-center justify-center">
            {renderer}
          </div>
        ) : (
          <div className="relative">
            <Button
              size="icon"
              variant="outline"
              className="absolute top-0 right-0 size-8 rounded-sm"
              onClick={() => copyToClipboard(JSON.stringify(json, null, 2))}
              aria-label="Copy JSON"
              title="Copy JSON"
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
            <pre className="text-xs overflow-auto">
{JSON.stringify(json, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default ToolDemoCard

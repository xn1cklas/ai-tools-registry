"use client"

import * as React from "react"
import { Separator } from "@/registry/alpine/ui/separator"
import { Button } from "@/registry/alpine/ui/button"
import { AddCommand } from "@/components/add-command"
import { OpenInV0 } from "@/components/open-in-v0"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { CodeBlock } from "@/components/code-block"
import { ScrollArea } from "@/registry/alpine/ui/scroll-area"
import { CheckIcon, CopyIcon } from "lucide-react"
import { toast } from "sonner"
import { registryItemSchema } from "shadcn/schema"
import { z } from "zod"
import { cn } from "@/lib/utils"

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
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-muted-foreground mb-2 ">Usage (code)</div>
          <Button
            size="icon"
            variant="outline"
            className=" size-8 rounded-sm"
            onClick={() => {
              copyToClipboard(code)
              toast.success("Code copied to clipboard")
            }}
            aria-label="Copy code"
            title="Copy code"
          >
            {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="max-h-96">
          <CodeBlock code={code} />
        </ScrollArea>
      </div>

      {/* Right: Toggle between component and output (if renderer available) */}
      <div className="relative rounded-md bg-background p-4 border flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button className={cn("text-xs text-muted-foreground mb-2 pointer-events-auto", view === "component" ? "opacity-100" : "opacity-70")} onClick={() => setView("component")}>Component</button>
            {hasRenderer ? <button className={cn("text-xs text-muted-foreground mb-2 pointer-events-auto", view === "output" ? "opacity-100" : "opacity-70")} onClick={() => setView("output")}>output (JSON)</button> : null}
          </div>
          <Button
            size="icon"
            variant="outline"
            className=" size-8 rounded-sm"
            onClick={() => {
              copyToClipboard(code)
              toast.success("Code copied to clipboard")
            }}
            aria-label="Copy code"
            title="Copy code"
          >
            {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          </Button>
        </div>

        {view === "component" && hasRenderer ? (
          <div className="min-h-[200px] flex items-center justify-center">
            {renderer}
          </div>
        ) : (
          <div className="relative">
            <ScrollArea className="max-h-80">
              <pre className="text-xs">
                {JSON.stringify(json, null, 2)}
              </pre>
            </ScrollArea>
          </div>
        )}
      </div>
    </div >
  )
}

export default ToolDemoCard

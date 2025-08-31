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
import { cn } from "@/lib/utils"

export function ToolDemoCard({
  registryItem,
  json,
  code,
  componentCode,
  renderer,
  heading,
  subheading,
}: {
  registryItem: { name: string }
  json: unknown
  code: string
  componentCode?: string
  renderer?: React.ReactNode
  heading: string
  subheading?: string
}) {
  const { isCopied: isToolCopied, copyToClipboard: copyTool } = useCopyToClipboard()
  const { isCopied: isRightCopied, copyToClipboard: copyRight } = useCopyToClipboard()
  const hasRenderer = Boolean(renderer)
  const hasComponentCode = Boolean(componentCode)
  const [view, setView] = React.useState<"output" | "component" | "code">(
    hasRenderer ? "component" : "output"
  )

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
          <AddCommand name={registryItem.name} />
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
              copyTool(code)
              toast.success("Code copied to clipboard")
            }}
            aria-label="Copy code"
            title="Copy code"
          >
            {isToolCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="max-h-96">
          <CodeBlock code={code} className="leading-3" />
        </ScrollArea>
      </div>

      {/* Right: Toggle between component and output (if renderer available) */}
      <div className="relative rounded-md bg-background p-4 border flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              className={cn("text-xs text-muted-foreground mb-2 pointer-events-auto", view === "component" ? "opacity-100" : "opacity-70")}
              onClick={() => setView("component")}
            >
              Component
            </button>
            <button
              className={cn("text-xs text-muted-foreground mb-2 pointer-events-auto", view === "output" ? "opacity-100" : "opacity-70")}
              onClick={() => setView("output")}
            >
              Output (JSON)
            </button>
            <button
              className={cn(
                "text-xs text-muted-foreground mb-2 pointer-events-auto",
                view === "code" ? "opacity-100" : "opacity-70",
                hasComponentCode ? "" : "opacity-40 cursor-not-allowed"
              )}
              onClick={() => hasComponentCode && setView("code")}
              disabled={!hasComponentCode}
            >
              Code (component)
            </button>
          </div>
          <Button
            size="icon"
            variant="outline"
            className=" size-8 rounded-sm"
            onClick={() => {
              if (componentCode) {
                copyRight(componentCode)
                toast.success("Component code copied")
              } else {
                toast.error("No component code available")
              }
            }}
            aria-label="Copy component code"
            title={hasComponentCode ? "Copy component code" : "No component code available"}
            disabled={!hasComponentCode}
          >
            {isRightCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          </Button>
        </div>

        {view === "component" && hasRenderer ? (
          <div className="min-h-[200px] flex items-center justify-center">
            {renderer}
          </div>
        ) : view === "output" ? (
          <div className="relative">
            <ScrollArea className="max-h-80">
              <pre className="text-xs leading-5">
                {JSON.stringify(json, null, 2)}
              </pre>
            </ScrollArea>
          </div>
        ) : (
          <div className="relative">
            <ScrollArea className="max-h-80">
              <CodeBlock code={componentCode ?? "// No component code available"} className="leading-5" />
            </ScrollArea>
          </div>
        )}
      </div>
    </div >
  )
}

export default ToolDemoCard

"use client"

import * as React from "react"
import { Separator } from "@/registry/ai-tools/ui/separator"
import { Button } from "@/registry/ai-tools/ui/button"
import { AddCommand } from "@/components/add-command"
import { OpenInV0 } from "@/components/open-in-v0"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { CodeBlock } from "@/components/code-block"
import { CheckIcon, CopyIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { ExtendedRegistryItem } from "@/lib/registry-schemas"

export function ToolDemoCard({
  registryItem,
  json,
  code,
  componentCode,
  renderer,
  heading,
  subheading,
}: {
  registryItem: ExtendedRegistryItem
  json: unknown
  code: string
  componentCode?: string
  renderer?: React.ReactNode
  heading: string
  subheading?: string
}) {
  const { isCopied: isToolCopied, copyToClipboard: copyTool } =
    useCopyToClipboard()
  const { isCopied: isRightCopied, copyToClipboard: copyRight } =
    useCopyToClipboard()
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
            <div className="text-sm text-muted-foreground hidden md:flex">
              {subheading}
            </div>
          ) : null}
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <AddCommand
            name={registryItem.name}
            creator={registryItem.creators?.[0]}
          />
          <OpenInV0 name={registryItem.name} />
        </div>
      </header>

      {/* Left: Always show code with copy */}
      <div className="relative rounded-md bg-background p-4 border">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-muted-foreground mb-2 ">Code</div>
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "size-8 rounded-sm",
              isToolCopied &&
                "!bg-primary/15 border-primary/25 dark:!bg-primary/15 dark:border-primary/25"
            )}
            onClick={() => {
              copyTool(code)
              toast.success("Code copied to clipboard")
            }}
            aria-label="Copy code"
            title="Copy code"
          >
            <CheckIcon
              className={cn(
                "text-primary transition-transform size-4 dark:text-green-500",
                !isToolCopied && "scale-0"
              )}
            />
            <CopyIcon
              className={cn(
                "absolute size-4 transition-transform",
                isToolCopied && "scale-0"
              )}
            />
          </Button>
        </div>
        <CodeBlock code={code} />
      </div>

      {/* Right: Toggle between component and output (if renderer available) */}
      <div className="relative rounded-md bg-background p-4 border flex flex-col">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              className={cn(
                "text-xs text-muted-foreground mb-2 pointer-events-auto",
                view === "component" ? "opacity-100" : "opacity-70",
                hasRenderer ? "" : "hidden"
              )}
              onClick={() => hasRenderer && setView("component")}
              disabled={!hasRenderer}
            >
              Component
            </button>
            <button
              className={cn(
                "text-xs text-muted-foreground mb-2 pointer-events-auto",
                view === "output" ? "opacity-100" : "opacity-70"
              )}
              onClick={() => setView("output")}
            >
              Result (JSON)
            </button>
            <button
              className={cn(
                "text-xs text-muted-foreground mb-2 pointer-events-auto",
                view === "code" ? "opacity-100" : "opacity-70",
                hasComponentCode ? "" : "hidden"
              )}
              onClick={() => hasComponentCode && setView("code")}
              disabled={!hasComponentCode}
            >
              Code
            </button>
          </div>
          {/* Copy button */}
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "size-8 rounded-sm",
              isRightCopied &&
                "!bg-primary/15 border-primary/25 dark:!bg-primary/15 dark:border-primary/25"
            )}
            onClick={() => {
              if (componentCode) {
                copyRight(componentCode)
                toast.success("Component code copied")
              } else {
                toast.error("No component code available")
              }
            }}
            aria-label="Copy component code"
            title={
              hasComponentCode
                ? "Copy component code"
                : "No component code available"
            }
            disabled={!hasComponentCode}
          >
            <CheckIcon
              className={cn(
                "text-primary transition-transform size-4 dark:text-green-500",
                !isRightCopied && "scale-0"
              )}
            />
            <CopyIcon
              className={cn(
                "absolute transition-transform",
                isRightCopied && "scale-0"
              )}
            />
          </Button>
        </div>

        {/* Content */}
        {view === "component" && hasRenderer ? (
          <div className="min-h-[200px] flex items-start justify-center">
            {renderer}
          </div>
        ) : view === "output" ? (
          <div className="relative">
            <CodeBlock code={JSON.stringify(json, null, 2)} />
          </div>
        ) : (
          <div className="relative">
            <CodeBlock
              code={componentCode ?? "// No component code available"}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ToolDemoCard

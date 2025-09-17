"use client"

import * as React from "react"
import { Separator } from "@/registry/ai-tools/ui/separator"
import { Button } from "@/registry/ai-tools/ui/button"
import { Badge } from "@/registry/ai-tools/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ai-tools/ui/select"
import { AddCommand } from "@/components/add-command"
import { OpenInV0 } from "@/components/open-in-v0"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { CodeBlock } from "@/components/code-block"
import { CheckIcon, CopyIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { ExtendedRegistryItem } from "@/lib/registry-schemas"
import { ImageDemoControlsProvider } from "@/registry/ai-tools/tools/image/demo-controls"

export function ToolDemoCard({
  registryItem,
  json,
  code,
  componentCode,
  renderer,
  states,
  heading,
  subheading,
  variants,
  variantRegistryItems,
  isNew,
}: {
  registryItem: ExtendedRegistryItem
  json: unknown
  code: string
  componentCode?: string
  renderer?: React.ReactNode
  states?: Array<{ key: string; label: string; renderer: React.ReactNode }>
  heading: string
  subheading?: string
  variants?: Array<{
    key: string
    label: string
    json: unknown
    code: string
    renderer?: React.ReactNode
    states?: Array<{ key: string; label: string; renderer: React.ReactNode }>
  }>
  variantRegistryItems?: Record<string, ExtendedRegistryItem | undefined>
  isNew?: boolean
}) {
  const { isCopied: isToolCopied, copyToClipboard: copyTool } =
    useCopyToClipboard()
  const { isCopied: isRightCopied, copyToClipboard: copyRight } =
    useCopyToClipboard()
  const hasRenderer = Boolean(renderer)
  const hasComponentCode = Boolean(componentCode)
  // Left block view: tool code vs tool result JSON
  const [leftView, setLeftView] = React.useState<"tool-code" | "tool-json">(
    "tool-code"
  )
  // Right block view: component states vs component code
  const [rightView, setRightView] = React.useState<"component" | "code">(
    hasRenderer ? "component" : "code"
  )
  const hasVariants = Array.isArray(variants) && variants.length > 0
  const hasStates = Array.isArray(states) && states.length > 0
  const [variantKey, setVariantKey] = React.useState<string>(
    hasVariants ? variants![0]!.key : "default"
  )
  const [stateKey, setStateKey] = React.useState<string>(
    hasStates ? states![0]!.key : "completed"
  )
  const activeVariant = React.useMemo(() => {
    if (!hasVariants) return null
    return variants!.find((v) => v.key === variantKey) || variants![0]
  }, [hasVariants, variants, variantKey])
  const activeRegistryItem = React.useMemo(() => {
    if (!hasVariants) return registryItem
    const mapped = variantRegistryItems?.[variantKey]
    // inherit creators from base if variant missing
    return mapped
      ? { ...mapped, creators: mapped.creators ?? registryItem.creators }
      : registryItem
  }, [hasVariants, variantRegistryItems, variantKey, registryItem])

  const requiresApiKey = React.useMemo(() => {
    if (hasVariants)
      return [
        "brave",
        "exa",
        "perplexity",
        "openai",
        "fal",
        "runware",
      ].includes(variantKey)
    const n = activeRegistryItem.name
    return /websearch-(brave|exa|perplexity)|image-(openai|fal|runware)/.test(n)
  }, [hasVariants, variantKey, activeRegistryItem.name])

  const isImageTool = React.useMemo(() => {
    const n = activeRegistryItem.name || registryItem.name
    return /^image(\b|-)/.test(n)
  }, [activeRegistryItem.name, registryItem.name])

  const [imgCount, setImgCount] = React.useState<number>(3)
  const [imgAr, setImgAr] = React.useState<string>("1:1")

  const NewBadge = () => {
    return (
      <div className="pointer-events-none absolute -top-3.5 -left-2.5 xl:-left-5">
        <div className="text-xs font-bold rounded-full dark:bg-indigo-400 bg-indigo-200  darkborder-indigo-900 border-indigo-300 px-2.5 py-1 uppercase text-foreground shadow-md ring-1 ring-white/60 dark:ring-white/10">
          New
        </div>
      </div>
    )
  }

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-6 bg-muted/30">
      {isNew ? <NewBadge /> : null}
      <header className="md:col-span-2 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">{heading}</div>
            <Separator orientation="vertical" className="!h-4 hidden md:flex" />
            {subheading ? (
              <div className="text-sm text-muted-foreground hidden md:flex">
                {subheading}
              </div>
            ) : null}
          </div>
          {hasVariants && (
            <div className="flex items-center gap-2">
              <Select value={variantKey} onValueChange={setVariantKey}>
                <SelectTrigger size="sm" className="w-[142px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variants!.map((v) => (
                    <SelectItem key={v.key} value={v.key}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* image display controls moved to right panel */}
              {requiresApiKey && (
                <Badge variant="secondary" className="text-xs">
                  API key required
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap justify-end items-center">
          <AddCommand
            name={activeRegistryItem.name}
            creator={activeRegistryItem.creators?.[0]}
          />
          <OpenInV0 name={activeRegistryItem.name} />
        </div>
      </header>

      {/* Left: Tool code or tool result JSON */}
      <div className="relative rounded-md bg-background p-4 border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              className={cn(
                "text-xs text-muted-foreground mb-2 pointer-events-auto",
                leftView === "tool-code" ? "opacity-100" : "opacity-70"
              )}
              onClick={() => setLeftView("tool-code")}
            >
              Code
            </button>
            <button
              className={cn(
                "text-xs text-muted-foreground mb-2 pointer-events-auto",
                leftView === "tool-json" ? "opacity-100" : "opacity-70"
              )}
              onClick={() => setLeftView("tool-json")}
            >
              Result (JSON)
            </button>
          </div>
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "size-8 rounded-sm",
              isToolCopied &&
                "!bg-primary/15 border-primary/25 dark:!bg-primary/15 dark:border-primary/25"
            )}
            onClick={() => {
              if (leftView === "tool-code") {
                const activeCode = hasVariants
                  ? (activeVariant?.code ?? code)
                  : code
                copyTool(activeCode)
                toast.success("Code copied to clipboard")
              } else {
                const data = hasVariants ? (activeVariant?.json ?? json) : json
                copyTool(JSON.stringify(data, null, 2))
                toast.success("JSON result copied")
              }
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
        {leftView === "tool-code" ? (
          <CodeBlock
            code={hasVariants ? (activeVariant?.code ?? code) : code}
          />
        ) : (
          <CodeBlock
            code={JSON.stringify(
              hasVariants ? (activeVariant?.json ?? json) : json,
              null,
              2
            )}
          />
        )}
      </div>

      {/* Right: Component states and component code */}
      <div className="relative rounded-md bg-background p-4 border flex flex-col">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {hasRenderer && hasStates ? (
              states!.map((s) => (
                <button
                  key={s.key}
                  className={cn(
                    "text-xs text-muted-foreground mb-2 pointer-events-auto",
                    stateKey === s.key ? "opacity-100" : "opacity-70"
                  )}
                  onClick={() => {
                    setRightView("component")
                    setStateKey(s.key)
                  }}
                >
                  {s.label}
                </button>
              ))
            ) : hasRenderer ? (
              <span className="text-xs text-muted-foreground mb-2">
                Component
              </span>
            ) : (
              <span className="text-xs text-muted-foreground mb-2">
                Preview
              </span>
            )}
            <button
              className={cn(
                "text-xs text-muted-foreground mb-2 pointer-events-auto",
                rightView === "code" ? "opacity-100" : "opacity-70",
                hasComponentCode ? "" : "hidden"
              )}
              onClick={() => hasComponentCode && setRightView("code")}
              disabled={!hasComponentCode}
            >
              Code
            </button>
          </div>
          {/* Display controls + Copy button */}
          <div className="flex items-center gap-2">
            {isImageTool && (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="sr-only">Image count</span>
                  <Select
                    value={String(imgCount)}
                    onValueChange={(v) => setImgCount(Number(v))}
                  >
                    <SelectTrigger size="sm" className="w-[64px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["1", "2", "3", "4"] as const).map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="sr-only">Aspect ratio</span>
                  <Select value={imgAr} onValueChange={setImgAr}>
                    <SelectTrigger size="sm" className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["1:1", "3:2", "4:3", "16:9", "9:16"] as const).map(
                        (r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
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
        </div>

        {/* Content */}
        {rightView === "component" && hasRenderer ? (
          <div className="min-h-[200px] flex items-start justify-center">
            <ImageDemoControlsProvider
              value={{ count: imgCount, aspectRatio: imgAr }}
            >
              {hasVariants
                ? // prefer variant state renderer if provided
                  ((activeVariant && activeVariant.states
                    ? (activeVariant.states.find((s) => s.key === stateKey)
                        ?.renderer ?? activeVariant?.renderer)
                    : activeVariant?.renderer) ?? renderer)
                : hasStates
                  ? (states!.find((s) => s.key === stateKey)?.renderer ??
                    renderer)
                  : renderer}
            </ImageDemoControlsProvider>
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

"use client"

import * as React from "react"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/ai-tools/ui/button"

import { CheckIcon, CopyIcon } from "lucide-react"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/revola"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RegistrySetup({
  className,
}: React.ComponentProps<typeof Button>) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button variant="ghost" size="sm" className={cn(className)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className="size-4"
          >
            <rect width="256" height="256" fill="none"></rect>
            <line
              x1="208"
              y1="128"
              x2="128"
              y2="208"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
            ></line>
            <line
              x1="192"
              y1="40"
              x2="40"
              y2="192"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
            ></line>
          </svg>
          Registry
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="rounded-t-xl sm:rounded-xl flex sm:max-h-[min(640px,80dvh)] overflow-hidden flex-col max-h-[85dvh]">
        <div className="flex flex-col space-y-4 p-6 pt-0 sm:pt-6 overflow-y-auto">
          <ResponsiveDialogHeader className="text-left">
            <ResponsiveDialogTitle>Setup Registry</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Use the code below to configure the @ai-tools registry for your
              project.
              <br />
              Ensure you&apos;ve set up{" "}
              <a
                href="https://ui.shadcn.com/"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                shadcn
              </a>{" "}
              for your project.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <div className="font-medium">
            Copy and paste the code into{" "}
            <code className="font-mono text-foreground">components.json</code>
          </div>
          <div className="relative max-w-full min-w-0 flex flex-col">
            <Button
              variant="outline"
              size="icon"
              className="absolute bg-background right-4 z-10 top-4 size-8 rounded-md"
              onClick={() => copyToClipboard(registrySetupCode)}
            >
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </Button>
            <ScrollArea
              // viewportClassName="py-6"
              maskClassName="before:from-muted after:from-muted dark:before:from-card dark:after:from-card"
              className="bg-muted dark:bg-card rounded-md max-h-[400px] w-full"
            >
              <pre className="py-6 w-full text-[13px] font-geist-mono leading-tight">
                <code className="!px-6 block w-full ">{registrySetupCode}</code>
              </pre>
            </ScrollArea>
          </div>
          <div className="font-medium">
            Then use the following command to add components:
          </div>
          <ScrollArea
            viewportClassName="p-6"
            maskClassName="before:from-muted after:from-muted dark:before:from-card dark:after:from-card"
            className="bg-muted dark:bg-card rounded-md min-h-[50px] w-full"
          >
            <pre className="text-sm font-mono">
              <code>npx shadcn@latest add @ai-tools/[component-name]</code>
            </pre>
          </ScrollArea>
          <div className="font-medium">
            To setup the MCP server, run the following command:
          </div>
          <ScrollArea
            viewportClassName="p-6"
            maskClassName="before:from-muted after:from-muted dark:before:from-card dark:after:from-card"
            className="bg-muted rounded-md min-h-[50px] w-full dark:bg-card"
          >
            <pre className="text-sm font-mono">
              <code>npx shadcn@latest mcp init</code>
            </pre>
          </ScrollArea>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

const registrySetupCode = `"registries": {
  "@ai-tools": "${process.env.NEXT_PUBLIC_BASE_URL}/api/registry/public/{name}"
}
`

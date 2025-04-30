"use client"

import * as React from "react"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/alpine/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/alpine/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/alpine/ui/tabs"
import { CheckIcon, CopyIcon } from "lucide-react"

export function McpSetup({ className }: React.ComponentProps<typeof Button>) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const { isCopied: isCopiedNpm, copyToClipboard: copyToClipboardNpm } =
    useCopyToClipboard()
  const [tab, setTab] = React.useState("cursor")

  const filePath = React.useMemo(() => {
    if (tab === "cursor") {
      return ".cursor/mcp.json"
    }

    if (tab === "windsurf") {
      return ".codeium/windsurf/mcp_config.json"
    }

    return ".v0/mcp.json"
  }, [tab])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={cn(className)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            fillRule="evenodd"
            viewBox="0 0 24 24"
          >
            <path d="M15.688 2.343a2.588 2.588 0 0 0-3.61 0l-9.626 9.44a.863.863 0 0 1-1.203 0 .823.823 0 0 1 0-1.18l9.626-9.44a4.313 4.313 0 0 1 6.016 0 4.116 4.116 0 0 1 1.204 3.54 4.3 4.3 0 0 1 3.609 1.18l.05.05a4.115 4.115 0 0 1 0 5.9l-8.706 8.537a.274.274 0 0 0 0 .393l1.788 1.754a.823.823 0 0 1 0 1.18.863.863 0 0 1-1.203 0l-1.788-1.753a1.92 1.92 0 0 1 0-2.754l8.706-8.538a2.47 2.47 0 0 0 0-3.54l-.05-.049a2.588 2.588 0 0 0-3.607-.003l-7.172 7.034-.002.002-.098.097a.863.863 0 0 1-1.204 0 .823.823 0 0 1 0-1.18l7.273-7.133a2.47 2.47 0 0 0-.003-3.537z" />
            <path d="M14.485 4.703a.823.823 0 0 0 0-1.18.863.863 0 0 0-1.204 0l-7.119 6.982a4.115 4.115 0 0 0 0 5.9 4.314 4.314 0 0 0 6.016 0l7.12-6.982a.823.823 0 0 0 0-1.18.863.863 0 0 0-1.204 0l-7.119 6.982a2.588 2.588 0 0 1-3.61 0 2.47 2.47 0 0 1 0-3.54l7.12-6.982z" />
          </svg>
          MCP
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Setup MCP</DialogTitle>
          <DialogDescription>
            Use the code below to configure the registry MCP in your IDE.
          </DialogDescription>
        </DialogHeader>
        <div className="font-medium">1. Create a new Next.js app</div>
        <div className="relative min-w-0">
          <Button
            variant="outline"
            size="icon"
            className="absolute bg-background right-4 top-4 size-8 rounded-md"
            onClick={() =>
              copyToClipboardNpm(
                "pnpm create next-app@latest --tailwind --eslint --typescript --app --no-src-dir --turbopack --no-import-alias"
              )
            }
          >
            {isCopiedNpm ? <CheckIcon /> : <CopyIcon />}
          </Button>
          <div className="overflow-x-auto bg-muted p-6 rounded-md">
            <pre className="text-sm font-mono">
              pnpm create next-app@latest --tailwind --eslint --typescript --app
              --no-src-dir --turbopack --no-import-alias
            </pre>
          </div>
        </div>
        <div className="font-medium">
          2. Copy and paste the code into{" "}
          <code className="font-mono text-foreground">{filePath}</code>
        </div>
        <Tabs defaultValue={tab} onValueChange={setTab} className="min-w-0">
          <TabsList>
            <TabsTrigger value="cursor">Cursor</TabsTrigger>
            <TabsTrigger value="windsurf">Windsurf</TabsTrigger>
          </TabsList>
          <TabsContent value="cursor" className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 z-10 top-4 size-8 rounded-md"
              onClick={() => copyToClipboard(mcpSetupCodeCursor)}
            >
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </Button>
            <div className="overflow-x-auto bg-muted p-8 rounded-md min-h-[300px]">
              <pre className="text-sm font-mono">
                <code>{mcpSetupCodeCursor}</code>
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="windsurf" className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute bg-background right-4 z-10 top-4 size-8 rounded-md"
              onClick={() => copyToClipboard(mcpSetupCodeWindsurf)}
            >
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </Button>
            <div className="overflow-x-auto bg-muted p-6 rounded-md min-h-[300px]">
              <pre className="text-sm font-mono">
                <code>{mcpSetupCodeWindsurf}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

const mcpSetupCodeCursor = `{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "${process.env.NEXT_PUBLIC_BASE_URL}/r/registry.json"
      }
    }
  }
}
`

const mcpSetupCodeWindsurf = `{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@canary", "registry:mcp"],
      "env": {
        "REGISTRY_URL": "${process.env.NEXT_PUBLIC_BASE_URL}/r/registry.json"
      }
    }
  }
}`

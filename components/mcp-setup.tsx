"use client"

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
import * as React from "react"

export function McpSetup({ className }: React.ComponentProps<typeof Button>) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()
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
        <div className="font-medium">
          Copy and paste the code into{" "}
          <code className="font-mono text-foreground">{filePath}</code>
        </div>
        <Tabs defaultValue={tab} onValueChange={setTab} className="min-w-0">
          <TabsList>
            <TabsTrigger value="cursor">Cursor</TabsTrigger>
            <TabsTrigger value="windsurf">Windsurf</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 z-10 top-4 size-8 rounded-md"
            onClick={() => copyToClipboard(mcpSetupCode)}
          >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
          </Button>
          <div className="overflow-x-auto bg-muted p-8 rounded-md min-h-[200px]">
            <pre className="text-sm font-mono">
              <code>{mcpSetupCode}</code>
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const mcpSetupCode = `{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@latest", "registry:mcp"]
    }
  }
}
`

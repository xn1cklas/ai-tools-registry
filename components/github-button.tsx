"use client"

import { Button } from "@/registry/ai-tools/ui/button"
import { GithubIcon } from "lucide-react"

export function GithubButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size="icon" asChild {...props}>
      <a
        href="https://github.com/xn1cklas/ai-tools-registry"
        target="_blank"
        rel="noreferrer"
        aria-label="Open GitHub repository"
        title="Open GitHub repository"
      >
        <GithubIcon className="h-4 w-4" />
      </a>
    </Button>
  )
}

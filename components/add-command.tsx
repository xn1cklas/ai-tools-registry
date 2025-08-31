"use client"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { Button } from "@/registry/ai-tools/ui/button"
import { CheckIcon } from "lucide-react"
import { toast } from "sonner"

export function AddCommand({ name }: { name: string }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-sm !pl-2"
      onClick={() => {
        copyToClipboard(`npx shadcn@latest add @ai-tools/${name}`)
        toast.success(`npx command copied to clipboard`)
      }}
    >
      {isCopied ? (
        <CheckIcon />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
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
      )}
      {`@ai-tools/${name}`}
    </Button>
  )
}

"use client"

import * as React from "react"
import { Button } from "@/registry/alpine/ui/button"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { registryItemSchema } from "shadcn/registry"
import { z } from "zod"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { getRegistryItemUrl } from "@/lib/utils"
import { toast } from "sonner"

export function AddCommand({
  registryItem,
}: {
  registryItem: z.infer<typeof registryItemSchema>
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const { isCopied: isCopiedUrl, copyToClipboard: copyToClipboardUrl } =
    useCopyToClipboard()
  const url = getRegistryItemUrl(registryItem.name)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="rounded-sm !pl-2"
        onClick={() => {
          copyToClipboard(`npx shadcn@latest add ${url}`)
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
        shadcn
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-sm !pl-2"
        onClick={() => {
          copyToClipboardUrl(url)
          toast.success(`Registry URL copied to clipboard`)
        }}
      >
        {isCopiedUrl ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <ClipboardIcon className="size-3.5" />
        )}
        URL
      </Button>
    </>
  )
}

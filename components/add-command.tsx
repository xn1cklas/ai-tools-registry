"use client"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import type { Creator } from "@/lib/registry-schemas"
import { Button } from "@/registry/ai-tools/ui/button"
import { Separator } from "@/registry/ai-tools/ui/separator"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/ai-tools/ui/hover-card"
import { CheckIcon, ExternalLink, Github } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function AddCommand({
  name,
  creator,
}: {
  name: string
  creator?: Pick<
    Creator,
    | "url"
    | "avatarUrl"
    | "handle"
    | "name"
    | "githubHandle"
    | "xHandle"
    | "githubUrl"
    | "xUrl"
  >
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const fallbackHandle = creator?.handle ?? "xn1cklas"
  const githubHandle =
    creator?.githubHandle ??
    (creator?.url?.includes("github.com")
      ? creator?.url?.split("/").filter(Boolean).pop()
      : undefined) ??
    fallbackHandle
  const xHandle = creator?.xHandle ?? fallbackHandle

  const githubUrl =
    creator?.githubUrl ??
    (creator?.url?.includes("github.com")
      ? creator.url!
      : `https://github.com/${githubHandle}`)
  const xUrl = creator?.xUrl ?? `https://x.com/${xHandle}`

  return (
    <span className="inline-flex items-center gap-2">
      <HoverCard>
        <HoverCardTrigger asChild>
          <a
            href={creator?.url ?? githubUrl}
            target="_blank"
            rel="noreferrer"
            title={`Creator: @${fallbackHandle}`}
            aria-label={`Creator: @${fallbackHandle}`}
            className="shrink-0"
          >
            <img
              src={
                creator?.avatarUrl ??
                "https://avatars.githubusercontent.com/u/64584979?v=4"
              }
              alt={creator?.name ?? fallbackHandle ?? "Creator avatar"}
              className="h-8 w-8 rounded-full border"
              loading="lazy"
              decoding="async"
            />
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-center gap-3">
            <img
              src={
                creator?.avatarUrl ??
                "https://avatars.githubusercontent.com/u/64584979?v=4"
              }
              alt={creator?.name ?? fallbackHandle ?? "Creator avatar"}
              className="h-9 w-9 rounded-full border"
              loading="lazy"
              decoding="async"
            />
            <div className="min-w-0">
              <div className="truncate font-medium">
                {creator?.name ?? fallbackHandle}
              </div>
              <div className="truncate text-sm text-muted-foreground">
                @{fallbackHandle}
              </div>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="space-y-2 text-sm">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Github className="size-4 opacity-70" aria-hidden />
              <span className="truncate">@{githubHandle}</span>
              <ExternalLink className="ms-auto size-3 opacity-60" aria-hidden />
            </a>
            <a
              href={xUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden
                className="opacity-70"
              >
                <path
                  fill="currentColor"
                  d="M3 3h3.5l5 6.5L16 3h5l-7.5 9.5L21 21h-3.5l-5.5-7.1L6 21H1l8.5-10.8L3 3Z"
                />
              </svg>
              <span className="truncate">@{xHandle}</span>
              <ExternalLink className="ms-auto size-3 opacity-60" aria-hidden />
            </a>
          </div>
        </HoverCardContent>
      </HoverCard>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "rounded-sm !pl-2",
          isCopied &&
            "dark:text-green-500 text-primary !bg-primary/15 border-primary/25 dark:!bg-primary/15 dark:border-primary/25"
        )}
        onClick={() => {
          copyToClipboard(`npx shadcn@latest add @ai-tools/${name}`)
          toast.success(`npx command copied to clipboard`)
        }}
      >
        <div className="relative size-4">
          <CheckIcon
            className={cn(
              "text-primary transition-transform size-4 dark:text-green-500",
              !isCopied && "scale-0"
            )}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className={cn(
              "absolute inset-0 size-4 transition-transform",
              isCopied && "scale-0"
            )}
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
        </div>
        {`@ai-tools/${name}`}
      </Button>
    </span>
  )
}

"use client"

import * as React from "react"
import type { NewsItem, NewsSearchResult, NewsToolType } from "./tool"
import { Loader } from "@/registry/ai-elements/loader"
import { CodeBlock } from "@/registry/ai-elements/code-block"
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source as SourcesItem,
} from "@/registry/ai-elements/sources"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/registry/ai-tools/ui/card"
import { Skeleton } from "@/registry/ai-tools/ui/skeleton"

export function NewsList({ invocation }: { invocation: NewsToolType }) {
  const part = invocation
  const cardBaseClass =
    "not-prose flex w-full flex-col gap-0 overflow-hidden border border-border/50 bg-background/95 py-0 text-foreground shadow-sm"
  const headerBaseClass =
    "flex flex-col gap-2 border-b border-border/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
  const contentBaseClass = "px-6 py-5"
  const renderHeader = (
    title: React.ReactNode,
    description?: React.ReactNode,
    actions?: React.ReactNode
  ) => {
    const descriptionNode =
      typeof description === "string" ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : (
        (description ?? null)
      )

    return (
      <CardHeader className={headerBaseClass}>
        {(title || descriptionNode) && (
          <div className="space-y-1">
            {title ? (
              <h3 className="text-sm font-semibold leading-none tracking-tight text-foreground">
                {title}
              </h3>
            ) : null}
            {descriptionNode}
          </div>
        )}
        {actions ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {actions}
          </div>
        ) : null}
      </CardHeader>
    )
  }
  if (part.state === "input-streaming") {
    return (
      <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
        {renderHeader("News", "Waiting for topic…")}
        <CardContent
          className={cn(
            contentBaseClass,
            "space-y-4 text-sm text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Loader /> Preparing request
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (part.state === "input-available") {
    return (
      <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
        {renderHeader("News", "Fetching…")}
        <CardContent className={cn(contentBaseClass, "space-y-4")}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader /> Running tool
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-16 w-full rounded-xl" />
            ))}
          </div>
          {part.input ? (
            <div className="rounded-md border border-border/40 bg-muted/40">
              <CodeBlock
                code={JSON.stringify(part.input, null, 2)}
                language="json"
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    )
  }

  if (part.state === "output-error") {
    return (
      <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
        {renderHeader("News", "Error")}
        <CardContent className={contentBaseClass}>
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {part.errorText || "An error occurred while fetching news."}
          </div>
        </CardContent>
      </Card>
    )
  }
  if (part.output === undefined) return null
  const { topic, items } = part.output
  const linkedItems = items.filter((i) => i.url)

  return (
    <Card className={cn(cardBaseClass, "max-w-xl animate-in fade-in-50")}>
      {renderHeader(
        "News",
        <span className="text-xs text-muted-foreground">
          Latest on <span className="font-medium text-foreground">{topic}</span>
        </span>
      )}
      <CardContent className={cn(contentBaseClass, "space-y-4")}>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No headlines returned.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item: NewsItem) => {
              const timestamp = item.publishedAt
                ? new Date(item.publishedAt)
                : null
              return (
                <li
                  key={item.id}
                  className="rounded-lg border border-border/40 bg-muted/30 px-4 py-3 transition-colors hover:border-border/60"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    {item.url ? (
                      <a
                        href={item.url}
                        className="font-medium text-sm leading-tight text-foreground hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <span className="font-medium text-sm leading-tight">
                        {item.title}
                      </span>
                    )}
                    {timestamp ? (
                      <time
                        className="text-xs text-muted-foreground"
                        dateTime={timestamp.toISOString()}
                      >
                        {timestamp.toLocaleString()}
                      </time>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {linkedItems.length ? (
          <div className="pt-1">
            <Sources>
              <SourcesTrigger count={linkedItems.length} />
              <SourcesContent>
                {linkedItems.map((i) => (
                  <SourcesItem key={i.id} href={i.url!} title={i.title} />
                ))}
              </SourcesContent>
            </Sources>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default NewsList

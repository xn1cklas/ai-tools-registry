"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function ScrollArea({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [scrolling, setScrolling] = React.useState(false)
  const timeoutRef = React.useRef<number | null>(null)

  const onScroll: React.UIEventHandler<HTMLDivElement> = () => {
    if (!scrolling) setScrolling(true)
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setScrolling(false), 900)
  }

  React.useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    },
    []
  )

  return (
    <div
      data-slot="scroll-area"
      data-scrolling={scrolling ? "true" : "false"}
      onScroll={onScroll}
      className={cn("relative overflow-auto", className)}
      {...props}
    />
  )
}

export { ScrollArea as default }

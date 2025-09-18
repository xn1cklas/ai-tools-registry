"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/registry/ai-tools/ui/button"

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if banner was dismissed
    const dismissed = localStorage.getItem("banner-dismissed")
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("banner-dismissed", "true")
  }

  if (!isVisible) return null

  return (
    <div className="relative overflow-hidden rounded-b-md border-b bg-gradient-to-r from-violet-50/40 via-purple-50/40 to-pink-50/40 dark:from-violet-950/40 dark:via-purple-950/40 dark:to-pink-950/40">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-purple-600/5 to-pink-600/5 dark:from-violet-400/5 dark:via-purple-400/5 dark:to-pink-400/5" />
      <div className="relative max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-1.5 text-sm">
          <div className="relative">
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <span className="relative">
              <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                New
              </span>
            </span>
            <span className="text-sm">Image generation tools are here</span>
            <span className="text-muted-foreground/60">•</span>
            <Link
              href="/playground"
              className="inline-flex items-center gap-1.5 font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group"
            >
              Explore playground
              <svg
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full text-muted-foreground/60 hover:text-muted-foreground hover:bg-transparent"
        onClick={handleDismiss}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Dismiss banner</span>
      </Button>
    </div>
  )
}

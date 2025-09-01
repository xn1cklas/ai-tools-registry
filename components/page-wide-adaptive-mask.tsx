"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function PageWideScrollMask() {
  const [showTopMask, setShowTopMask] = useState(false)
  const [showBottomMask, setShowBottomMask] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      const isScrollable = documentHeight > windowHeight

      if (!isScrollable) {
        setShowTopMask(false)
        setShowBottomMask(false)
        return
      }

      const topThreshold = 50
      setShowTopMask(scrollTop > topThreshold)

      const bottomThreshold = 50
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight)
      setShowBottomMask(distanceFromBottom > bottomThreshold)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "from-background pointer-events-none fixed top-0 z-50 h-16 w-full bg-gradient-to-b to-transparent transition-all duration-150 ease-in-out",
          showTopMask ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "from-background pointer-events-none fixed bottom-0 z-50 h-16 w-full bg-gradient-to-t to-transparent transition-all duration-150 ease-in-out",
          showBottomMask
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        )}
      />
    </>
  )
}

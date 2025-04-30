"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/alpine/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn("size-8", className)}
      {...props}
    >
      <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

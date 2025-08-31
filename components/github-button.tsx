"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/registry/alpine/ui/button";
import { GithubIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function GithubButton({
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
      <a href="https://github.com/shadcn/ai-tools-registry" target="_blank" rel="noreferrer" className="underline"><GithubIcon /></a>
    </Button>
  )
}

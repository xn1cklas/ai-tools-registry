import { Logo } from "@/registry/ai-tools/branding/logo"
import { MainNav } from "@/registry/ai-tools/navigation/main-nav"
import { Button } from "@/registry/ai-tools/ui/button"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center mx-auto px-4 gap-4">
        <Link href="/">
          <Logo /> <span className="sr-only">ai-tools</span>
        </Link>
        <MainNav />
        <div className="ml-auto flex items-center gap-4">
          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  )
}

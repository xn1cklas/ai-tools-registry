import { Button } from "@/registry/alpine/ui/button"
import Link from "next/link"

export function MainNav() {
  return (
    <nav className="flex flex-col md:flex-row items-center gap-1">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/">Home</Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/experiences">Experiences</Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/listings">Listings</Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/about">About</Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/contact">Contact</Link>
      </Button>
    </nav>
  )
}

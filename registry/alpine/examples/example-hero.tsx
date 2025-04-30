import { Hero } from "@/registry/alpine/marketing/hero"
import { Button } from "@/registry/alpine/ui/button"

export function ExampleHero() {
  return (
    <Hero
      heading="Introducing Co‑Host Network"
      subheading="Now you can hire a co-host to help. Plus, get more ways to make hosting and planning trips even easier."
      imageUrl="https://images.unsplash.com/photo-1697807646004-31ae73a1a625"
    >
      <div className="flex gap-2 mt-2">
        <Button size="lg">Learn more</Button>
        <Button size="lg" variant="outline">
          Get started
        </Button>
      </div>
    </Hero>
  )
}

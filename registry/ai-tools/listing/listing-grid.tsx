import { cn } from "@/lib/utils"
import { ListingCard } from "@/registry/ai-tools/listing/listing-card"

export function ListingGrid({
  heading,
  subheading,
  listings,
  className,
}: {
  heading?: string
  subheading?: string
  listings: {
    name: string
    location: string
    imageUrl: string
    rating: number
    reviewCount: number
  }[]
  className?: string
}) {
  return (
    <div className="flex flex-col gap-6 min-w-0 w-full">
      {heading || subheading ? (
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tighter">{heading}</h2>
          {subheading && <p className="text-muted-foreground">{subheading}</p>}
        </div>
      ) : null}
      <div
        className={cn(
          "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full",
          className
        )}
      >
        {listings.map((listing) => (
          <ListingCard key={listing.name} {...listing} />
        ))}
      </div>
    </div>
  )
}

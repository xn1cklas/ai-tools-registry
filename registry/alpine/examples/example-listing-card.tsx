import { ListingCard } from "@/registry/alpine/listing/listing-card"

export function ExampleListingCard() {
  return (
    <ListingCard
      name="Cabin in Thornfield"
      location="An off Grid Experience"
      rating={4.95}
      reviewCount={261}
      imageUrl="https://images.unsplash.com/photo-1542718610-a1d656d1884c"
      className="max-w-xs"
    />
  )
}

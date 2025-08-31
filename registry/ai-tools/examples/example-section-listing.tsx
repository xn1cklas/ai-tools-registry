import { Section } from "@/registry/ai-tools/marketing/section"
import { ListingGrid } from "@/registry/ai-tools/listing/listing-grid"

export function ExampleSectionWithListing() {
  return (
    <Section
      heading="Settle in at these top-rated cabins"
      subheading="People love these highly-rated stays for their location, cleanliness, and more."
    >
      <ListingGrid
        listings={[
          {
            name: "Cabin in Thornfield",
            location: "An off Grid Experience",
            imageUrl:
              "https://images.unsplash.com/photo-1542718610-a1d656d1884c",
            rating: 4.95,
            reviewCount: 261,
          },
          {
            name: "Lakeview Retreat",
            location: "Peaceful lakeside cabin",
            imageUrl:
              "https://images.unsplash.com/photo-1733849593382-3d06b5e97adc",
            rating: 4.87,
            reviewCount: 198,
          },
          {
            name: "Mountain Hideaway",
            location: "Secluded mountain escape",
            imageUrl:
              "https://images.unsplash.com/photo-1662652771281-afdb7c63d573",
            rating: 4.92,
            reviewCount: 312,
          },
          {
            name: "Forest Bungalow",
            location: "Nestled in the woods",
            imageUrl:
              "https://images.unsplash.com/photo-1601918774946-25832a4be0d6",
            rating: 4.89,
            reviewCount: 174,
          },
        ]}
      />
    </Section>
  )
}

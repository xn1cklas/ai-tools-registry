import { ListingBookingForm } from "@/registry/alpine/forms/booking-form"
import { Section } from "@/registry/alpine/marketing/section"
import Image from "next/image"

export function ExampleSectionWithBookingForm() {
  return (
    <Section
      heading="Wishlist-worthy cabins"
      subheading="From a hillside retreat overlooking the Smokies to a storybook cottage in California’s wine country."
    >
      <div className="flex md:gap-8 flex-col-reverse md:flex-row items-start relative">
        <ListingBookingForm
          heading="Cabin Rentals"
          subheading="Spend some time in the great outdoors"
          className="md:absolute md:w-md -mt-12 md:mt-0 md:top-12 md:left-12"
        />
        <Image
          src="https://images.unsplash.com/photo-1634663476205-812f96a5705b"
          alt="Cabin"
          width={1200}
          height={600}
          className="aspect-square md:aspect-[2/1] object-cover rounded-lg"
        />
      </div>
    </Section>
  )
}

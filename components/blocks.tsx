import { LoginForm } from "@/registry/alpine/auth/login-form"
import { Logo } from "@/registry/alpine/branding/logo"
import { ExampleBookingForm } from "@/registry/alpine/examples/example-booking-form"
import { ExampleHero } from "@/registry/alpine/examples/example-hero"
import { ExampleListingCard } from "@/registry/alpine/examples/example-listing-card"
import { ExampleListingGrid } from "@/registry/alpine/examples/example-listing-grid"
import { ExampleSectionWithBookingForm } from "@/registry/alpine/examples/example-section-booking"
import { ExampleSectionWithListing } from "@/registry/alpine/examples/example-section-listing"
import { ContactForm } from "@/registry/alpine/forms/contact-form"
import { MainNav } from "@/registry/alpine/navigation/main-nav"
import { SiteHeader } from "@/registry/alpine/navigation/site-header"
export const blocks = [
  {
    name: "logo",
    component: Logo,
  },
  {
    name: "main-nav",
    component: MainNav,
  },
  {
    name: "site-header",
    component: SiteHeader,
  },
  {
    name: "login-form",
    component: LoginForm,
  },
  {
    name: "booking-form",
    component: ExampleBookingForm,
  },
  {
    name: "contact-form",
    component: ContactForm,
  },
  {
    name: "example-listing-card",
    component: ExampleListingCard,
  },
  {
    name: "example-listing-grid",
    component: ExampleListingGrid,
  },
  {
    name: "example-section-listing",
    component: ExampleSectionWithListing,
  },
  {
    name: "example-section-booking",
    component: ExampleSectionWithBookingForm,
  },
  {
    name: "example-hero",
    component: ExampleHero,
  },
]

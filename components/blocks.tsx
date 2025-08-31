import { LoginForm } from "@/registry/ai-tools/auth/login-form"
import { Logo } from "@/registry/ai-tools/branding/logo"
import { ExampleBookingForm } from "@/registry/ai-tools/examples/example-booking-form"
import { ExampleHero } from "@/registry/ai-tools/examples/example-hero"
import { ExampleListingCard } from "@/registry/ai-tools/examples/example-listing-card"
import { ExampleListingGrid } from "@/registry/ai-tools/examples/example-listing-grid"
import { ExampleSectionWithBookingForm } from "@/registry/ai-tools/examples/example-section-booking"
import { ExampleSectionWithListing } from "@/registry/ai-tools/examples/example-section-listing"
import { ContactForm } from "@/registry/ai-tools/forms/contact-form"
import { MainNav } from "@/registry/ai-tools/navigation/main-nav"
import { SiteHeader } from "@/registry/ai-tools/navigation/site-header"
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

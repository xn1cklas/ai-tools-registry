import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import { Providers } from "@/components/providers"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/registry/ai-tools/ui/separator"
import Link from "next/link"
import { Toaster } from "@/registry/ai-tools/ui/sonner"
import { RegistrySetup } from "@/components/registry-setup"
import { GithubButton } from "@/components/github-button"
import { TextIcon } from "lucide-react"
import { AnnouncementBanner } from "@/components/announcement-banner"

const fontSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
})

const title = "AI Tools Registry"
const description =
  "A registry distributing AI Tools and components using shadcn."

export const metadata: Metadata = {
  title: {
    default: `${title} | ${description}`,
    template: "%s | AI Tools",
  },
  description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  manifest: `${process.env.NEXT_PUBLIC_BASE_URL}/site.webmanifest`,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <AnnouncementBanner />
          <header>
            <div className="max-w-7xl mx-auto flex items-center px-4 py-6">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-baseline gap-1">
                  <TextIcon /> <span className="font-bold">AI Tools</span>
                </Link>
                <Separator orientation="vertical" className="!h-6" />
                <nav className="flex items-center gap-4">
                  <Link
                    href="/playground"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Playground
                  </Link>
                </nav>
              </div>
              <div className="ml-auto flex gap-2">
                <RegistrySetup />
                <GithubButton />
                <ModeToggle />
              </div>
            </div>
          </header>
          <div className="flex-1 flex flex-col">{children}</div>
          <Toaster position="top-center" />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

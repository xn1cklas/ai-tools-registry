import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { ModeToggle } from "@/components/mode-toggle"
import { McpSetup } from "@/components/mcp-setup"
import { Separator } from "@/registry/alpine/ui/separator"
import Link from "next/link"
import { Logo } from "@/registry/alpine/branding/logo"
import { Toaster } from "@/registry/alpine/ui/sonner"

const fontSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
})

const title = "Alpine"
const description = "A example registry for distributing code using shadcn."

export const metadata: Metadata = {
  title: {
    default: `${title} | ${description}`,
    template: "%s | Alpine",
  },
  description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
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
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <Providers>
          <header>
            <div className="max-w-7xl mx-auto flex items-center px-4 py-6">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Logo /> <span className="sr-only">Alpine</span>
                </Link>
                <Separator orientation="vertical" className="!h-6" />
                <p className="text-muted-foreground hidden md:block line-clamp-1 text-sm">
                  An example registry for distributing code using shadcn.
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <McpSetup />
                <ModeToggle />
              </div>
            </div>
          </header>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  )
}

import { cn } from "@/lib/utils"
import Image from "next/image"

export function Hero({
  heading,
  subheading,
  imageUrl,
  className,
  children,
}: {
  heading: string
  subheading: string
  imageUrl: string
} & React.ComponentProps<"section">) {
  return (
    <section className={cn("w-full py-8 md:py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={heading}
            width={1200}
            height={450}
            className="aspect-square md:aspect-[120/45] w-full object-cover rounded-lg"
          />
          <div className="py-8 md:absolute md:inset-0 md:bg-black/50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 max-w-xl text-center mx-auto text-balance md:text-white">
              <h2 className="text-3xl tracking-tighter lg:text-5xl xl:text-6xl font-bold text-shadow">
                {heading}
              </h2>
              <p className="text-balance text-shadow lg:text-xl">
                {subheading}
              </p>
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

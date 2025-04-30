import { cn } from "@/lib/utils"

export function Section({
  heading,
  subheading,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  heading: string
  subheading: string
}) {
  return (
    <section
      className={cn("py-10 lg:py-24 gap-6 w-full", className)}
      {...props}
    >
      <div className="container mx-auto flex flex-col gap-8 px-4 w-full">
        <div className="flex flex-col items-center gap-2 max-w-xl text-center mx-auto text-balance">
          <h2 className="text-3xl tracking-tighter lg:text-5xl xl:text-6xl font-bold">
            {heading}
          </h2>
          <p className="text-muted-foreground text-balance lg:text-xl">
            {subheading}
          </p>
        </div>
        {children}
      </div>
    </section>
  )
}

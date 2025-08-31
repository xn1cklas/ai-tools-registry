import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"
import { StarIcon } from "lucide-react"
import Image from "next/image"

export function ListingCard({
  name,
  location,
  imageUrl,
  rating,
  reviewCount,
  className,
}: {
  name: string
  location: string
  imageUrl: string
  rating: number
  reviewCount: number
} & React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "w-full p-0 bg-transparent aspect-square border-0 gap-4 min-w-0",
        className
      )}
    >
      <CardContent className="p-0">
        <Image
          src={imageUrl}
          alt={name}
          width={600}
          height={600}
          className="aspect-square rounded-lg w-full object-cover"
        />
      </CardContent>
      <CardHeader className="p-0 gap-0">
        <CardTitle className="flex items-center gap-2 text-sm tracking-tight font-medium">
          {name}{" "}
          <div className="flex items-center gap-1 ml-auto">
            <StarIcon className="fill-foreground size-3" /> {rating} (
            {reviewCount})
          </div>
        </CardTitle>
        <CardDescription>{location}</CardDescription>
      </CardHeader>
    </Card>
  )
}

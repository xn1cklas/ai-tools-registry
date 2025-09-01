import { tool } from "ai"
import { z } from "zod"

export const searchPhotosTool = tool({
  description:
    "Search for high-quality photos using the Unsplash API. Returns a list of photos with URLs, descriptions, and photographer information.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("The search query for photos (e.g., 'nature', 'city', 'food')"),
    count: z
      .number()
      .min(1)
      .max(30)
      .default(10)
      .describe("Number of photos to return (1-30)"),
    orientation: z
      .enum(["landscape", "portrait", "squarish"])
      .optional()
      .describe("Preferred photo orientation"),
  }),
  execute: async ({ query, count, orientation }) => {
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

    if (!UNSPLASH_ACCESS_KEY) {
      throw new Error(
        "Unsplash API key missing. Set UNSPLASH_ACCESS_KEY to use the official API. See https://unsplash.com/documentation#search-photos"
      )
    }

    const params = new URLSearchParams({
      query,
      per_page: count.toString(),
      client_id: UNSPLASH_ACCESS_KEY,
    })

    if (orientation) {
      params.append("orientation", orientation)
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: {
          "Accept-Version": "v1",
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Unsplash API error: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()

    const photos = data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      full: photo.urls.full,
      alt: photo.alt_description || photo.description || "Photo",
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      width: photo.width,
      height: photo.height,
      likes: photo.likes,
      description: photo.description,
      color: photo.color,
    }))

    return {
      query,
      total: data.total as number | undefined,
      totalPages: data.total_pages as number | undefined,
      photos,
      count: photos.length,
    }
  },
})

export interface Photo {
  id: string
  url: string
  thumb: string
  full: string
  alt: string
  photographer: string
  photographerUrl: string
  width: number
  height: number
  likes: number
  description: string | null
  color: string
}

export interface SearchPhotosResult {
  query: string
  total?: number
  totalPages?: number
  photos: Photo[]
  count: number
}

export default searchPhotosTool

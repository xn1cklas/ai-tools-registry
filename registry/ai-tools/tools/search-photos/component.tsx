"use client"

import * as React from "react"
import type { SearchPhotosResult, Photo } from "./tool"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/ai-tools/ui/card"

export function SearchPhotosDisplay({ data }: { data: SearchPhotosResult }) {
  const [selectedPhoto, setSelectedPhoto] = React.useState<Photo | null>(null)

  const totalText =
    typeof data.total === "number"
      ? `${data.total.toLocaleString()} photos found`
      : undefined

  // For the homepage demo, show only 2 photos
  const displayedPhotos = React.useMemo(
    () => data.photos.slice(0, 2),
    [data.photos]
  )
  const shownCount = displayedPhotos.length

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Photo Search Results</h3>
          <p className="text-sm text-muted-foreground">
            "{data.query}"{totalText ? ` - ${totalText}` : ""}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {shownCount}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedPhotos.map((photo) => (
          <Card
            key={photo.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 right-2 text-white text-xs opacity-0 hover:opacity-100 transition-opacity">
                <div className="font-medium">{photo.photographer}</div>
                <div className="flex items-center gap-2">
                  <span>❤️ {photo.likes}</span>
                  <span>
                    📐 {photo.width}×{photo.height}
                  </span>
                </div>
              </div>
            </div>
            <CardContent className="p-3">
              <div className="text-sm font-medium line-clamp-2">
                {photo.alt}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                by{" "}
                <a
                  href={photo.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {photo.photographer}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-background">
            <div className="relative">
              <img
                src={selectedPhoto.full}
                alt={selectedPhoto.alt}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {selectedPhoto.alt}
              </h3>
              {selectedPhoto.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedPhoto.description}
                </p>
              )}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span>❤️ {selectedPhoto.likes} likes</span>
                  <span>
                    📐 {selectedPhoto.width}×{selectedPhoto.height}
                  </span>
                </div>
                <a
                  href={selectedPhoto.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Photo by {selectedPhoto.photographer}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPhotosDisplay

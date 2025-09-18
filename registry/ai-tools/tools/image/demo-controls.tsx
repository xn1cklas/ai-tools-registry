"use client"

import * as React from "react"

export type ImageDemoControls = {
  count: number
  aspectRatio: string
}

export const ImageDemoControlsContext = React.createContext<ImageDemoControls>({
  count: 3,
  aspectRatio: "1:1",
})

export const ImageDemoControlsProvider = ({
  value,
  children,
}: {
  value: ImageDemoControls
  children: React.ReactNode
}) => (
  <ImageDemoControlsContext.Provider value={value}>
    {children}
  </ImageDemoControlsContext.Provider>
)

export const useImageDemoControls = () =>
  React.useContext(ImageDemoControlsContext)

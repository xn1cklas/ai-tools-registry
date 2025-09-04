import { featureFlags } from "@/lib/feature-flags"
import PlaygroundClient from "./client"
import { notFound } from "next/navigation"

export default function PlaygroundPage() {
  if (!featureFlags.playgroundEnabled) {
    return notFound()
  }
  return <PlaygroundClient />
}

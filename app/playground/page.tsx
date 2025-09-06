import { featureFlags } from "@/lib/feature-flags"
import PlaygroundClient from "./client"
import { notFound } from "next/navigation"
import LiveChat from "./live"

export default function PlaygroundPage() {
  if (!featureFlags.playgroundEnabled) {
    return notFound()
  }

  if (process.env.AI_GATEWAY_API_KEY) {
    return <LiveChat />
  }

  return <PlaygroundClient />
}

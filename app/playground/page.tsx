import { featureFlags } from "@/lib/feature-flags"
import PlaygroundClient from "./client"
import { notFound } from "next/navigation"
import { loadDemosFromRegistry } from "@/lib/demos-helpers"
import { getRegistryItemFromJson as getItemFromHome } from "../page"

export default async function PlaygroundPage() {
  const demos = await loadDemosFromRegistry()

  if (!featureFlags.playgroundEnabled) {
    return notFound()
  }
  const tools = await Promise.all(
    demos.entries.map(async (name) => {
      const item = await getItemFromHome(name)
      return { name, label: item?.title || name }
    })
  )
  return <PlaygroundClient tools={tools} />
}

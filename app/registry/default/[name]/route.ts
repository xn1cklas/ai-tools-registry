import { getItemFromRegistry } from "@/lib/registry"
import { NextResponse } from "next/server"

// Use the registry.json file to generate static paths.
export const generateStaticParams = async () => {
  const registryData = await import("@/registry.json")
  const registry = registryData.default

  return registry.items.map((item) => ({
    name: item.name,
  }))
}

// This shows an example for serving a registry item using a route handler.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const registryItem = await getItemFromRegistry(name)

    // If the component is not found, return a 404 error.
    if (!registryItem) {
      return NextResponse.json(
        { error: "Item not found in registry." },
        { status: 404 }
      )
    }

    // Return the component with the files.
    return NextResponse.json(registryItem)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

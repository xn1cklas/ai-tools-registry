import { getItemFromRegistry } from "@/lib/registry"
import { NextResponse } from "next/server"

export const generateStaticParams = async () => {
  const registryData = await import("@/registry.json")
  const registry = registryData.default

  return registry.items.map((item) => ({
    name: item.name,
  }))
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const apiKey = request.headers.get("x-api-key")

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Invalid or missing authentication credentials",
        },
        { status: 401 }
      )
    }

    if (apiKey !== "xyz789") {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Invalid or missing authentication credentials",
        },
        { status: 401 }
      )
    }

    const { name } = await params
    const registryItem = await getItemFromRegistry(name)

    if (!registryItem) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: `Component '${name}' not found in registry`,
        },
        { status: 404 }
      )
    }

    return NextResponse.json(registryItem)
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

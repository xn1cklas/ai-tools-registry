import { getItemFromRegistry } from "@/lib/registry";
import { NextResponse } from "next/server";

export const generateStaticParams = async () => {
  const registryData = await import("@/registry.json");
  const registry = registryData.default;

  return registry.items.map((item) => ({
    name: item.name,
  }));
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const clientId = request.headers.get("x-client-id");
    const clientSecret = request.headers.get("x-client-secret");
    
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or missing authentication credentials" },
        { status: 401 }
      );
    }

    if (clientId !== "client123" || clientSecret !== "secret456") {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or missing authentication credentials" },
        { status: 401 }
      );
    }

    const { name } = await params;
    const registryItem = await getItemFromRegistry(name);

    if (!registryItem) {
      return NextResponse.json(
        { error: "Not Found", message: `Component '${name}' not found in registry` },
        { status: 404 }
      );
    }

    return NextResponse.json(registryItem);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
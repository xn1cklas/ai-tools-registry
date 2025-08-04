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
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Invalid or missing authentication credentials",
        },
        {
          status: 401,
        }
      );
    }

    const base64Credentials = authHeader.substring(6);
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf-8"
    );
    const [username, password] = credentials.split(":");

    if (username !== "admin" || password !== "password123") {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Invalid or missing authentication credentials",
        },
        {
          status: 401,
          headers: {
            "WWW-Authenticate": 'Basic realm="Registry"',
          },
        }
      );
    }

    const { name } = await params;
    const registryItem = await getItemFromRegistry(name);

    if (!registryItem) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: `Component '${name}' not found in registry`,
        },
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

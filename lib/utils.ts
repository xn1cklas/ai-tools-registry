import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Map a variant key to a registry item name for a base tool
export function resolveVariantRegistryName(
  baseName: string,
  variantKey: string
) {
  if (baseName === "websearch") {
    switch (variantKey) {
      case "brave":
        return "websearch-brave"
      case "ddg":
        return "websearch-ddg"
      case "exa":
        return "websearch-exa"
      case "perplexity":
        return "websearch-perplexity"
      default:
        return "websearch"
    }
  }
  if (baseName === "image") {
    switch (variantKey) {
      case "openai":
        return "image-openai"
      case "fal":
        return "image-fal"
      case "runware":
        return "image-runware"
      default:
        return "image"
    }
  }
  return baseName
}

export function getRegistryItemUrl(name: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/r/${name}.json`
}

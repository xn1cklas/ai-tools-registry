import * as React from "react"
import fs from "fs/promises"
import path from "path"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default async function ToolDocsPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  // Convention: per-tool docs at registry/ai-tools/tools/{name}/README.md
  const docsPath = path.join(
    process.cwd(),
    "registry/ai-tools/tools",
    name,
    "README.md"
  )

  let content: string | null = null
  try {
    content = await fs.readFile(docsPath, "utf8")
  } catch {
    // No docs for this tool
    notFound()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 prose prose-neutral dark:prose-invert">
      <h1 className="mb-4 text-2xl font-semibold">{name} Docs</h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content!}</ReactMarkdown>
    </main>
  )
}

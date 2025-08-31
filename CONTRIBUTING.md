# Contributing to AI Tools Registry

Thanks for your interest in contributing tools and components. This guide explains exactly where a new tool must be added so it can be discovered, installed via the shadcn CLI, rendered on the site, and included in packs.

If anything is unclear or you spot opportunities to improve the workflow, please open an issue or PR.

## Prerequisites

- Node.js 18+
- pnpm 8+
- Set `NEXT_PUBLIC_BASE_URL` in `.env` (used for metadata/OG images)

Useful commands:

- `pnpm dev` – run the local site
- `pnpm build` – typecheck + build (Next/ESLint)
- `pnpm lint` – lint only

## Tool Layout (Colocation)

Each tool lives under `registry/ai-tools/tools/{tool}/` and typically provides:

- `tool.ts` – the tool definition (server-side), including a Zod `inputSchema` and an `execute` function.
- `component.tsx` (optional) – a React client component for rendering a tool result in a chat UI or demo.

Colocation keeps import paths simple. For example, a component can type-import from `"./tool"`:

```tsx
// registry/ai-tools/tools/weather/component.tsx
import type { GetWeatherResult } from "./tool"
```

## Exact Places to Update for a New Tool

1. Create the tool files

- Add `registry/ai-tools/tools/{tool}/tool.ts`
- (Optional) Add `registry/ai-tools/tools/{tool}/component.tsx` with `"use client"`
- Keep names consistent: the folder name is the registry item name

2. Export (optional but recommended)

- Add a named export in `registry/ai-tools/tools/index.ts` if you want a central index:

```ts
export * from "./{tool}/tool"
// export * from "./{tool}/component" // if you need to re-export the renderer
```

3. Register the tool for installation (REQUIRED)

- Add an item in the root `registry.json`. Use the folder name as `name` and include one or more `registry:file` entries with a `target` that colocates files in the consumer’s project:

```jsonc
{
  "name": "{tool}",
  "type": "registry:component",
  "title": "{Human Friendly Title}",
  "description": "{Short description}",
  // Optional: add any npm deps this tool needs
  "dependencies": ["zod", "ai"],
  // Optional: add ui primitives used by your renderer
  "registryDependencies": ["@ai-tools/card"],
  "files": [
    {
      "path": "registry/ai-tools/tools/{tool}/tool.ts",
      "type": "registry:file",
      "target": "~/ai/tools/{tool}/tool.ts",
    },
    {
      "path": "registry/ai-tools/tools/{tool}/component.tsx",
      "type": "registry:file",
      "target": "~/ai/tools/{tool}/component.tsx",
    },
  ],
}
```

Important: For `type: "registry:file"`, `target` is REQUIRED by the schema.

4. Add to the homepage (optional)

The homepage showcases selected tools and provides copyable code.

- Update the `toolNames` array in `app/page.tsx` to include your tool’s name (the folder name). This controls both the per-tool demo sections and the “All Tools” grid.
- If you want a custom demo card with sample output and a component renderer, follow the existing sections as a template (e.g., Weather/News). Provide a demo data fallback so the page renders without external calls.

5. Add to the Tool Pack (optional)

The tool pack installs a curated set of tools via a single item.

- In `registry.json`, update the `tool-pack` item’s `registryDependencies` to include your tool as `"@ai-tools/{tool}"` if you want it bundled.

## Quality & Schema Checks

Please verify these points before opening a PR:

- `registry.json` has a correct entry for your tool:
  - `name` matches folder name
  - every `registry:file` has a `target`
  - every `files[*].path` exists in this repo
- The tool’s `tool.ts` uses Zod for input validation and well-typed return values (no `any`).
- The optional `component.tsx` is marked with `"use client"` and uses stable UI primitives (`@/registry/ai-tools/ui/*`) as needed.
- If you import types in the renderer, prefer `import type { ... } from "./tool"` to avoid bundling server code.
- Add clear `title` and `description` in `registry.json` — these are shown in the site and CLI search.

## Testing Locally

- Open `http://localhost:3003`
- Verify your tool appears on the homepage (if added to `toolNames`)
- Fetch via API: `GET /api/registry/public/{name}` (e.g., `/api/registry/public/weather`) and confirm the JSON contains `files[*].content`.

## Naming & Dependencies

- Keep tool names short, lowercase, and folder-aligned: `weather`, `news`, `time`, `markdown`, `websearch`.
- Common dependencies:
  - `ai` and `zod` for tool logic
  - `react-markdown` + `remark-gfm` for markdown renderers (optional)

## Docs & Rules

- The repository includes registry “rules” that are installable into a project as `.cursor/rules/registry.mdc`. These guidelines are tailored for AI tools (colocation, naming, Zod, targets). If your tool implies new best practices, propose an update there too:
  - `registry/ai-tools/rules/registry.mdc`
  - `public/r/rules.json` and `public/r/style.json` content blocks

## Submitting a PR

1. Fork and create a feature branch.
2. Implement the tool + registry entry, and update the homepage/tool pack if desired.
3. Run local checks (`pnpm build`, `pnpm lint`).
4. Open a PR with:
   - A brief description
   - The tool name and purpose
   - Any dependencies and usage notes

Thank you for helping improve the AI Tools Registry!

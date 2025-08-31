# AI Tools Registry — Project Guidelines

## Discovery and installation

1. Always check the registry before building a tool from scratch.
   - Use the remote registry: `https://ai-tools-registry.vercel.app/api/registry/public/{name}`
   - Install via CLI, for example:
     ```bash
     npx shadcn@latest add @ai-tools/weather
     npx shadcn@latest add @ai-tools/websearch
     ```

2. Use clear naming that matches folder names (e.g., `weather`, `news`, `time`).

## Colocation and boundaries

- Colocate tool logic and renderer:
  ```
  ~/ai/tools/{tool}/
    ├─ tool.ts        # server/tool logic
    └─ component.tsx  # optional client renderer
  ```
- Mark renderers with `"use client"`. Avoid importing client components from server-only contexts.
- Keep side effects (network I/O) inside tool `execute` on the server; pass plain data to the renderer.

## Schemas and types

- Validate all input/output using Zod; avoid `any`.
- Ensure every `registry:file` has a `target`. Verify `files[*].path` exists.

## Dependencies

- Tools usually depend on `ai` and `zod`.
- Renderers may use `react-markdown` + `remark-gfm` when helpful.

## Quality checks

- After installation, verify imports, types, and behavior.
- Keep changes minimal and consistent with existing code conventions.

# AI Tools Registry

This is an example registry built using `shadcn/ui`.

It now also includes an installable AI Tools registry (for Node.js) based on the Vercel AI SDK Tool Calling APIs. Tools are distributed as plain files that you can add to your project using the shadcn CLI. Where helpful, a small React component is included to render a tool result (e.g. a weather card).

## Website

Visit the live website: [https://ai-tools-registry.vercel.app/](https://ai-tools-registry.vercel.app/)

![AI Tools Registry Website](https://github.com/user-attachments/assets/96f2480d-d9a2-4100-8958-95ae90f40a4a)

## Usage

To install components from the ai-tools registry, add a remote registries config in your `components.json` file (replace the URL with your deployment):

```json
{
  "registries": {
    "@ai-tools": "https://ai-tools-registry.vercel.app/api/registry/public/{name}"
  }
}
```

You can then add items using the following command:

```bash
npx shadcn@latest add @ai-tools/web-search
```

### AI Tools

Example tools you can install:

- `@ai-tools/weather` – AI SDK tool + `WeatherCard` renderer
- `@ai-tools/calculator` – simple calculator tool
- `@ai-tools/translate` – sample translate tool
- `@ai-tools/news` – sample news search tool + `NewsList` renderer
- `@ai-tools/time` – current time for a timezone
- `@ai-tools/stats` – display data using `recharts`

Install a tool (example):

```bash
npx shadcn@latest add @ai-tools/weather
```

Or install a pack of all tools:

```bash
npx shadcn@latest add @ai-tools/tool-pack
```

Note: The example tools import from `ai` (AI SDK v5) and `zod`. Ensure your app provides these dependencies.

### Web Search provider

The `@ai-tools/websearch` tool uses DuckDuckGo Instant Answer by default (no key required). If you set `BRAVE_SEARCH_API_KEY` in your environment, it will automatically use the Brave Search API instead.

## Authentication

To see examples of how to use authentication with the registry, see the [API Routes](./app/api/registry/README.md) documentation.

## Development

Clone the repository, then install the dependencies and run the development server.

```bash
pnpm install
pnpm dev
```

The development server will be available at `http://localhost:3003`.

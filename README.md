# AI Tools Registry

This is an example registry built using `shadcn/ui`.

It now also includes an installable AI Tools registry (for Node.js) based on the Vercel AI SDK Tool Calling APIs. Tools are distributed as plain files that you can add to your project using the shadcn CLI. Where helpful, a small React component is included to render a tool result (e.g. a weather card).

## Website

Visit the live website: [https://ai-tools-registry.vercel.app/](https://ai-tools-registry.vercel.app/)

![AI Tools Registry Website](@ai-tools-website.png)

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
npx shadcn@latest add @ai-tools/login-form
```

To install the `ai-tools` design system, you can use the following command:

```bash
npx shadcn@beta add @ai-tools/design-system
```

### AI Tools

Example tools you can install:

- `@ai-tools/weather` – AI SDK tool + `WeatherCard` renderer
- `@ai-tools/calculator` – simple calculator tool
- `@ai-tools/translate` – sample translate tool
- `@ai-tools/news` – sample news search tool + `NewsList` renderer
- `@ai-tools/time` – current time for a timezone

Install a tool (example):

```bash
npx shadcn@latest add @ai-tools/weather
```

Or install a pack of all tools:

```bash
npx shadcn@latest add @ai-tools/tool-pack
```

Note: The example tools import from `ai` (AI SDK v3) and `zod`. Ensure your app provides these dependencies.

## Authentication

To see examples of how to use authentication with the registry, see the [API Routes](./app/api/registry/README.md) documentation.

## Development

Clone the repository, then install the dependencies and run the development server.

```bash
pnpm install
pnpm dev
```

The development server will be available at `http://localhost:3003`.

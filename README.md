# Alpine Registry

This is an example registry built using `shadcn/ui`.

It now also includes an installable AI Tools registry (for Node.js) based on the Vercel AI SDK Tool Calling APIs. Tools are distributed as plain files that you can add to your project using the shadcn CLI. Where helpful, a small React component is included to render a tool result (e.g. a weather card).

## Usage

To install components from the alpine registry, you can use the following remote registries config in your `components.json` file:

```json
{
  "registries": {
    "@alpine": "https://alpine-registry.vercel.app/api/registry/public/{name}"
  }
}
```

You can then add items using the following command:

```bash
npx shadcn@latest add @alpine/login-form
```

To install the `alpine` design system, you can use the following command:

```bash
npx shadcn@beta add @alpine/design-system
```

### AI Tools

Example tools you can install:

- `@alpine/tool-get-weather` – AI SDK tool + `WeatherCard` renderer
- `@alpine/tool-calculator` – simple calculator tool
- `@alpine/tool-translate` – sample translate tool
- `@alpine/tool-news-search` – sample news search tool + `NewsList` renderer
- `@alpine/tool-time-now` – current time for a timezone

Install a tool (example):

```bash
npx shadcn@latest add @alpine/tool-get-weather
```

Or install a pack of all tools:

```bash
npx shadcn@latest add @alpine/tool-pack
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

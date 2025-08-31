# Project Instructions

## Best Practices for Using shadcn MCP server

1. **Always Check Registry First**
   - Before creating custom components, search the registry for existing solutions
   - Use `mcp_shadcn_search_items_in_registries` to find relevant components
   - Check `mcp_shadcn_list_items_in_registries` to see all available options

2. **Component Discovery Workflow**
   - Start with semantic search using `mcp_shadcn_search_items_in_registries`
   - View detailed component info with `mcp_shadcn_view_items_in_registries`
   - Get usage examples with `mcp_shadcn_get_item_examples_from_registries`
   - Use `mcp_shadcn_get_add_command_for_items` to get installation commands

3. **Component Installation**
   - Use the provided add commands from the registry
   - Ensure components are properly imported and configured
   - Do not install example- components directly, use them as reference to create your components.
   - Follow the component's usage examples for proper implementation
   - Do not overwrite ui or registry/ui components unless the user has specifically asked for it

## Quality Assurance

- Always test registry components after installation
- Verify imports and dependencies are correct
- Check that styling integrates with your existing design
- If using next/image, make sure images.remotePatterns is configured in next.config.ts

```tsx
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
}

export default nextConfig
```

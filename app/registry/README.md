# Registry Routes

This is example code for using route handlers to serve your registry. Each route handler implements a different authentication method.

## Routes

- `public/[name]/route.ts`: no authentication
- `api/[name]/route.ts`: uses API key authentication
- `bearer/[name]/route.ts`: uses Bearer token authentication
- `basic/[name]/route.ts`: uses Basic authentication
- `query/[name]/route.ts`: uses query parameters authentication
- `custom/[name]/route.ts`: uses custom authentication

## Usage

To test the routes, you can use the following remote registries config in your `components.json` file:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": {
    "@public": "http://localhost:3003/registry/public/{name}",
    "@bearer": {
      "url": "http://localhost:3003/registry/bearer/{name}",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_BEARER_TOKEN}"
      }
    },
    "@apikey": {
      "url": "http://localhost:3003/registry/apikey/{name}",
      "headers": {
        "X-API-Key": "${REGISTRY_API_KEY}"
      }
    },
    "@query": {
      "url": "http://localhost:3003/registry/query/{name}",
      "params": {
        "token": "${REGISTRY_QUERY_TOKEN}"
      }
    },
    "@custom": {
      "url": "http://localhost:3003/registry/custom/{name}",
      "headers": {
        "X-Client-Id": "${REGISTRY_CLIENT_ID}",
        "X-Client-Secret": "${REGISTRY_CLIENT_SECRET}"
      }
    },
    "@basic": {
      "url": "http://localhost:3003/registry/basic/{name}",
      "headers": {
        "Authorization": "Basic ${REGISTRY_BASIC_AUTH}"
      }
    }
  }
}
```

Add the following environment variables to your `.env` file:

```env
REGISTRY_BEARER_TOKEN=abc123
REGISTRY_API_KEY=xyz789
REGISTRY_QUERY_TOKEN=secret123
REGISTRY_CLIENT_ID=client123
REGISTRY_CLIENT_SECRET=secret456
REGISTRY_BASIC_AUTH=YWRtaW46cGFzc3dvcmQxMjM=
```

Then use the following command to install components:

- `public`: `npx shadcn@latest add @public/login-form`
- `bearer`: `npx shadcn@latest add @bearer/login-form`
- `apikey`: `npx shadcn@latest add @apikey/login-form`
- `query`: `npx shadcn@latest add @query/login-form`
- `custom`: `npx shadcn@latest add @custom/login-form`
- `basic`: `npx shadcn@latest add @basic/login-form`

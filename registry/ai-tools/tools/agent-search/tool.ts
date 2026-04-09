import { UIToolInvocation, tool } from "ai"
import { z } from "zod"

export const AgentItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  capabilities: z.array(z.string()).optional(),
  website: z.string().optional(),
  protocol: z.enum(["mcp", "a2a", "agents_txt"]).optional(),
})

export const AgentSearchSchema = z.object({
  query: z.string(),
  count: z.number(),
  agents: z.array(AgentItemSchema),
})

export type AgentItem = z.infer<typeof AgentItemSchema>
export type AgentSearchResult = z.infer<typeof AgentSearchSchema>

export const agentSearchTool = tool({
  name: "agent-search",
  description:
    "Search for AI agents across MCP, A2A, and agents.txt protocols via the Global Chat directory. " +
    "Covers 18,000+ MCP servers, A2A agents from Google/Salesforce/Pinterest, and agents.txt endpoints.",
  inputSchema: z.object({
    query: z
      .string()
      .min(1)
      .describe(
        "Search query to find agents by name, description, or capabilities"
      ),
    type: z
      .string()
      .optional()
      .describe(
        "Filter by agent type (e.g. 'defi', 'social', 'data', 'infra', 'trading', 'governance')"
      ),
    protocol: z
      .enum(["mcp", "a2a", "agents_txt"])
      .optional()
      .describe("Filter by discovery protocol: mcp, a2a, or agents_txt"),
  }),
  outputSchema: AgentSearchSchema,
  execute: async ({ query, type, protocol }) => {
    const baseUrl = "https://global-chat.io"
    const agents: AgentItem[] = []

    if (!protocol || protocol === "mcp" || protocol === "agents_txt") {
      const params = new URLSearchParams()
      if (type) params.set("type", type)
      const apiUrl = `${baseUrl}/api/agents${params.toString() ? `?${params}` : ""}`
      const res = await fetch(apiUrl)
      if (res.ok) {
        const data = (await res.json()) as {
          agents?: Record<string, unknown>[]
        }
        const q = query.toLowerCase()
        const filtered = (data.agents || []).filter((agent) => {
          const name = String(agent.name || "").toLowerCase()
          const desc = String(agent.description || "").toLowerCase()
          const caps = Array.isArray(agent.capabilities)
            ? agent.capabilities.join(" ").toLowerCase()
            : ""
          return name.includes(q) || desc.includes(q) || caps.includes(q)
        })
        for (const agent of filtered) {
          agents.push({
            name: String(agent.name || ""),
            description: agent.description
              ? String(agent.description)
              : undefined,
            type: agent.type ? String(agent.type) : undefined,
            capabilities: Array.isArray(agent.capabilities)
              ? agent.capabilities.map(String)
              : undefined,
            website: agent.website ? String(agent.website) : undefined,
            protocol: "mcp",
          })
        }
      }
    }

    if (!protocol || protocol === "a2a") {
      const params = new URLSearchParams()
      params.set("q", query)
      const res = await fetch(`${baseUrl}/api/agents/a2a?${params.toString()}`)
      if (res.ok) {
        const data = (await res.json()) as {
          agents?: Record<string, unknown>[]
        }
        for (const agent of data.agents || []) {
          agents.push({
            name: String(agent.name || ""),
            description: agent.description
              ? String(agent.description)
              : undefined,
            type: agent.type ? String(agent.type) : undefined,
            capabilities: Array.isArray(agent.capabilities)
              ? agent.capabilities.map(String)
              : undefined,
            website: agent.url ? String(agent.url) : undefined,
            protocol: "a2a",
          })
        }
      }
    }

    return { query, count: agents.length, agents }
  },
})

export type AgentSearchToolType = UIToolInvocation<typeof agentSearchTool>

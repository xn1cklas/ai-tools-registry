"use client"

import { Response } from "@/registry/ai-elements/response"
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/registry/ai-elements/tool"
import type { ToolUIPart } from "ai"
import type { ReactNode } from "react"

type Formatter = (output: unknown) => ReactNode

export function DynamicToolComponent({
  part,
  formatOutput,
}: {
  part: ToolUIPart
  formatOutput?: Formatter
}) {
  return (
    <Tool defaultOpen={true}>
      <ToolHeader type={part.type} state={part.state} />
      <ToolContent>
        <ToolInput input={part.input} />
        <ToolOutput
          output={JSON.stringify(part.output)}
          errorText={part.errorText}
        />
      </ToolContent>
    </Tool>
  )
}

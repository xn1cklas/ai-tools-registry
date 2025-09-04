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
  const render = formatOutput
    ? formatOutput
    : (o: unknown) => (
        // We are having some bundling issues with the Streamdown package, once that is resolved we convert the response to AI Elements Responses
        // <Response>
        <div>{"```json\n" + JSON.stringify(o ?? {}, null, 2) + "\n```}"}</div>
        // </Response >
      )

  return (
    <Tool defaultOpen={true}>
      <ToolHeader type={part.type} state={part.state} />
      <ToolContent>
        <ToolInput input={part.input} />
        <ToolOutput output={render(part.output)} errorText={part.errorText} />
      </ToolContent>
    </Tool>
  )
}

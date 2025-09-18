"use client"

import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/registry/ai-elements/prompt-input"

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
  ToolInput,
} from "@/registry/ai-elements/tool"
import { GlobeIcon, MicIcon } from "lucide-react"
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/registry/ai-elements/conversation"
import { Message, MessageContent } from "@/registry/ai-elements/message"
import { Response } from "@/registry/ai-elements/response"
import type { ToolUIPart } from "ai"
import { DynamicToolComponent } from "@/registry/ai-tools/tools/fallback/component"

const models = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "claude-opus-4-20250514", name: "Claude 4 Opus" },
]

// So I want to use this to actually test all Tool Calls.

const InputDemo = () => {
  const [text, setText] = useState<string>("")
  const [model, setModel] = useState<string>(models[0].id)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(
      { text: text },
      {
        body: {
          model: model,
        },
      }
    )
    setText("")
  }

  const { messages, status, sendMessage } = useChat()

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border flex-grow my-8">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    console.log(JSON.stringify(part))
                    switch (part.type) {
                      case "text":
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        )

                      default:
                        if (part.type.startsWith("tool-")) {
                          const data = part as ToolUIPart

                          return (
                            <DynamicToolComponent
                              key={message.id}
                              part={data}
                            />
                          )
                        }
                        return null
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputTextarea
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton>
                <MicIcon size={16} />
              </PromptInputButton>
              <PromptInputButton>
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value)
                }}
                value={model}
              >
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!text} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  )
}

export default InputDemo

"use client"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/registry/ai-elements/conversation"
import { Message, MessageContent } from "@/registry/ai-elements/message"
import {
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputAttachment,
  PromptInput,
  PromptInputBody,
  PromptInputAttachments,
  PromptInputActionMenuContent,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputActionMenuTrigger,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  type PromptInputMessage,
} from "@/registry/ai-elements/prompt-input"
import { MessageSquare } from "lucide-react"
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Response } from "@/registry/ai-elements/response"

const ConversationDemo = () => {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status } = useChat()

  const handleSubmit = (
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    const text = (message.text ?? input).trim()
    if (text) {
      sendMessage({ text })
      setInput("")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[600px]">
      <div className="flex flex-col h-full">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text": // we don't use any reasoning or tool calls in this example
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          )
                        default:
                          return null
                      }
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4 relative">
          <PromptInputBody>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => {
                setInput(e.target.value)
              }}
              value={input}
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
            </PromptInputTools>
            <PromptInputSubmit disabled={false} status={"ready"} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  )
}

export default ConversationDemo

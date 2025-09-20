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
  PromptInputActionMenuItem,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue,
} from "@/registry/ai-elements/prompt-input"
import { MessageSquare, X } from "lucide-react"
import { useState } from "react"
import type { ToolUIPart } from "ai"
import { useChat } from "@ai-sdk/react"
import { Response } from "@/registry/ai-elements/response"
import { WebSearchList } from "@/registry/ai-tools/tools/websearch/component"
import type { WebSearchToolInvocation } from "@/registry/ai-tools/tools/websearch"
import { DemoImageGrid } from "@/registry/ai-tools/tools/image/demo-wrapper"
import { ImageDemoControlsProvider } from "@/registry/ai-tools/tools/image/demo-controls"
import type {
  ImageToolType,
  ImageFalToolType,
  ImageOpenAIToolType,
  ImageRunwareToolType,
  ImageGatewayGeminiToolType,
} from "@/registry/ai-tools/tools/image"
import { NewsList } from "@/registry/ai-tools/tools/news/component"
import type { NewsToolType } from "@/registry/ai-tools/tools/news"
import { WeatherCard } from "@/registry/ai-tools/tools/weather/component"
import type { WeatherToolType } from "@/registry/ai-tools/tools/weather"
import { QRCodeDisplay } from "@/registry/ai-tools/tools/qrcode/component"
import type { QRCodeToolType } from "@/registry/ai-tools/tools/qrcode"
import { StatsChart } from "@/registry/ai-tools/tools/stats/component"
import type { StatsToolType } from "@/registry/ai-tools/tools/stats"
import { CurrencyDisplay } from "@/registry/ai-tools/tools/currency/component"
import type { CurrencyConverterOutputSchemaType } from "@/registry/ai-tools/tools/currency"
import {
  Tool as ToolContainer,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/registry/ai-elements/tool"

import {
  Cloud,
  Newspaper,
  Search,
  BarChart3,
  QrCode,
  Image as ImageIcon,
  CircleDollarSign,
} from "lucide-react"
import { CurrencyConverterToolType } from "@/registry/ai-tools/tools/currency/tool"

type ToolMeta = { name: string; label: string }

const ICONS: Record<string, React.ReactNode> = {
  weather: <Cloud className="size-4" />,
  news: <Newspaper className="size-4" />,
  websearch: <Search className="size-4" />,
  stats: <BarChart3 className="size-4" />,
  qrcode: <QrCode className="size-4" />,
  image: <ImageIcon className="size-4" />,
  currency: <CircleDollarSign className="size-4" />,
}

const PROVIDER_OPTIONS: Record<
  string,
  Array<{ value: string; label: string }>
> = {
  image: [
    { value: "image-openai", label: "OpenAI" },
    { value: "image-fal", label: "FAL" },
    { value: "image-runware", label: "Runware" },
    { value: "image-gemini", label: "Gemini" },
  ],
  websearch: [
    { value: "websearch-ddg", label: "DuckDuckGo" },
    { value: "websearch-brave", label: "Brave" },
    { value: "websearch-exa", label: "Exa" },
    { value: "websearch-perplexity", label: "Perplexity" },
    { value: "websearch-firecrawl", label: "Firecrawl" },
  ],
}

const ConversationDemo = ({ tools }: { tools?: ToolMeta[] }) => {
  const [input, setInput] = useState("")
  const { messages, status, sendMessage } = useChat()
  const [activeTool, setActiveTool] = useState<ToolMeta | null>(null)
  const [activeToolProvider, setActiveToolProvider] = useState<string | null>(
    null
  )
  const [imageCount, setImageCount] = useState<string>("1")
  const [imageAspect, setImageAspect] = useState<string>("1:1")

  const handleSubmit = (
    message: PromptInputMessage,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    const text = (message.text ?? input).trim()
    const hasText = Boolean(text)
    const hasAttachments = Boolean(message.files?.length)

    if (!(hasText || hasAttachments)) {
      return
    }

    sendMessage(
      { text: hasText ? text : "Sent with attachments", files: message.files },
      {
        body: {
          isLivemode: false,
          ...(activeToolProvider
            ? { activeToolProviderName: activeToolProvider }
            : {}),
          ...(activeTool
            ? {
                toolChoice: { type: "tool", toolName: activeTool.name },
                activeToolName: activeTool.name,
                activeToolParams:
                  activeTool.name === "image"
                    ? {
                        prompt: text,
                        n: Number(imageCount),
                        aspectRatio: imageAspect,
                      }
                    : undefined,
              }
            : {}),
        },
      }
    )
    setInput("")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-lg border h-[calc(100vh-84px)] lg:h-[calc(100vh-104px)] max-h-screen">
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
              messages.map((message) => {
                const isToolPart = (part: unknown): part is ToolUIPart => {
                  return (
                    !!part &&
                    typeof part === "object" &&
                    "state" in part &&
                    "type" in part &&
                    "toolCallId" in part
                  )
                }

                type TextPart = { type: "text"; text: string }
                const isTextPart = (part: unknown): part is TextPart => {
                  return (
                    !!part &&
                    typeof part === "object" &&
                    (part as { type?: unknown }).type === "text" &&
                    "text" in part
                  )
                }

                const textParts = message.parts.filter(isTextPart)
                const toolParts = message.parts.filter(isToolPart)

                return (
                  <div key={message.id}>
                    {textParts.length > 0 ? (
                      <Message from={message.role}>
                        <MessageContent>
                          {textParts.map((part, i) => (
                            <Response key={`${message.id}-text-${i}`}>
                              {part.text}
                            </Response>
                          ))}
                        </MessageContent>
                      </Message>
                    ) : null}

                    {toolParts.map((p, i) => {
                      const t = String(p.type || "")
                      if (t.startsWith("tool-websearch")) {
                        return (
                          <WebSearchList
                            key={`${message.id}-tool-${i}`}
                            invocation={p as WebSearchToolInvocation}
                          />
                        )
                      }
                      if (t.startsWith("tool-image")) {
                        return (
                          <ImageDemoControlsProvider
                            key={`${message.id}-tool-${i}`}
                            value={{
                              count: Number(imageCount) || 1,
                              aspectRatio: imageAspect,
                            }}
                          >
                            <DemoImageGrid
                              invocation={
                                p as
                                  | ImageToolType
                                  | ImageFalToolType
                                  | ImageOpenAIToolType
                                  | ImageRunwareToolType
                                  | ImageGatewayGeminiToolType
                              }
                            />
                          </ImageDemoControlsProvider>
                        )
                      }
                      if (t.startsWith("tool-news")) {
                        return (
                          <NewsList
                            key={`${message.id}-tool-${i}`}
                            invocation={p as NewsToolType}
                          />
                        )
                      }
                      if (t.startsWith("tool-weather")) {
                        return (
                          <WeatherCard
                            key={`${message.id}-tool-${i}`}
                            invocation={p as WeatherToolType}
                          />
                        )
                      }
                      if (t.startsWith("tool-qrcode")) {
                        return (
                          <QRCodeDisplay
                            key={`${message.id}-tool-${i}`}
                            invocation={p as QRCodeToolType}
                          />
                        )
                      }
                      if (t.startsWith("tool-stats")) {
                        return (
                          <StatsChart
                            key={`${message.id}-tool-${i}`}
                            invocation={p as StatsToolType}
                          />
                        )
                      }
                      if (t.startsWith("tool-currency")) {
                        return (
                          <CurrencyDisplay
                            key={`${message.id}-tool-${i}`}
                            invocation={p as CurrencyConverterToolType}
                          />
                        )
                      }
                      return (
                        <ToolContainer
                          key={`${message.id}-tool-${i}`}
                          defaultOpen
                        >
                          <ToolHeader
                            type={p.type as `tool-${string}`}
                            state={p.state}
                          />
                          <ToolContent>
                            <ToolInput input={p.input} />
                            <ToolOutput
                              output={p.output}
                              errorText={p.errorText}
                            />
                          </ToolContent>
                        </ToolContainer>
                      )
                    })}
                  </div>
                )
              })
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={handleSubmit}
          className="mt-0 relative"
          globalDrop
          multiple
        >
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
                  {tools?.map((t) => (
                    <PromptInputActionMenuItem
                      key={t.name}
                      onClick={() => {
                        setActiveTool(t)
                        if (t.name === "image") {
                          setActiveToolProvider("image-openai")
                        } else if (t.name === "websearch") {
                          setActiveToolProvider("websearch-ddg")
                        } else {
                          setActiveToolProvider(null)
                        }
                      }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <div className="mr-2">{ICONS[t.name]}</div>
                        <span>{t.label}</span>
                      </span>
                    </PromptInputActionMenuItem>
                  ))}
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              {activeTool ? (
                <>
                  <PromptInputButton
                    onClick={() => {
                      setActiveTool(null)
                      setActiveToolProvider(null)
                    }}
                    variant="secondary"
                    className="group"
                  >
                    <div className="mr-2 size-4 group-hover:hidden">
                      {ICONS[activeTool.name]}
                    </div>
                    <div className="mr-2 size-4 hidden group-hover:block">
                      <X className="size-4" />
                    </div>
                    <span>{activeTool.label}</span>
                  </PromptInputButton>
                  {activeTool.name === "image" ||
                  activeTool.name === "websearch" ? (
                    <div className="hidden md:flex items-center gap-2">
                      <PromptInputModelSelect
                        value={
                          activeToolProvider ??
                          (activeTool.name === "image"
                            ? "image-openai"
                            : "websearch-ddg")
                        }
                        onValueChange={setActiveToolProvider}
                      >
                        <PromptInputModelSelectTrigger className="w-[112px]">
                          <PromptInputModelSelectValue />
                        </PromptInputModelSelectTrigger>
                        <PromptInputModelSelectContent>
                          {PROVIDER_OPTIONS[activeTool.name]?.map((opt) => (
                            <PromptInputModelSelectItem
                              key={opt.value}
                              value={opt.value}
                            >
                              {opt.label}
                            </PromptInputModelSelectItem>
                          ))}
                        </PromptInputModelSelectContent>
                      </PromptInputModelSelect>
                    </div>
                  ) : null}
                  {activeTool.name === "image" ? (
                    <div className="hidden md:flex items-center gap-1">
                      <PromptInputModelSelect
                        value={imageCount}
                        onValueChange={setImageCount}
                      >
                        <PromptInputModelSelectTrigger className="w-[56px]">
                          <PromptInputModelSelectValue />
                        </PromptInputModelSelectTrigger>
                        <PromptInputModelSelectContent>
                          {["1", "2", "3", "4"].map((n) => (
                            <PromptInputModelSelectItem key={n} value={n}>
                              {n}
                            </PromptInputModelSelectItem>
                          ))}
                        </PromptInputModelSelectContent>
                      </PromptInputModelSelect>
                      <PromptInputModelSelect
                        value={imageAspect}
                        onValueChange={setImageAspect}
                      >
                        <PromptInputModelSelectTrigger className="w-[74px]">
                          <PromptInputModelSelectValue />
                        </PromptInputModelSelectTrigger>
                        <PromptInputModelSelectContent>
                          {["1:1", "3:2", "4:3", "16:9", "9:16"].map((r) => (
                            <PromptInputModelSelectItem key={r} value={r}>
                              {r}
                            </PromptInputModelSelectItem>
                          ))}
                        </PromptInputModelSelectContent>
                      </PromptInputModelSelect>
                    </div>
                  ) : null}
                </>
              ) : null}
            </PromptInputTools>
            <PromptInputSubmit disabled={false} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  )
}

export default ConversationDemo

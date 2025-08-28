import { AddCommand } from "@/components/add-command"
import { OpenInV0 } from "@/components/open-in-v0"
import * as React from "react"

import { blocks } from "@/components/blocks"
import registry from "@/registry.json"
import { Separator } from "@/registry/alpine/ui/separator"
import { registryItemSchema } from "shadcn/schema"

const getRegistryItemFromJson = React.cache((name: string) => {
  const registryItem = registry.items.find((item) => item.name === name)

  const result = registryItemSchema.safeParse(registryItem)
  if (!result.success) {
    return null
  }

  return result.data
})

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto flex flex-col px-4 py-8 flex-1 gap-8 md:gap-12">
      {blocks.map((block) => {
        const registryItem = getRegistryItemFromJson(block.name)
        if (!registryItem) {
          return null
        }

        return (
          <div key={registryItem.name} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-sm line-clamp-1 font-medium">
                  {registryItem.title}
                </div>
                <Separator
                  orientation="vertical"
                  className="!h-4 hidden lg:flex"
                />
                <div className="text-sm text-muted-foreground line-clamp-1 hidden lg:flex">
                  {registryItem.description}
                </div>
              </div>
              <div className="flex gap-2">
                <AddCommand registryItem={registryItem} />
                <OpenInV0 name={registryItem.name} className="w-fit" />
              </div>
            </div>
            <div className="flex items-center border rounded-lg justify-center min-h-[400px] p-4 md:p-10 relative bg-muted/30">
              <block.component />
            </div>
          </div>
        )
      })}
    </main>
  )
}

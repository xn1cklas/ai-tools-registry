"use client"

import * as React from "react"
import type { NewsSearchResult } from "../news-search"

export function NewsList({ data }: { data: NewsSearchResult }) {
  return (
    <div className="w-full max-w-lg rounded-xl border bg-white text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50">
      <div className="p-4 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">News</div>
        <div className="text-xs text-gray-400 dark:text-gray-500">Topic: {data.topic}</div>
      </div>
      <ul className="px-4 pb-4 space-y-2">
        {data.items.map((item) => (
          <li key={item.id} className="rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
            {item.url ? (
              <a href={item.url} className="font-medium hover:underline" target="_blank" rel="noreferrer">
                {item.title}
              </a>
            ) : (
              <span className="font-medium">{item.title}</span>
            )}
            {item.publishedAt && (
              <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.publishedAt).toLocaleString()}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NewsList

"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { posts } from "@/posts/posts-index"
import Link from "next/link"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const filteredPosts = query.trim()
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.description.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
          post.content.toLowerCase().includes(query.toLowerCase()),
      )
    : []

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索文章..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(e.target.value.trim().length > 0)
          }}
          onFocus={() => setIsOpen(query.trim().length > 0)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => {
              setQuery("")
              setIsOpen(false)
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-md shadow-lg z-20 max-h-96 overflow-y-auto">
            {filteredPosts.length > 0 ? (
              <div className="p-2">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block p-3 hover:bg-muted rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="font-medium text-sm">{post.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{post.description}</div>
                    <div className="flex gap-1 mt-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-sm text-muted-foreground text-center">没有找到相关文章</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

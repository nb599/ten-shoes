import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { posts } from "@/posts/posts-index"
import { SiteHeader } from "@/components/site-header"

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <section className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">天书</h1>
          <p className="text-muted-foreground mt-2">专注前端与 AI 的工程化落地与最佳实践。界面风格参考 GitHub。</p>
        </section>

        <section className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.slug} className={cn("border-[#30363d]/30")}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      <Link href={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">{post.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readingTime}</span>
                      <span>·</span>
                      <div className="flex gap-1 flex-wrap">
                        {post.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border px-2 py-0.5 bg-muted text-foreground border-[#30363d]/30"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm hover:underline whitespace-nowrap"
                    prefetch={false}
                  >
                    阅读 <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
      <footer className="border-t mt-12">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} 天书 (Ten Shoes)
        </div>
      </footer>
    </div>
  )
}

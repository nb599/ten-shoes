import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Calendar, MessageSquareText, ArrowLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"
import { getPostBySlug } from "@/posts/posts-index"
import { CommentSection } from "@/components/comment-section"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function BlogPostPage(props: { params: { slug: string } }) {
  const { slug } = props.params
  const post = getPostBySlug(slug)
  if (!post) return notFound()

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回首页
          </Button>
        </Link>
      </div>
      <main className="mx-auto max-w-3xl px-4 py-8 md:py-10">
        <article>
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{post.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
              <span>{"·"}</span>
              <span>{post.readingTime}</span>
              <span>{"·"}</span>
              <div className="flex gap-1 flex-wrap">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-2 py-0.5 bg-muted text-foreground border-[#30363d]/30 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </header>

          <Separator className="my-6" />

          <div className="prose prose-neutral max-w-none prose-pre:bg-muted prose-code:text-foreground">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <Separator className="my-8" />

          <section id="comments" className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquareText className="h-5 w-5" />
              <h2 className="text-lg font-medium">评论</h2>
            </div>
            <CommentSection slug={slug} />
          </section>
        </article>
      </main>
    </div>
  )
}

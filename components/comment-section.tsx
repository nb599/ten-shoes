import { cookies } from "next/headers"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import type { JSX } from "react"
import { MessageSquarePlus, LogIn, AlertTriangle, Reply } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { addCommentAction } from "@/app/server-actions"
import { getCurrentUser } from "@/lib/session"
import { sql } from "@/lib/db"

type CommentRow = {
  id: number
  post_slug: string
  user_id: number
  content: string
  created_at: string
  user_name: string | null
  user_email: string
  parent_id: number | null
}

function CommentForm({
  slug,
  parentId,
  placeholder = "友善交流，欢迎分享你的看法…",
  buttonText = "发表评论",
}: {
  slug: string
  parentId?: number
  placeholder?: string
  buttonText?: string
}) {
  return (
    <form action={addCommentAction} className="grid gap-3">
      <input type="hidden" name="slug" value={slug} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <Textarea name="content" placeholder={placeholder} required minLength={2} />
      <div className="flex justify-end">
        <Button type="submit" size="sm">
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </div>
    </form>
  )
}

function CommentItem({
  comment,
  slug,
  user,
  replies,
}: {
  comment: CommentRow
  slug: string
  user: any
  replies: CommentRow[]
}) {
  return (
    <Card className="border-[#30363d]/30">
      <CardContent className="p-4">
        <div className="text-sm font-medium">{comment.user_name ?? comment.user_email}</div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(comment.created_at), "yyyy-MM-dd HH:mm", { locale: zhCN })}
        </div>
        <p className="mt-2 text-sm whitespace-pre-wrap">{comment.content}</p>

        {user && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Reply className="h-3 w-3" />
              回复
            </summary>
            <div className="mt-2 pl-4 border-l-2 border-muted">
              <CommentForm
                slug={slug}
                parentId={comment.id}
                placeholder={`回复 ${comment.user_name ?? comment.user_email}...`}
                buttonText="回复"
              />
            </div>
          </details>
        )}

        {replies.length > 0 && (
          <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
            {replies.map((reply) => (
              <div key={reply.id} className="bg-muted/30 rounded-md p-3">
                <div className="text-sm font-medium">{reply.user_name ?? reply.user_email}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(reply.created_at), "yyyy-MM-dd HH:mm", { locale: zhCN })}
                </div>
                <p className="mt-1 text-sm whitespace-pre-wrap">{reply.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export async function CommentSection(props: { slug: string }): Promise<JSX.Element> {
  const slug = props.slug
  const cookieStore = await cookies()
  const user = await getCurrentUser(cookieStore)

  let rows: CommentRow[] = []
  let dbError = false
  try {
    rows = await sql<CommentRow>`
      SELECT c.id, c.post_slug, c.user_id, c.content, c.created_at, c.parent_id,
             u.name as user_name, u.email as user_email
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_slug = ${slug}
      ORDER BY c.created_at ASC
    `
  } catch (_e) {
    dbError = true
    rows = []
  }

  // 分离主评论和回复
  const mainComments = rows.filter((c) => !c.parent_id)
  const replies = rows.filter((c) => c.parent_id)

  return (
    <div className="grid gap-4">
      {dbError && (
        <Card>
          <CardContent className="p-4 text-sm text-amber-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>评论服务暂不可用，请检查数据库连接并在 /admin 完成初始化。</span>
          </CardContent>
        </Card>
      )}

      {user ? (
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-3">以 {user.name ?? user.email} 的身份评论</div>
            <CommentForm slug={slug} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>请登录后发表评论。</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {mainComments.length === 0 ? (
          <p className="text-sm text-muted-foreground">还没有评论，快来抢沙发～</p>
        ) : (
          mainComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              slug={slug}
              user={user}
              replies={replies.filter((r) => r.parent_id === comment.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

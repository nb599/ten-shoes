import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CheckCircle2, Database, ShieldAlert } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { getCurrentUser } from "@/lib/session"
import { sql } from "@/lib/db"
import { initDbAction } from "./actions"

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const cookieStore = await cookies()
  const user = await getCurrentUser(cookieStore)
  if (!user) redirect("/login?next=/admin")

  // Admin check: only first registered user can manage DB init
  const isAdmin = user.id === 1

  const [{ user_count }, { comment_count }] = await Promise.all([
    sql<{ user_count: number }>`SELECT COUNT(*)::int as user_count FROM users`,
    sql<{ comment_count: number }>`SELECT COUNT(*)::int as comment_count FROM comments`,
  ])

  const ok = searchParams?.ok === "1"

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <h1 className="text-2xl font-semibold">管理后台</h1>
        <p className="text-muted-foreground mt-1">数据库状态与初始化工具（仅管理员可用）</p>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>统计</CardTitle>
              <CardDescription>当前数据概览</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">用户数</div>
                <div className="text-2xl font-semibold mt-1">{user_count}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground">评论数</div>
                <div className="text-2xl font-semibold mt-1">{comment_count}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                数据库初始化
              </CardTitle>
              <CardDescription>首次部署后可在此创建表结构</CardDescription>
            </CardHeader>
            <CardContent>
              {isAdmin ? (
                <form action={initDbAction} className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    将创建 users 与 comments 表以及必要索引。可重复执行（幂等）。
                  </p>
                  <Button type="submit" className="w-full">
                    执行初始化
                  </Button>
                  {ok && (
                    <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      初始化完成
                    </div>
                  )}
                </form>
              ) : (
                <div className="rounded-md border p-4 text-sm text-amber-600 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  仅管理员可执行（默认规则：第一个注册的用户即管理员）
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

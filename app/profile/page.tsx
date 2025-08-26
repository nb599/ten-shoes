import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { User, Mail, Calendar, MessageSquare } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import { getCurrentUser } from "@/lib/session"
import { sql } from "@/lib/db"
import { updateProfileAction } from "@/app/server-actions"

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const user = await getCurrentUser(cookieStore)
  if (!user) redirect("/login")

  // 获取用户统计信息
  const [userStats] = await sql<{
    comment_count: number
    created_at: string
  }>`
    SELECT 
      COUNT(c.id)::int as comment_count,
      u.created_at::text
    FROM users u
    LEFT JOIN comments c ON c.user_id = u.id
    WHERE u.id = ${user.id}
    GROUP BY u.id, u.created_at
  `

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {/* 用户信息卡片 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                个人资料
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{user.name || "未设置昵称"}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats?.comment_count || 0}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    评论数
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userStats?.created_at ? new Date(userStats.created_at).getFullYear() : "2025"}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Calendar className="h-3 w-3" />
                    加入年份
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 编辑资料 */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>编辑资料</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateProfileAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">昵称</Label>
                  <Input id="name" name="name" defaultValue={user.name || ""} placeholder="设置你的昵称" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input id="email" name="email" type="email" defaultValue={user.email} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">邮箱地址不可修改</p>
                </div>
                <Button type="submit">保存修改</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

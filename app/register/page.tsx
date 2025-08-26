import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { registerAction } from "@/app/server-actions"
import { getCurrentUser } from "@/lib/session"
import { SiteHeader } from "@/components/site-header"

export default async function RegisterPage() {
  const cookieStore = await cookies()
  const user = await getCurrentUser(cookieStore)
  if (user) redirect("/")

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              注册天书
            </CardTitle>
            <CardDescription>创建你的天书账户，参与评论。</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={registerAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">昵称</Label>
                <Input id="name" name="name" placeholder="你的昵称" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input id="password" name="password" type="password" required minLength={6} />
              </div>
              <Button type="submit" className="w-full">
                创建账户
              </Button>
              <p className="text-sm text-muted-foreground">
                已有账号？{" "}
                <Link href="/login" className="underline">
                  去登录
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

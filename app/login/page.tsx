import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { Lock, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { loginAction } from "@/app/server-actions"
import { getCurrentUser } from "@/lib/session"
import { SiteHeader } from "@/components/site-header"
import { WalletLogin } from "@/components/wallet-login"

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const cookieStore = await cookies()
  const user = await getCurrentUser(cookieStore)
  if (user) {
    redirect("/")
  }

  const error = searchParams?.error as string

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-md px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              登录天书
            </CardTitle>
            <CardDescription>选择你喜欢的登录方式。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error === "oauth_failed" && "OAuth 登录失败"}
                {error === "oauth_not_configured" && "OAuth 未配置"}
                {error === "token_exchange_failed" && "令牌交换失败"}
                {error === "no_email" && "无法获取邮箱信息"}
                {error === "oauth_error" && "OAuth 登录出错"}
              </div>
            )}

            {/* 钱包登录 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">钱包登录</h3>
              <WalletLogin />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">或</span>
              </div>
            </div>

            {/* Google 登录 */}
            <div className="space-y-2">
              <Link href="/auth/google">
                <Button variant="outline" className="w-full bg-transparent">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  使用 Google 登录
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">或</span>
              </div>
            </div>

            {/* 邮箱密码登录 */}
            <form action={loginAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                邮箱登录
              </Button>
            </form>

            <p className="text-sm text-muted-foreground mt-4 text-center">
              没有账号？{" "}
              <Link href="/register" className="underline">
                去注册
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

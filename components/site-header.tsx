import Link from "next/link"
import { cookies } from "next/headers"
import { Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/session"
import { logoutAction } from "@/app/server-actions"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"

export async function SiteHeader() {
  const cookieStore = await cookies()
  const user = await getCurrentUser(cookieStore)

  return (
    <header className="bg-[#0d1117] text-white border-b border-[#30363d] dark:bg-[#0d1117] dark:border-[#30363d]">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            <span className="font-semibold">天书</span>
          </Link>
        </div>

        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/" className="text-sm text-white/80 hover:text-white px-2">
            主页
          </Link>
          {user ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <User className="h-4 w-4 mr-1" />
                  资料
                </Button>
              </Link>
              <form action={logoutAction}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-transparent text-white hover:bg-white/20"
                >
                  退出
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 hover:text-white">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-white text-[#0d1117] hover:bg-white/90">
                  注册
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

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
    <header className="bg-[#0d1117] text-white border-b border-[#30363d]">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Sun className="h-5 w-5 text-[#f59e0b]" />
            <span className="font-semibold text-[#f0f6fc]">天书</span>
          </Link>
        </div>

        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/" className="text-sm text-[#8b949e] hover:text-[#f0f6fc] px-2 transition-colors">
            主页
          </Link>
          {user ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="text-[#f0f6fc] hover:bg-[#21262d] hover:text-[#f0f6fc]">
                  <User className="h-4 w-4 mr-1" />
                  资料
                </Button>
              </Link>
              <form action={logoutAction}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#30363d] bg-transparent text-[#f0f6fc] hover:bg-[#21262d] hover:border-[#f59e0b]"
                >
                  退出
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-[#8b949e] hover:bg-[#21262d] hover:text-[#f0f6fc]">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-[#f59e0b] text-[#24292f] hover:bg-[#d97706] font-medium">
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

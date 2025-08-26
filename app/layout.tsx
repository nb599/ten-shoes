import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "天书 - Ten Shoes",
  description: "天书 (Ten Shoes) - 专注前端与 AI 的工程化落地与最佳实践",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <div className="flex-1">{children}</div>
        <footer className="border-t mt-auto">
          <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} 天书 - Ten Shoes
          </div>
        </footer>
      </body>
    </html>
  )
}

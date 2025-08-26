import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { createSessionCookie } from "@/lib/session"

type WalletLoginRequest = {
  address: string
  signature: string
  message: string
  walletType: string
}

export async function POST(request: NextRequest) {
  try {
    const { address, signature, walletType }: WalletLoginRequest = await request.json()

    // 更新钱包登录消息中的网站名称
    const message = `登录 天书 (Ten Shoes)\n\n地址: ${address}\n时间: ${new Date().toISOString().split("T")[0]}\n随机数: ${Math.random().toString(36).substring(7)}`

    if (!address || !signature || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 基本验证：检查消息是否包含地址
    if (!message.includes(address)) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 })
    }

    // 检查地址格式（以太坊地址）
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 })
    }

    // 检查用户是否存在，不存在则创建
    let user = await sql<{ id: number; email: string; name: string | null }>`
      SELECT id, email, name FROM users WHERE email = ${address}
    `

    if (user.length === 0) {
      // 创建新的钱包用户
      const displayName = `${walletType} 用户 (${address.slice(0, 6)}...${address.slice(-4)})`
      user = await sql<{ id: number; email: string; name: string | null }>`
        INSERT INTO users (email, name, password_hash, oauth_provider, oauth_id)
        VALUES (${address}, ${displayName}, '', 'wallet', ${address})
        RETURNING id, email, name
      `
    }

    const cookieStore = await cookies()
    await createSessionCookie(cookieStore, {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Wallet login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

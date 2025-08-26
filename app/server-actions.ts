"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import { createSessionCookie, clearSessionCookie, getCurrentUser } from "@/lib/session"

export async function registerAction(formData: FormData) {
  const name = (formData.get("name") as string | null)?.trim() || null
  const email = (formData.get("email") as string)?.toLowerCase().trim()
  const password = formData.get("password") as string

  if (!email || !password || password.length < 6) {
    throw new Error("参数不合法")
  }

  const existing = await sql<{ count: number }>`SELECT COUNT(*)::int as count FROM users WHERE email = ${email}`
  if (existing[0]?.count > 0) {
    throw new Error("该邮箱已注册")
  }

  const hash = await bcrypt.hash(password, 10)
  const rows = await sql<{ id: number; email: string; name: string | null }>`
    INSERT INTO users (email, password_hash, name) VALUES (${email}, ${hash}, ${name})
    RETURNING id, email, name
  `
  const user = rows[0]
  if (!user) throw new Error("注册失败")

  const cookieStore = await cookies()
  await createSessionCookie(cookieStore, { id: user.id, email: user.email, name: user.name })
  redirect("/")
}

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim()
  const password = formData.get("password") as string

  if (!email || !password) {
    throw new Error("请输入邮箱与密码")
  }

  const rows = await sql<{ id: number; email: string; name: string | null; password_hash: string }>`
    SELECT id, email, name, password_hash FROM users WHERE email = ${email}
  `
  const user = rows[0]
  if (!user) {
    throw new Error("用户不存在")
  }

  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) {
    throw new Error("密码错误")
  }

  const cookieStore = await cookies()
  await createSessionCookie(cookieStore, { id: user.id, email: user.email, name: user.name })
  redirect("/")
}

export async function logoutAction() {
  const cookieStore = await cookies()
  await clearSessionCookie(cookieStore)
  redirect("/")
}

export async function addCommentAction(formData: FormData) {
  const slug = (formData.get("slug") as string)?.trim()
  const content = (formData.get("content") as string)?.trim()
  const parentId = formData.get("parentId") ? Number(formData.get("parentId")) : null

  if (!slug || !content || content.length < 2) {
    throw new Error("评论内容过短")
  }

  const cookieStore = await cookies()
  const user = await getCurrentUser(cookieStore)
  if (!user?.id) {
    throw new Error("请先登录")
  }

  await sql`
    INSERT INTO comments (post_slug, user_id, content, parent_id)
    VALUES (${slug}, ${user.id}, ${content}, ${parentId})
  `

  // 刷新页面以显示新评论
  revalidatePath(`/blog/${slug}`)
}

export async function updateProfileAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim() || null

  const cookieStore = await cookies()
  const user = await getCurrentUser(cookieStore)
  if (!user?.id) {
    throw new Error("请先登录")
  }

  await sql`
    UPDATE users SET name = ${name} WHERE id = ${user.id}
  `

  // 更新 session cookie
  await createSessionCookie(cookieStore, { id: user.id, email: user.email, name })

  revalidatePath("/profile")
  redirect("/profile?updated=1")
}

"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function initDbAction() {
  const cookieStore = await cookies()
  const user = await getCurrentUser(cookieStore)
  // Simple gate: only user with id = 1 can init
  if (!user || user.id !== 1) {
    throw new Error("无权限执行该操作（仅管理员可用）")
  }

  // Run the same schema as scripts/001_init.sql
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_slug TEXT NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_slug);
    CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
  `
  redirect("/admin?ok=1")
}

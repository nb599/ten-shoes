import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Set it in your Vercel project settings.")
}

// 为 Lighthouse CI 提供一个虚拟的数据库连接
const databaseUrl = process.env.DATABASE_URL || 'postgresql://lighthouse:lighthouse@localhost:5432/lighthouse'

export const sql = neon(databaseUrl)

import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Set it in your Vercel project settings.")
}

export const sql = neon(process.env.DATABASE_URL || "")

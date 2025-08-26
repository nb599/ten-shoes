import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error("Missing DATABASE_URL")
  process.exit(1)
}

const sql = neon(databaseUrl)

async function main() {
  console.log("Creating tables (if not exist)...")
  await sql(`
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
  `)

  const email = "admin@example.com"
  const name = "Admin"
  const password = "Password123!"
  const hash = await bcrypt.hash(password, 10)

  console.log("Seeding default user (if not exists)...")
  await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${hash}, ${name})
    ON CONFLICT (email) DO NOTHING
  `

  console.log("Done. You can login with: admin@example.com / Password123!")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

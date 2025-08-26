import { cookies as nextCookies, type RequestCookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { sql } from "@/lib/db"

const COOKIE_NAME = "session"
const maxAgeDays = 30

function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    console.warn("AUTH_SECRET is not set. Set it in your Vercel project settings.")
  }
  return new TextEncoder().encode(secret || "dev-insecure-secret")
}

type MinimalUser = { id: number; email: string; name: string | null }

export async function createSessionCookie(cookieStore: RequestCookies, user: MinimalUser) {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeDays}d`)
    .sign(getSecret())

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeDays * 24 * 60 * 60,
  })
}

export async function clearSessionCookie(cookieStore: RequestCookies) {
  cookieStore.delete(COOKIE_NAME)
}

export async function getCurrentUser(cookieStore?: RequestCookies): Promise<MinimalUser | null> {
  const store = cookieStore ?? (await nextCookies())
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSecret())
    const userId = Number(payload.sub)
    if (!userId) return null
    const rows = await sql<MinimalUser>`SELECT id, email, name FROM users WHERE id = ${userId} LIMIT 1`
    return rows[0] ?? null
  } catch {
    return null
  }
}

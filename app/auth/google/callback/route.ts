import type { NextRequest } from "next/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { createSessionCookie } from "@/lib/session"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

function getRedirectUri() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/auth/google/callback`
  }
  return process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/google/callback"
}

type GoogleTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
  id_token: string
}

type GoogleUserInfo = {
  id: string
  email: string
  name: string
  picture: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    redirect("/login?error=oauth_failed")
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    redirect("/login?error=oauth_not_configured")
  }

  try {
    const redirectUri = getRedirectUri()

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    })

    const tokens: GoogleTokenResponse = await tokenResponse.json()

    if (!tokens.access_token) {
      redirect("/login?error=token_exchange_failed")
    }

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const googleUser: GoogleUserInfo = await userResponse.json()

    if (!googleUser.email) {
      redirect("/login?error=no_email")
    }

    // Check if user exists, create if not
    let user = await sql<{ id: number; email: string; name: string | null }>`
      SELECT id, email, name FROM users WHERE email = ${googleUser.email}
    `

    if (user.length === 0) {
      // Create new user
      user = await sql<{ id: number; email: string; name: string | null }>`
        INSERT INTO users (email, name, password_hash, oauth_provider, oauth_id)
        VALUES (${googleUser.email}, ${googleUser.name}, '', 'google', ${googleUser.id})
        RETURNING id, email, name
      `
    }

    const cookieStore = await cookies()
    await createSessionCookie(cookieStore, {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
    })

    redirect("/")
  } catch (error) {
    console.error("Google OAuth error:", error)
    redirect("/login?error=oauth_error")
  }
}

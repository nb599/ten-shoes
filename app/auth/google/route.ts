import { redirect } from "next/navigation"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

function getRedirectUri() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/auth/google/callback`
  }
  return process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/google/callback"
}

export async function GET() {
  if (!GOOGLE_CLIENT_ID) {
    return new Response("Google OAuth not configured", { status: 500 })
  }

  const redirectUri = getRedirectUri()
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  })

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  redirect(authUrl)
}

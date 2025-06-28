import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  console.log("Checking auth, token:", token) // Debug log

  if (token) {
    const session = await kv.get(`session:${token}`)
    console.log("Session found:", !!session) // Debug log
    return NextResponse.json({ authenticated: !!session })
  }

  console.log("No token found, not authenticated") // Debug log
  return NextResponse.json({ authenticated: false })
}


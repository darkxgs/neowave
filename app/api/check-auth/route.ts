import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const authStatus = cookieStore.get("auth_status")?.value

  console.log("Checking auth, token:", token, "auth_status:", authStatus) // Debug log

  // First check the fallback cookie
  if (authStatus === "authenticated") {
    console.log("Authenticated via fallback cookie")
    return NextResponse.json({ authenticated: true })
  }

  // Then try database-based authentication
  if (token) {
    try {
      const { data: session, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .single()
      
      console.log("Session found:", !!session) // Debug log
      return NextResponse.json({ authenticated: !!session && !error })
    } catch (dbError) {
      console.error("Database error during auth check:", dbError)
      // If database fails, return false but don't throw an error
      return NextResponse.json({ authenticated: false })
    }
  }

  console.log("No token found, not authenticated") // Debug log
  return NextResponse.json({ authenticated: false })
}


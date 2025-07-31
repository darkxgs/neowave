import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    console.log("Test login attempt:", username)
    
    if (username === "admin" && password === "neowave342") {
      const token = Math.random().toString(36).substr(2)
      
      // Test Supabase connection
      let dbSuccess = false
      let dbError = null
      try {
        const expiresAt = new Date(Date.now() + 300 * 1000) // 5 minutes from now
        const { error } = await supabase
          .from('user_sessions')
          .insert([{
            token: `test_${token}`,
            username,
            expires_at: expiresAt.toISOString()
          }])
        
        if (!error) {
          dbSuccess = true
          console.log("Supabase test successful")
        } else {
          dbError = error
          console.error("Supabase test failed:", error)
        }
      } catch (error) {
        dbError = error
        console.error("Supabase test failed:", error)
      }
      
      // Set cookies regardless of KV status
      const cookieStore = await cookies()
      cookieStore.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        maxAge: 3600,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      
      cookieStore.set({
        name: "auth_status",
        value: "authenticated",
        httpOnly: false,
        maxAge: 3600,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
      
      return NextResponse.json({
        success: true,
        dbSuccess,
        dbError: dbError ? dbError.message : null,
        message: dbSuccess ? "Login successful with Supabase" : "Login successful with cookie fallback"
      })
    }
    
    return NextResponse.json({
      success: false,
      message: "Invalid credentials"
    })
    
  } catch (error) {
    console.error("Test login error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    console.log("Test login attempt:", username)
    
    if (username === "admin" && password === "neowave342") {
      const token = Math.random().toString(36).substr(2)
      
      // Test KV connection
      let kvSuccess = false
      let kvError = null
      try {
        await kv.set(`test_session:${token}`, { username, timestamp: Date.now() }, { ex: 300 }) // 5 minutes
        kvSuccess = true
        console.log("KV test successful")
      } catch (error) {
        kvError = error
        console.error("KV test failed:", error)
      }
      
      // Set cookies regardless of KV status
      const cookieStore = cookies()
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
        kvSuccess,
        kvError: kvError ? kvError.message : null,
        message: kvSuccess ? "Login successful with KV" : "Login successful without KV"
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
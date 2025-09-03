import { NextRequest, NextResponse } from "next/server"
import { sessionDb } from "@/lib/database"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    console.log("Test login attempt:", username)
    
    if (username === "admin" && password === "neowave342") {
      const token = Math.random().toString(36).substr(2)
      
      // Test PostgreSQL connection
      let dbSuccess = false
      let dbError = null
      try {
        await sessionDb.create(`test_session:${token}`, { username, timestamp: Date.now() })
        dbSuccess = true
        console.log("PostgreSQL test successful")
      } catch (error) {
        dbError = error
        console.error("PostgreSQL test failed:", error)
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
        dbSuccess,
        dbError: dbError ? dbError.message : null,
        message: dbSuccess ? "Login successful with PostgreSQL" : "Login successful without PostgreSQL"
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
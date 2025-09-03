"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// This is a redirect page to avoid route conflicts
export default function LoginRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the main login page
    router.replace("/")
  }, [router])
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Redirecting to login...</p>
    </div>
  )
} 
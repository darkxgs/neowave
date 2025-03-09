"use client"

import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function LoginButton() {
  const { isAuthenticated, logout } = useAuthContext()
  const router = useRouter()

  if (isAuthenticated) {
    return (
      <Button 
        variant="outline" 
        className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
        onClick={logout}
      >
        LOGOUT
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
      asChild
    >
      <Link href="/login">LOGIN</Link>
    </Button>
  )
}


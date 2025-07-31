"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { logout } from "@/app/actions"

export function LoginButton() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuth()

  const handleLogout = async () => {
    await logout()
    checkAuth()
    router.push("/")
  }

  const handleLogin = () => {
    router.push("/login")
    checkAuth()
  }

  return (
    <>
      {isAuthenticated ? (
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="text-white hover:text-[#40C4FF] hover:bg-[#2a3744]"
        >
          <LogOut className="h-4 w-4 mr-2" />
          LOGOUT
        </Button>
      ) : (
        <Button
          onClick={handleLogin}
          variant="outline"
          size="sm"
          className="text-white hover:text-[#40C4FF] hover:bg-[#2a3744]"
        >
          <LogIn className="h-4 w-4 mr-2" />
          LOGIN
        </Button>
      )}
    </>
  )
}


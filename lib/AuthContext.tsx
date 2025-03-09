"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type AuthContextType = {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  user: any | null
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => ({ success: false, error: "Not implemented" }),
  logout: () => {},
  user: null,
})

export const useAuthContext = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const router = useRouter()

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      // Check for authentication token in cookies or localStorage
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1]

      if (authToken) {
        setIsAuthenticated(true)
        // You could also fetch user data here based on the token
        setUser({ username: "admin" }) // Placeholder user data
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      // This is a simple validation - in a real app, you'd call your API
      if (username === "admin" && password === "admin123") {
        // Set cookie
        document.cookie = "auth_token=authenticated; path=/; max-age=86400"
        setIsAuthenticated(true)
        setUser({ username })
        return { success: true }
      }
      return { success: false, error: "Invalid credentials" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "An error occurred during login" }
    }
  }

  const logout = () => {
    // Clear auth cookie
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    setIsAuthenticated(false)
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  )
}


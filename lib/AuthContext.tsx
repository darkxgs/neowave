"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import useSWR from "swr"

type AuthContextType = {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { data, error, mutate } = useSWR("/api/check-auth", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  useEffect(() => {
    console.log("Auth data changed:", data) // Debug log
    if (data) {
      setIsAuthenticated(data.authenticated)
    } else if (error) {
      // If KV-based auth fails, check for the fallback cookie
      const authStatus = getCookie('auth_status')
      if (authStatus === 'authenticated') {
        console.log("Using fallback authentication via cookie")
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }
  }, [data, error])

  const checkAuth = async () => {
    console.log("Checking auth...") // Debug log
    await mutate()
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, checkAuth }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


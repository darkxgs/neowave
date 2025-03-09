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
    }
  }, [data])

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


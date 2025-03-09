"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/app/actions"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { checkAuth } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      console.log("Attempting login...") // Debug log
      const result = await login(username, password)
      console.log("Login result:", result) // Debug log
      if (result.success) {
        await checkAuth()
        router.push("/admin/data-entry")
      } else {
        setError(result.error || "An error occurred during login. Please try again.")
      }
    } catch (error: any) {
      console.error("Login error:", error) // Debug log
      setError(`An unexpected error occurred: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-grow">
      <div className="container mx-auto p-8">
        <Card className="w-full max-w-md mx-auto bg-[#1B2531] border-[#2a3744]">
          <CardHeader>
            <CardTitle className="text-[#40C4FF] text-2xl font-normal">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-[#2a3744] border-[#3a4754] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-[#2a3744] border-[#3a4754] text-white"
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full bg-[#40C4FF] text-white hover:bg-blue-400" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/")}
                variant="outline"
                className="mt-4 w-full text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Product Generator
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


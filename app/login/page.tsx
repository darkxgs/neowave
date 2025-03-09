"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/actions"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!username || !password) {
      setError("Please enter both username and password")
      setIsLoading(false)
      return
    }

    try {
      const result = await login(username, password)
      if (result.success) {
        router.push("/admin/data-entry")
      } else {
        setError(result.error || "Invalid credentials")
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-md bg-[#1B2531] border-[#2a3744]">
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
                className="bg-[#2a3744] border-[#3a4754] text-white"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-[#40C4FF] text-white hover:bg-blue-400" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button variant="outline" type="button" onClick={() => router.push("/")} className="w-full mt-2 border-[#3a4754] text-[#40C4FF] hover:bg-[#2a3744]">
              Back to Product Generator
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


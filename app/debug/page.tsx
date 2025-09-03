"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const { isAuthenticated, checkAuth } = useAuth()
  const [kvStatus, setKvStatus] = useState<string>("Testing...")
  const [categoriesStatus, setCategoriesStatus] = useState<string>("Testing...")
  const [filtersStatus, setFiltersStatus] = useState<string>("Testing...")
  const [authStatus, setAuthStatus] = useState<string>("Testing...")

  useEffect(() => {
    // Test KV connection
    fetch("/api/check-auth")
      .then(res => res.json())
      .then(data => {
        setKvStatus(data.authenticated ? "KV Working" : "KV Failed")
      })
      .catch(err => {
        setKvStatus(`KV Error: ${err.message}`)
      })

    // Test categories API
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setCategoriesStatus(`Error: ${data.error}`)
        } else {
          setCategoriesStatus(`Success: ${Array.isArray(data) ? data.length : 0} categories`)
        }
      })
      .catch(err => {
        setCategoriesStatus(`Fetch Error: ${err.message}`)
      })

    // Test filters API
    fetch("/api/filters")
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setFiltersStatus(`Error: ${data.error}`)
        } else {
          setFiltersStatus(`Success: ${Array.isArray(data) ? data.length : 0} filters`)
        }
      })
      .catch(err => {
        setFiltersStatus(`Fetch Error: ${err.message}`)
      })

    // Test auth status
    fetch("/api/check-auth")
      .then(res => res.json())
      .then(data => {
        setAuthStatus(`Authenticated: ${data.authenticated}`)
      })
      .catch(err => {
        setAuthStatus(`Auth Error: ${err.message}`)
      })
  }, [])

  const testLogin = async () => {
    try {
      const response = await fetch("/api/test-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "admin",
          password: "neowave342"
        })
      })
      const result = await response.json()
      alert(`Login test result: ${JSON.stringify(result)}`)
      checkAuth()
    } catch (error) {
      alert(`Login test error: ${error}`)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Debug Information</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-[#1B2531] border-[#2a3744]">
          <CardHeader>
            <CardTitle className="text-[#40C4FF]">Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">Client Auth: {isAuthenticated ? "Authenticated" : "Not Authenticated"}</p>
            <p className="text-white">Server Auth: {authStatus}</p>
            <Button onClick={testLogin} className="mt-4 bg-[#40C4FF] text-white">
              Test Login
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#1B2531] border-[#2a3744]">
          <CardHeader>
            <CardTitle className="text-[#40C4FF]">Database Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">KV Store: {kvStatus}</p>
            <p className="text-white">Categories: {categoriesStatus}</p>
            <p className="text-white">Filters: {filtersStatus}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-[#1B2531] border-[#2a3744]">
        <CardHeader>
          <CardTitle className="text-[#40C4FF]">Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white">KV_URL: {process.env.NEXT_PUBLIC_KV_URL ? "Set" : "Not Set"}</p>
          <p className="text-white">KV_REST_API_URL: {process.env.NEXT_PUBLIC_KV_REST_API_URL ? "Set" : "Not Set"}</p>
          <p className="text-white">API_URL: {process.env.NEXT_PUBLIC_API_URL ? "Set" : "Not Set"}</p>
        </CardContent>
      </Card>
    </div>
  )
} 
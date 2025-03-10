"use server"

import { kv } from "@vercel/kv"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type Specification = {
  name: string
  value: string
}

type ProductData = {
  category: string
  type: string
  name: string
  code: string
  description: string
  specifications: Specification[]
}

export async function login(username: string, password: string) {
  console.log("Login attempt:", username) // Debug log
  try {
    if (username === "admin" && password === "neowave342") {
      const token = Math.random().toString(36).substr(2)
      try {
        await kv.set(`session:${token}`, { username }, { ex: 3600 }) // Expire in 1 hour
      } catch (kvError) {
        console.error("KV store error:", kvError)
        return { success: false, error: "Error storing session. Please try again." }
      }

      try {
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
      } catch (cookieError: any) {
        console.error("Cookie setting error:", cookieError)
        return { success: false, error: `Error setting authentication cookie: ${cookieError.message}` }
      }

      console.log("Login successful, token set:", token) // Debug log
      return { success: true }
    }
    console.log("Login failed: Invalid credentials") // Debug log
    return { success: false, error: "Invalid credentials" }
  } catch (error: any) {
    console.error("Login error:", error) // Debug log
    return { success: false, error: `An unexpected error occurred during login: ${error.message}` }
  }
}

export async function logout() {
  const token = cookies().get("auth_token")?.value
  if (token) {
    await kv.del(`session:${token}`)
    cookies().delete("auth_token")
  }
  redirect("/")
}

export async function addProduct(data: ProductData) {
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to add product")
    }
    return { success: true }
  } catch (error) {
    console.error("Error adding product:", error)
    return { success: false, error: "Failed to add product" }
  }
}

export async function editProduct(id: string, data: ProductData) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to edit product")
    }
    return { success: true }
  } catch (error) {
    console.error("Error editing product:", error)
    return { success: false, error: "Failed to edit product" }
  }
}

export async function deleteProduct(id: string) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete product")
    }
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: "Failed to delete product" }
  }
}


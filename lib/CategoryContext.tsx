"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import type { ProductCategory } from "@/lib/types/category"

type CategoryContextType = {
  categories: ProductCategory[]
  updateCategories: (categories: ProductCategory[]) => Promise<void>
  isLoading: boolean
  error: string | null
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch categories")
    } finally {
      setIsLoading(false)
    }
  }

  const updateCategories = async (newCategories: ProductCategory[]) => {
    try {
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategories),
      })

      if (!response.ok) {
        throw new Error("Failed to update categories")
      }

      setCategories(newCategories)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update categories")
      throw error
    }
  }

  return (
    <CategoryContext.Provider value={{ categories, updateCategories, isLoading, error }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategories() {
  const context = useContext(CategoryContext)
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider")
  }
  return context
}


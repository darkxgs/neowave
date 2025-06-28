"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import type { ProductCategory } from "@/lib/types/category"

type CategoryContextType = {
  categories: ProductCategory[]
  updateCategories: (categories: ProductCategory[]) => Promise<void>
  isLoading: boolean
  error: string | null
  refetchCategories: () => Promise<void>
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
      console.log("Fetching categories...")
      setIsLoading(true)
      setError(null)
      
      // Try the primary endpoint first
      try {
        const response = await fetch("/api/categories")
        console.log("API response status:", response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error("API error response:", errorText)
          throw new Error(`Failed to fetch categories: ${response.status} ${errorText}`)
        }
        
        const data = await response.json()
        console.log("Categories fetched successfully:", data)
        
        if (!data || !Array.isArray(data)) {
          console.error("Invalid data format:", data)
          throw new Error("Invalid data format received from API")
        }
        
        setCategories(data)
        return
      } catch (primaryError) {
        console.error("Primary endpoint failed, trying fallback:", primaryError)
        
        // Try the fallback endpoint
        const fallbackResponse = await fetch("/api/fallback-categories")
        
        if (!fallbackResponse.ok) {
          throw new Error(`Both primary and fallback endpoints failed`)
        }
        
        const fallbackData = await fallbackResponse.json()
        console.log("Fallback categories fetched:", fallbackData)
        
        if (!fallbackData || !Array.isArray(fallbackData)) {
          throw new Error("Invalid data format from fallback API")
        }
        
        setCategories(fallbackData)
      }
      
    } catch (error) {
      console.error("Error in fetchCategories:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch categories")
      // Add fallback data in case of error
      setCategories([
        {
          id: "sensors-switches",
          name: "Sensors and Switches",
          types: [
            { id: "temp-humid", name: "Temperature and humidity" },
            { id: "air-quality", name: "Air Quality" }
          ],
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const updateCategories = async (newCategories: ProductCategory[]) => {
    try {
      setError(null)
      
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategories),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update categories: ${response.status} ${errorText}`)
      }

      setCategories(newCategories)
    } catch (error) {
      console.error("Error updating categories:", error)
      setError(error instanceof Error ? error.message : "Failed to update categories")
      throw error
    }
  }

  return (
    <CategoryContext.Provider value={{ categories, updateCategories, isLoading, error, refetchCategories: fetchCategories }}>
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


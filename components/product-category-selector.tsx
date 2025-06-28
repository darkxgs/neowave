"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, AlertCircle, RefreshCw } from "lucide-react"
import { useCategories } from "@/lib/CategoryContext"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface ProductCategorySelectorProps {
  onCategorySelect: (categoryId: string) => void
}

export function ProductCategorySelector({ onCategorySelect }: ProductCategorySelectorProps) {
  const { categories, isLoading, error, refetchCategories } = useCategories()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#40C4FF]"></div>
        <span className="ml-3 text-white">Loading categories...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-900/20 border-red-900 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading categories</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={refetchCategories} variant="outline" className="mt-2 bg-transparent border-red-500 text-white hover:bg-red-900/30">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </Alert>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <Alert className="bg-yellow-900/20 border-yellow-900 mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No categories found</AlertTitle>
        <AlertDescription>No product categories are available at this time.</AlertDescription>
        <Button onClick={refetchCategories} variant="outline" className="mt-2 bg-transparent border-yellow-500 text-white hover:bg-yellow-900/30">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          className="w-full justify-between text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
          onClick={() => onCategorySelect(category.id)}
        >
          {category.name}
          <ChevronRight className="h-4 w-4" />
        </Button>
      ))}
    </div>
  )
}


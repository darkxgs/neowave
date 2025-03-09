"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useCategories } from "@/lib/CategoryContext"

interface ProductCategorySelectorProps {
  onCategorySelect: (categoryId: string) => void
}

export function ProductCategorySelector({ onCategorySelect }: ProductCategorySelectorProps) {
  const { categories, isLoading } = useCategories()

  if (isLoading) {
    return <div className="text-white">Loading categories...</div>
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


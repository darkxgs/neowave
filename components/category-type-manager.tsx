"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useCategories } from "@/lib/CategoryContext"

export function CategoryTypeManager() {
  const { categories, updateCategories, isLoading, error } = useCategories()
  const [newCategory, setNewCategory] = useState("")
  const [newType, setNewType] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const addCategory = async () => {
    if (newCategory && !categories.find((c) => c.id === newCategory.toLowerCase().replace(/\s+/g, "-"))) {
      try {
        const updatedCategories = [
          ...categories,
          { id: newCategory.toLowerCase().replace(/\s+/g, "-"), name: newCategory, types: [] },
        ]
        await updateCategories(updatedCategories)
        setNewCategory("")
        toast.success("Category added successfully")
      } catch (error) {
        console.error("Error adding category:", error)
        toast.error("Failed to add category")
      }
    } else {
      toast.error("Invalid category name or category already exists")
    }
  }

  const addType = async () => {
    if (newType && selectedCategory) {
      try {
        const updatedCategories = categories.map((c) => {
          if (c.id === selectedCategory) {
            const typeId = newType.toLowerCase().replace(/\s+/g, "-")
            if (c.types.some((t) => t.id === typeId)) {
              throw new Error("Type already exists in this category")
            }
            return {
              ...c,
              types: [...c.types, { id: typeId, name: newType }],
            }
          }
          return c
        })
        await updateCategories(updatedCategories)
        setNewType("")
        toast.success("Type added successfully")
      } catch (error) {
        console.error("Error adding type:", error)
        toast.error(error instanceof Error ? error.message : "Failed to add type")
      }
    } else {
      toast.error("Please select a category and enter a valid type name")
    }
  }

  const removeCategory = async (categoryId: string) => {
    try {
      const updatedCategories = categories.filter((c) => c.id !== categoryId)
      await updateCategories(updatedCategories)
      toast.success("Category removed successfully")
    } catch (error) {
      toast.error("Failed to remove category")
    }
  }

  const removeType = async (categoryId: string, typeId: string) => {
    try {
      const updatedCategories = categories.map((c) => {
        if (c.id === categoryId) {
          return {
            ...c,
            types: c.types.filter((t: any) => t.id !== typeId),
          }
        }
        return c
      })
      await updateCategories(updatedCategories)
      toast.success("Type removed successfully")
    } catch (error) {
      toast.error("Failed to remove type")
    }
  }

  return (
    <Card className="bg-[#1B2531] border-[#2a3744]">
      <CardHeader>
        <CardTitle className="text-[#40C4FF] text-xl font-normal">Manage Categories and Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newCategory" className="text-white">
            New Category
          </Label>
          <div className="flex space-x-2">
            <Input
              id="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-[#2a3744] border-[#3a4754] text-white"
              placeholder="Enter new category name"
            />
            <Button onClick={addCategory} className="bg-[#40C4FF] text-white hover:bg-blue-400">
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="selectedCategory" className="text-white">
            Select Category
          </Label>
          <select
            id="selectedCategory"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#2a3744] border-[#3a4754] text-white rounded-md p-2"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newType" className="text-white">
            New Type
          </Label>
          <div className="flex space-x-2">
            <Input
              id="newType"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="bg-[#2a3744] border-[#3a4754] text-white"
              placeholder="Enter new type name"
            />
            <Button onClick={addType} className="bg-[#40C4FF] text-white hover:bg-blue-400">
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {categories.map((category) => (
            <Card key={category.id} className="bg-[#2a3744] border-[#3a4754]">
              <CardHeader className="flex flex-row items-center justify-between py-2">
                <CardTitle className="text-white text-lg">{category.name}</CardTitle>
                <Button onClick={() => removeCategory(category.id)} variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.types.map((type: any) => (
                    <li key={type.id} className="flex items-center justify-between text-gray-300">
                      <span>{type.name}</span>
                      <Button onClick={() => removeType(category.id, type.id)} variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { useState, useEffect } from "react"
import { DataEntryForm } from "@/components/data-entry-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Search, ArrowLeft, Download, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { exportToExcel } from "@/utils/excel-export"
import { useCategories } from "@/lib/CategoryContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { sensorTypes, sensorModels } from "@/lib/data"

export default function DataEntryPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { categories } = useCategories()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const products = await response.json()
      setProducts(products)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products. Please try again.")
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete product")
      }
      fetchProducts()
      toast.success("Product deleted successfully.")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product. Please try again.")
    }
  }

  const handleProductAdded = () => {
    console.log("Product added successfully")
    fetchProducts()
  }

  const handleExportType = (typeId: string) => {
    console.log("Exporting type:", typeId)

    // First, try to find the type in sensorTypes
    let typeInfo = sensorTypes.find((type) => type.id === typeId)

    // If not found in sensorTypes, look in categories
    if (!typeInfo) {
      // Find the type in all categories
      for (const category of categories) {
        const foundType = category.types.find((type) => type.id === typeId)
        if (foundType) {
          typeInfo = { id: foundType.id, name: foundType.name }
          break
        }
      }
    }

    if (typeInfo) {
      console.log("Found type info:", typeInfo)
      const customTypeProducts = products.filter((product) => product.type === typeId)
      console.log("Custom products for type:", customTypeProducts)

      // Pass the types array to ensure non-sensor types are handled correctly
      const allTypes =
        categories?.flatMap((category) => category.types.map((type) => ({ id: type.id, name: type.name }))) || []

      exportToExcel(typeId, customTypeProducts, allTypes)
      toast.success(`Exporting specifications for ${typeInfo.name}`)
    } else {
      console.error("Type not found:", typeId)
      toast.error("Type not found")
    }
  }

  const handleExportAll = () => {
    const types =
      categories?.flatMap((category) => category.types.map((type) => ({ id: type.id, name: type.name }))) || []
    exportToExcel(null, products, types)
    toast.success("Exporting specifications for all types")
  }

  const getProductCount = (typeId: string) => {
    // Get custom products count
    const customProducts = products.filter((p) => p.type === typeId).length
    // Get standard products count from sensorModels
    const standardProducts = (sensorModels[typeId] || []).length
    // Log the counts for debugging
    console.log(`Type ${typeId}:`, { customProducts, standardProducts, total: customProducts + standardProducts })
    return customProducts + standardProducts
  }

  const filteredProducts = products.filter(
    (product: any) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Data Entry</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40C4FF]"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              <Button variant="outline" className="w-full text-left justify-start">
                Add New Product
              </Button>
              <Button variant="outline" className="w-full text-left justify-start">
                Edit Existing Products
              </Button>
              <Button variant="outline" className="w-full text-left justify-start">
                Manage Categories
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40C4FF]"></div>
              </div>
            ) : (
              <p>No recent activity found.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40C4FF]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2a3744] p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Total Products</p>
                  <p className="text-2xl font-bold">120</p>
                </div>
                <div className="bg-[#2a3744] p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Categories</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="bg-[#2a3744] p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Active Filters</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-[#2a3744] p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Users</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


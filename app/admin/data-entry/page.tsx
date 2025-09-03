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
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const products = await response.json()
      setProducts(products)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to fetch products. Please try again.")
      setIsLoading(false)
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
    fetchProducts()
  }

  const handleExportType = (typeId: string) => {
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
      const customTypeProducts = products.filter((product) => product.type === typeId)

      // Pass the types array to ensure non-sensor types are handled correctly
      const allTypes =
        categories?.flatMap((category) => category.types.map((type) => ({ id: type.id, name: type.name }))) || []

      exportToExcel(typeId, customTypeProducts, allTypes)
      toast.success(`Exporting specifications for ${typeInfo.name}`)
    } else {
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
    return customProducts + standardProducts
  }

  const filteredProducts = products.filter(
    (product: any) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-light text-[#40C4FF] mb-8">Product Data Entry</h1>
      
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]">
              <Download className="mr-2 h-4 w-4" />
              Export Specifications
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1B2531] border-[#2a3744]">
            <DropdownMenuLabel className="text-[#40C4FF]">Export Options</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2a3744]" />
            <DropdownMenuItem
              className="text-white hover:bg-[#2a3744] cursor-pointer"
              onClick={handleExportAll}
            >
              Export All Products
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a3744]" />
            <DropdownMenuLabel className="text-[#40C4FF]">Export by Type</DropdownMenuLabel>
            {categories.map((category) => (
              <DropdownMenuSub key={category.id}>
                <DropdownMenuSubTrigger className="text-white hover:bg-[#2a3744]">
                  {category.name}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-[#1B2531] border-[#2a3744]">
                  {category.types.map((type) => (
                    <DropdownMenuItem
                      key={type.id}
                      className="text-white hover:bg-[#2a3744] cursor-pointer"
                      onClick={() => handleExportType(type.id)}
                    >
                      {type.name} ({getProductCount(type.id)})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <DataEntryForm onProductAdded={handleProductAdded} editingProduct={editingProduct} />
        </div>
        
        <div>
          <Card className="bg-[#1B2531] border-[#2a3744]">
            <CardHeader>
              <CardTitle className="text-[#40C4FF] text-xl font-normal">Existing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#2a3744] border-[#3a4754] text-white"
                />
              </div>
              
              {isLoading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40C4FF]"></div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {filteredProducts.map((product: any) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-[#2a3744] p-4 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-gray-400 text-sm">{product.code}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEdit(product)}
                          variant="ghost"
                          size="sm"
                          className="text-[#40C4FF] hover:text-blue-400 hover:bg-[#1B2531]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-[#1B2531]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No products found.</p>
                  {searchTerm && <p className="text-sm mt-2">Try adjusting your search criteria.</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


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
    <main className="flex-grow">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-light text-[#40C4FF] mb-8">Product Data Entry</h1>
        <div className="flex justify-end mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]">
                <Download className="h-4 w-4 mr-2" />
                Export Specifications
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 bg-[#1B2531] border-[#2a3744] text-white" align="end">
              <DropdownMenuLabel className="text-[#40C4FF] font-normal">Export Options</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleExportAll}
                className="hover:bg-[#2a3744] cursor-pointer flex items-center py-2"
              >
                <Download className="h-4 w-4 mr-2 text-[#40C4FF]" />
                <span>All Products</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2a3744]" />
              <DropdownMenuLabel className="text-[#40C4FF] font-normal">Categories</DropdownMenuLabel>
              {categories?.map((category) => (
                <DropdownMenuSub key={category.id}>
                  <DropdownMenuSubTrigger className="hover:bg-[#2a3744] cursor-pointer data-[state=open]:bg-[#2a3744]">
                    <span className="flex-1">{category.name}</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-64 bg-[#1B2531] border-[#2a3744] text-white">
                    {category.types.map((type) => {
                      const productCount = getProductCount(type.id)
                      const hasProducts = productCount > 0
                      return (
                        <DropdownMenuItem
                          key={type.id}
                          onClick={() => handleExportType(type.id)}
                          className={`
                            hover:bg-[#2a3744] cursor-pointer py-2
                            ${!hasProducts ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                          disabled={!hasProducts}
                        >
                          <div className="flex flex-col">
                            <span>{type.name}</span>
                            <span className="text-xs text-gray-400">
                              {hasProducts
                                ? `${productCount} product${productCount === 1 ? "" : "s"}`
                                : "No products available"}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <DataEntryForm onProductAdded={handleProductAdded} editingProduct={editingProduct} />
          </div>
          <div>
            <Card className="bg-[#1B2531] border-[#2a3744]">
              <CardHeader>
                <CardTitle className="text-[#40C4FF] text-xl font-normal">Existing Products</CardTitle>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#2a3744] border-[#3a4754] text-white"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                {filteredProducts.length === 0 ? (
                  <p className="text-white">No products found.</p>
                ) : (
                  <ul className="space-y-4">
                    {filteredProducts.map((product: any) => (
                      <li key={product.id} className="flex items-center justify-between bg-[#2a3744] p-4 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{product.name}</span>
                          <span className="text-sm text-gray-400">{product.code}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEdit(product)}
                            variant="outline"
                            size="sm"
                            className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDelete(product.id)} variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className="mt-8 text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Product Generator
        </Button>
      </div>
    </main>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function AdminPage() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [description, setDescription] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data)
  }

  const updateProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    })

    if (res.ok) {
      toast.success("Product updated successfully")
      fetchProducts()
    } else {
      toast.error("Failed to update product")
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-light tracking-wider text-[#40C4FF] mb-8">Product Database Management</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl text-white mb-4">Products</h2>
          <div className="space-y-2">
            {products.map((product: any) => (
              <Button
                key={product.id}
                variant="ghost"
                className="w-full justify-start text-white hover:text-[#40C4FF] hover:bg-[#2a3744]"
                onClick={() => {
                  setSelectedProduct(product)
                  setDescription(product.description)
                }}
              >
                {product.code}
              </Button>
            ))}
          </div>
        </div>

        {selectedProduct && (
          <div className="space-y-4">
            <h2 className="text-xl text-white mb-4">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white mb-2 block">Product Code</label>
                <Input value={selectedProduct.code} disabled className="bg-[#2a3744] border-[#3a4754] text-white" />
              </div>
              <div>
                <label className="text-sm text-white mb-2 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-[#2a3744] border-[#3a4754] text-white min-h-[100px]"
                />
              </div>
              <Button
                onClick={() => updateProduct(selectedProduct.id)}
                className="bg-[#40C4FF] text-white hover:bg-blue-400"
              >
                Update Product
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


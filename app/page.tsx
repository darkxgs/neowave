"use client"

import { useState, useEffect } from "react"
import { ProductSelector } from "@/components/product-selector"
import { useProducts } from "@/lib/ProductContext"
import { useAuth } from "@/lib/AuthContext"
import { Button } from "@/components/ui/button"
import { Database, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { selectedProducts, setSelectedProducts } = useProducts()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-[#1B2531]">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-between font-mono text-sm">
        <h1 className="text-3xl font-light text-[#40C4FF] mb-8">Product Code Generator</h1>
        
        {isAuthenticated && (
          <div className="w-full flex justify-end mb-6">
            <Button 
              onClick={() => router.push('/admin/data-entry')}
              className="bg-[#40C4FF] text-white hover:bg-blue-400"
            >
              <Database className="mr-2 h-4 w-4" /> 
              Manage Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        <ProductSelector />
        
        {selectedProducts.length > 0 && (
          <div className="mt-12 w-full">
            <h2 className="text-xl font-semibold text-[#40C4FF] mb-4">Selected Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#2a3744] border border-[#3a4754] rounded-lg p-4 hover:border-[#40C4FF] transition-colors cursor-pointer"
                >
                  <h3 className="text-lg font-medium text-white">{product.name}</h3>
                  <p className="text-gray-300 mt-2">Code: {product.code || 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}


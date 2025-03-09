"use client"

import { useState, useEffect } from "react"
import { ProductSelector } from "@/components/product-selector"
import { SelectedProductViewer } from "@/components/selected-product-viewer"
import { useProductContext } from "@/lib/ProductContext"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Database } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"

export default function Home() {
  const { selectedProducts } = useProductContext()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  return (
    <main className="min-h-screen p-6 mx-auto" style={{ backgroundColor: "#141C26" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-light text-[#40C4FF]">Product Code Generator</h1>
          <div className="flex items-center">
            {isAuthenticated && (
              <Button 
                onClick={() => router.push("/admin/data-entry")} 
                variant="outline" 
                className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744] mr-4"
              >
                <Database className="mr-2 h-4 w-4" />
                Data Entry
              </Button>
            )}
            <Button 
              onClick={() => router.push("/login")} 
              variant="outline" 
              className="text-white border-[#3a4754] hover:bg-[#2a3744]"
            >
              LOGIN
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <ProductSelector />
          {selectedProducts.length > 0 && <SelectedProductViewer />}
        </div>
      </div>
    </main>
  )
}


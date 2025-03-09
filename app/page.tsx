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
    <main className="min-h-screen mx-auto" style={{ background: "#161F2B" }}>
      <div className="container p-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-light text-[#40C4FF]">Product Code Generator</h1>
          {isAuthenticated && (
            <Button 
              onClick={() => router.push("/admin/data-entry")} 
              variant="outline" 
              className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
            >
              <Database className="mr-2 h-4 w-4" />
              Data Entry
            </Button>
          )}
        </div>
        
        {/* Full-width product selector */}
        <div className="mb-6">
          <ProductSelector />
        </div>
        
        {/* Selected products below */}
        {selectedProducts.length > 0 && (
          <div>
            <SelectedProductViewer />
          </div>
        )}
      </div>
    </main>
  )
}


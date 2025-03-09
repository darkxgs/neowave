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
    <main className="container min-h-screen p-4 mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
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
        
        <div className="grid md:grid-cols-2 gap-6">
          <ProductSelector />
          {selectedProducts.length > 0 && <SelectedProductViewer />}
        </div>
      </div>
    </main>
  )
}


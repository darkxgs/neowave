"use client"

import { ProductSelector } from "@/components/product-selector"
import { SelectedProductViewer } from "@/components/selected-product-viewer"
import { useProductContext } from "@/lib/ProductContext"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Database } from "lucide-react"
import { useAuthContext } from "@/lib/AuthContext"
import Link from "next/link"

export default function Home() {
  const { selectedProducts } = useProductContext()
  const { isAuthenticated } = useAuthContext()
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#111827]">
      <div className="container p-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-light text-[#40C4FF]">Product Generator</h1>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Button 
                onClick={() => router.push("/admin/data-entry")} 
                variant="outline" 
                className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
              >
                <Database className="mr-2 h-4 w-4" />
                Data Entry
              </Button>
            ) : (
              <Button
                variant="outline"
                className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
                asChild
              >
                <Link href="/login">LOGIN</Link>
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <ProductSelector />
          {selectedProducts.length > 0 && <SelectedProductViewer />}
        </div>
      </div>
    </main>
  )
}


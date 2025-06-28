"use client"

import { ProductSelector } from "@/components/product-selector"
import { useProductContext } from "@/lib/ProductContext"
import { Button } from "@/components/ui/button"
import { AdminLink } from "@/components/admin-link"

export default function Home() {
  const { selectedProducts, removeProduct } = useProductContext()

  return (
    <main className="flex-grow">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-light text-[#40C4FF] mb-8">Product Code Generator</h1>
        {selectedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-[#40C4FF] mb-4">Selected Products</h2>
            <ul className="space-y-2">
              {selectedProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between bg-[#2a3744] p-4 rounded-lg">
                  <span className="text-white">
                    {product.name} - {product.code}
                  </span>
                  <Button onClick={() => removeProduct(product.id)} variant="destructive" size="sm">
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ProductSelector />
        <AdminLink />
      </div>
    </main>
  )
}


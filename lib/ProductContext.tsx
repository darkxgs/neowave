"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"

type Product = {
  id: string
  name: string
  code: string
}

type ProductContextType = {
  selectedProducts: Product[]
  addProduct: (product: Product) => void
  removeProduct: (id: string) => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  const addProduct = (product: Product) => {
    setSelectedProducts((prev) => [...prev, product])
  }

  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <ProductContext.Provider value={{ selectedProducts, addProduct, removeProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProductContext must be used within a ProductProvider")
  }
  return context
}


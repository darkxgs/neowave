import "./globals.css"
import type { Metadata } from "next"
import { ProductProvider } from "@/lib/ProductContext"
import { AuthProvider } from "@/lib/AuthContext"
import { CategoryProvider } from "@/lib/CategoryContext"
import { FilterProvider } from "@/lib/FilterContext"
import type React from "react"
import { ScrollHandler } from "@/components/scroll-handler"
import { LoginButton } from "@/components/login-button"

export const metadata: Metadata = {
  title: "Neo Wave Product Generator",
  description: "Generate product codes for Neo Wave sensors and devices",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#1B2531] flex flex-col">
        <AuthProvider>
          <CategoryProvider>
            <FilterProvider>
              <ProductProvider>
                <div className="fixed top-4 right-4 z-50">
                  <LoginButton />
                </div>
                <div className="flex-grow">{children}</div>
              </ProductProvider>
            </FilterProvider>
          </CategoryProvider>
        </AuthProvider>
        <ScrollHandler />
      </body>
    </html>
  )
}



import './globals.css'
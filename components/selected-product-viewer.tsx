"use client"

import { useProductContext } from "@/lib/ProductContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export function SelectedProductViewer() {
  const { selectedProducts, removeProduct, clearSelectedProducts } = useProductContext()
  const [generatingPdf, setGeneratingPdf] = useState(false)

  const handleExportPDF = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to export")
      return
    }

    try {
      setGeneratingPdf(true)
      toast.info("Generating PDF...")

      // In a real implementation, you would call an API to generate a PDF
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("PDF generated successfully!")
      // In a real implementation, you would open the PDF in a new tab or download it
      
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF. Please try again.")
    } finally {
      setGeneratingPdf(false)
    }
  }

  return (
    <Card className="bg-[#1B2531] border-[#2a3744]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#40C4FF] text-xl font-normal">Selected Products</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelectedProducts}
            className="text-white border-[#3a4754] hover:bg-[#2a3744]"
            disabled={selectedProducts.length === 0}
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
            disabled={selectedProducts.length === 0 || generatingPdf}
          >
            <Download className="w-4 h-4 mr-2" />
            {generatingPdf ? "Generating..." : "Export PDF"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {selectedProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No products selected.</p>
            <p className="text-sm mt-2">Please select products from the list on the left.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-[#2a3744] p-4 rounded-lg"
              >
                <div className="flex items-center">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-contain mr-3 bg-white rounded p-1"
                    />
                  )}
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm">{product.code}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-[#40C4FF]">{product.typeName || "Custom"}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProduct(product.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-[#1B2531]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
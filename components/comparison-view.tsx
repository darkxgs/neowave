"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { sensorTypes } from "@/lib/data"
import { generateCSV } from "@/utils/csv-export"

interface ComparisonViewProps {
  selectedProducts: string[]
  onRemove: (productCode: string) => void
}

export function ComparisonView({ selectedProducts, onRemove }: ComparisonViewProps) {
  const getProductDetails = (productCode: string) => {
    const [type, model, ...specs] = productCode.split("-")
    const sensorType = sensorTypes.find((s) => s.id === type)
    if (!sensorType) return null

    const details: Record<string, string> = {
      Model: model,
    }

    switch (type) {
      case "temp-humid":
        details["Accuracy"] = sensorType.specifications.accuracy?.find((a) => a.value === specs[0])?.label || "N/A"
        details["Humidity Output"] =
          sensorType.specifications.humidityOutput?.find((h) => h.value === specs[1])?.label || "N/A"
        details["Temperature Output"] =
          sensorType.specifications.temperatureOutput?.find((t) => t.value === specs[2])?.label || "N/A"
        details["Temperature Range"] =
          sensorType.specifications.temperatureRange?.find((r) => r.value === specs[3])?.label || "N/A"
        break
      case "air-quality":
        details["Accuracy"] = sensorType.specifications.accuracy?.find((a) => a.value === specs[0])?.label || "N/A"
        details["Measure Range"] =
          sensorType.specifications.measureRange?.find((m) => m.value === specs[1])?.label || "N/A"
        details["Output"] = sensorType.specifications.output?.find((o) => o.value === specs[2])?.label || "N/A"
        details["Operating Temperature"] =
          sensorType.specifications.operatingTemperature?.find((t) => t.value === specs[3])?.label || "N/A"
        break
      case "pressure":
        details["Accuracy"] = sensorType.specifications.accuracy?.find((a) => a.value === specs[0])?.label || "N/A"
        details["Output"] = sensorType.specifications.output?.find((o) => o.value === specs[1])?.label || "N/A"
        details["Pressure Range"] =
          sensorType.specifications.pressureRange?.find((p) => p.value === specs[2])?.label || "N/A"
        details["Operating Temperature"] =
          sensorType.specifications.operatingTemperature?.find((t) => t.value === specs[3])?.label || "N/A"
        break
      case "level":
        details["Accuracy"] = sensorType.specifications.accuracy?.find((a) => a.value === specs[0])?.label || "N/A"
        details["Temperature Output"] =
          sensorType.specifications.temperatureOutput?.find((t) => t.value === specs[1])?.label || "N/A"
        details["Communication Protocol"] =
          sensorType.specifications.communicationProtocol?.find((c) => c.value === specs[2])?.label || "N/A"
        details["Power Supply"] =
          sensorType.specifications.powerSupply?.find((p) => p.value === specs[3])?.label || "N/A"
        details["Temperature Range"] =
          sensorType.specifications.temperatureRange?.find((r) => r.value === specs[4])?.label || "N/A"
        break
    }

    return { type: sensorType.name, details }
  }

  const products = selectedProducts.map(getProductDetails).filter(Boolean)

  if (products.length === 0) {
    return null
  }

  const allSpecs = Array.from(new Set(products.flatMap((p) => Object.keys(p!.details))))

  const handleExportCSV = () => {
    const csvContent = generateCSV(selectedProducts)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "sensor_comparison.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Card className="mt-8 bg-[#1B2531] border-[#2a3744]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#40C4FF] text-xl font-normal">Product Comparison</CardTitle>
        <Button
          onClick={handleExportCSV}
          variant="outline"
          size="sm"
          className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#40C4FF]">Specification</TableHead>
              {products.map((product, index) => (
                <TableHead key={index} className="text-[#40C4FF]">
                  <div className="flex items-center justify-between">
                    <span>
                      {product!.type} - {product!.details["Model"]}
                    </span>
                    <Button
                      onClick={() => onRemove(selectedProducts[index])}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-transparent"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {allSpecs.map((spec, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-white">{spec}</TableCell>
                {products.map((product, productIndex) => (
                  <TableCell key={productIndex} className="text-gray-300">
                    {product!.details[spec] || "N/A"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


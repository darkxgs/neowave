import { sensorTypes } from "@/lib/data"

export function generateCSV(selectedProducts: string[]): string {
  const getProductDetails = (productCode: string) => {
    const [type, model, ...specs] = productCode.split("-")
    const sensorType = sensorTypes.find((s) => s.id === type)
    if (!sensorType) return null

    const details: Record<string, string> = {
      Type: sensorType.name,
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

    return details
  }

  const products = selectedProducts.map(getProductDetails).filter(Boolean) as Record<string, string>[]

  if (products.length === 0) {
    return ""
  }

  const headers = Object.keys(products[0])
  const csvContent = [
    headers.join(","),
    ...products.map((product) => headers.map((header) => `"${product[header]}"`).join(",")),
  ].join("\n")

  return csvContent
}


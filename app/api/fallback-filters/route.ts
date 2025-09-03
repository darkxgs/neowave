import { NextResponse } from "next/server"
import type { Filter } from "@/lib/FilterContext"

export async function GET() {
  try {
    console.log("API: Serving fallback filters")
    
    // Generate predefined filters that don't require KV store connection
    const generatePredefinedFilters = () => {
      const predefinedFilters: Filter[] = []

      // Temperature and Humidity filters
      const tempHumidFilters = [
        { name: "Duct", typeId: "temp-humid" },
        { name: "Water", typeId: "temp-humid" },
        { name: "Outdoor", typeId: "temp-humid" },
        { name: "Indoor", typeId: "temp-humid" },
        { name: "Temperature & Humidity", typeId: "temp-humid" },
        { name: "Temperature Only", typeId: "temp-humid" },
      ]

      // Air Quality filters
      const airQualityFilters = [
        { name: "Indoor", typeId: "air-quality" },
        { name: "Outdoor", typeId: "air-quality" },
        { name: "VOC", typeId: "air-quality" },
        { name: "CO", typeId: "air-quality" },
        { name: "CO2", typeId: "air-quality" },
        { name: "Wall Mounted", typeId: "air-quality" },
        { name: "Duct Mounted", typeId: "air-quality" },
      ]

      // Pressure filters
      const pressureFilters = [
        { name: "Switches", typeId: "pressure" },
        { name: "Sensors", typeId: "pressure" },
        { name: "Liquid", typeId: "pressure" },
        { name: "Air", typeId: "pressure" },
      ]

      // Process each filter group
      const allFilterGroups = [tempHumidFilters, airQualityFilters, pressureFilters]
      allFilterGroups.forEach((group) => {
        group.forEach((filter) => {
          predefinedFilters.push({
            id: `${filter.typeId}-${filter.name.toLowerCase().replace(/\s+/g, "-")}`,
            name: filter.name,
            typeId: filter.typeId,
            predefined: true,
          })
        })
      })

      return predefinedFilters
    }

    const fallbackFilters = generatePredefinedFilters()
    return NextResponse.json(fallbackFilters)
  } catch (error) {
    console.error("API: Error in fallback filters endpoint:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch fallback filters" }, 
      { status: 500 }
    )
  }
} 
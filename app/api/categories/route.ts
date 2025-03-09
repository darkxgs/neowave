import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import type { ProductCategory } from "@/lib/types/category"

const CATEGORIES_KEY = "product_categories"

export async function GET() {
  try {
    const categories = await kv.get<ProductCategory[]>(CATEGORIES_KEY)

    // If no categories exist, initialize with default categories
    if (!categories) {
      const defaultCategories = [
        {
          id: "io-modules",
          name: "I/O modules and data transmission",
          types: [
            { id: "industrial-switches", name: "Industrial switches" },
            { id: "io-modules", name: "I/O modules" },
          ],
        },
        {
          id: "sensors-switches",
          name: "Sensors and Switches",
          types: [
            { id: "temp-humid", name: "Temperature and humidity" },
            { id: "air-quality", name: "Air Quality" },
            { id: "pressure", name: "Pressure (Air & liquid)" },
            { id: "level", name: "Level Measuring" },
            { id: "flow", name: "Flow sensors (Air & liquid)" },
          ],
        },
        {
          id: "hvac-control",
          name: "HVAC control",
          types: [
            { id: "smart-thermostat", name: "Smart Thermostat" },
            { id: "damper-actuators", name: "Damper Actuators" },
          ],
        },
        {
          id: "power-energy",
          name: "Power & Energy",
          types: [
            { id: "btu-meters", name: "BTU Meters" },
            { id: "water-meters", name: "Water Meters" },
          ],
        },
        {
          id: "life-safety",
          name: "Life Safety Systems",
          types: [
            { id: "fire-alarm", name: "Fire Alarm Systems" },
            { id: "gas-detectors", name: "LPG & Natural Gas Detectors" },
          ],
        },
      ]

      await kv.set(CATEGORIES_KEY, defaultCategories)
      return NextResponse.json(defaultCategories)
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const categories = await request.json()

    // Validate categories structure
    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: "Invalid categories format" }, { status: 400 })
    }

    for (const category of categories) {
      if (!category.id || !category.name || !Array.isArray(category.types)) {
        return NextResponse.json({ error: "Invalid category structure" }, { status: 400 })
      }
    }

    await kv.set(CATEGORIES_KEY, categories)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating categories:", error)
    return NextResponse.json({ error: "Failed to update categories" }, { status: 500 })
  }
}


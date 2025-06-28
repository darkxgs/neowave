import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import type { ProductCategory } from "@/lib/types/category"

const CATEGORIES_KEY = "product_categories"

export async function GET() {
  try {
    console.log("API: Fetching categories from KV store")
    
    let categories
    try {
      categories = await kv.get<ProductCategory[]>(CATEGORIES_KEY)
      console.log("API: Raw categories data fetched:", categories)
    } catch (kvError) {
      console.error("API: KV store connection error:", kvError)
      throw new Error(`Database connection error: ${kvError instanceof Error ? kvError.message : "Unknown error"}`)
    }

    // If no categories exist, initialize with default categories
    if (!categories) {
      console.log("API: No categories found, initializing defaults")
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

      try {
        await kv.set(CATEGORIES_KEY, defaultCategories)
        console.log("API: Default categories saved")
        return NextResponse.json(defaultCategories)
      } catch (setError) {
        console.error("API: Error saving default categories:", setError)
        throw new Error(`Failed to save default categories: ${setError instanceof Error ? setError.message : "Unknown error"}`)
      }
    }

    console.log("API: Returning categories, count:", Array.isArray(categories) ? categories.length : "not an array")
    return NextResponse.json(categories)
  } catch (error) {
    console.error("API: Error in categories endpoint:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch categories" }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    console.log("API: Processing PUT request to update categories")
    const categories = await request.json()

    // Validate categories structure
    if (!Array.isArray(categories)) {
      console.error("API: Invalid categories format, not an array:", categories)
      return NextResponse.json({ error: "Invalid categories format" }, { status: 400 })
    }

    for (const category of categories) {
      if (!category.id || !category.name || !Array.isArray(category.types)) {
        console.error("API: Invalid category structure:", category)
        return NextResponse.json({ error: "Invalid category structure" }, { status: 400 })
      }
    }

    try {
      await kv.set(CATEGORIES_KEY, categories)
      console.log("API: Categories updated successfully")
      return NextResponse.json({ success: true })
    } catch (kvError) {
      console.error("API: KV store error during update:", kvError)
      throw new Error(`Database error: ${kvError instanceof Error ? kvError.message : "Unknown error"}`)
    }
  } catch (error) {
    console.error("API: Error updating categories:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update categories" }, 
      { status: 500 }
    )
  }
}


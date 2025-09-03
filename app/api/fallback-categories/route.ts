import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("API: Serving fallback categories")
    
    // Static fallback categories that don't require KV store connection
    const fallbackCategories = [
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

    return NextResponse.json(fallbackCategories)
  } catch (error) {
    console.error("API: Error in fallback categories endpoint:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch fallback categories" }, 
      { status: 500 }
    )
  }
} 
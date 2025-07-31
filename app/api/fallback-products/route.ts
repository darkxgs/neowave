import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("API: Serving fallback products")
    
    // Static fallback products that don't require KV store connection
    const fallbackProducts = [
      {
        id: "txtmpc101",
        name: "Temperature Sensor Module",
        code: "TxTMP-C101",
        category: "sensors-switches",
        type: "temp-humid",
        specifications: [
          {
            name: "Accuracy",
            options: [
              { value: "3", code: "3", label: "±3%RH(±0.3℃)" }
            ]
          },
          {
            name: "Output",
            options: [
              { value: "V10", code: "V10", label: "0-10VDC(Three-wired)" },
              { value: "A", code: "A", label: "4-20mA(Two-wired)" },
              { value: "RS", code: "RS", label: "RS485/Modbus" }
            ]
          },
          {
            name: "Range",
            options: [
              { value: "1", code: "1", label: "0-50C" },
              { value: "2", code: "2", label: "-20-60C" }
            ]
          }
        ],
        filters: ["temp-humid-duct", "temp-humid-temperature-only"],
        createdAt: "2023-05-15T00:00:00.000Z"
      },
      {
        id: "txcdp201",
        name: "Carbon Dioxide Sensor",
        code: "TxCDP-201",
        category: "sensors-switches",
        type: "air-quality",
        specifications: [
          {
            name: "Range",
            options: [
              { value: "2", code: "2", label: "2000ppm" },
              { value: "5", code: "5", label: "5000ppm" }
            ]
          },
          {
            name: "Output",
            options: [
              { value: "VA", code: "VA", label: "4-20mA/0-10VDC" },
              { value: "RS", code: "RS", label: "RS485/Modbus" }
            ]
          },
          {
            name: "Display",
            options: [
              { value: "1", code: "1", label: "Without display" },
              { value: "2", code: "2", label: "With display" }
            ]
          }
        ],
        filters: ["air-quality-co2", "air-quality-indoor"],
        createdAt: "2023-05-15T00:00:00.000Z"
      },
      {
        id: "txdp301",
        name: "Differential Pressure Sensor",
        code: "TxDP-301",
        category: "sensors-switches",
        type: "pressure",
        specifications: [
          {
            name: "Range",
            options: [
              { value: "101D", code: "101D", label: "0±100Pa (two-way)" },
              { value: "251D", code: "251D", label: "0±250Pa" }
            ]
          },
          {
            name: "Output",
            options: [
              { value: "V10", code: "V10", label: "0-10VDC (Three-wired)" },
              { value: "A", code: "A", label: "4-20mA (Two-wired)" }
            ]
          }
        ],
        filters: ["pressure-sensors", "pressure-air"],
        createdAt: "2023-05-15T00:00:00.000Z"
      }
    ]

    return NextResponse.json(fallbackProducts)
  } catch (error) {
    console.error("API: Error in fallback products endpoint:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch fallback products" }, 
      { status: 500 }
    )
  }
} 
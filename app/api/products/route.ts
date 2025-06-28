import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { put } from "@vercel/blob"

export async function GET() {
  try {
    console.log("API: Fetching products from KV store")
    
    let productKeys
    let productData = []
    
    try {
      productKeys = await kv.keys("product:*")
      console.log("API: Product keys fetched:", productKeys)
      
      if (productKeys && productKeys.length > 0) {
        productData = await Promise.all(productKeys.map((key) => kv.hgetall(key)))
        console.log("API: Products fetched successfully, count:", productData.length)
      } else {
        console.log("API: No product keys found")
      }
    } catch (kvError) {
      console.error("API: KV store connection error:", kvError)
      throw new Error(`Database connection error: ${kvError instanceof Error ? kvError.message : "Unknown error"}`)
    }
    
    return NextResponse.json(productData)
  } catch (error) {
    console.error("API: Error fetching products:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log("API: Processing product POST request")
    const formData = await request.formData()
    const dataString = formData.get("data")

    if (!dataString || typeof dataString !== "string") {
      throw new Error("Invalid or missing data in form submission")
    }

    let data
    try {
      data = JSON.parse(dataString)
      console.log("API: Parsed product data:", data)
    } catch (parseError) {
      console.error("API: Error parsing product data:", parseError)
      throw new Error(`Invalid JSON data: ${parseError.message}`)
    }

    // Validate required fields
    if (!data.code || !data.type || !data.category) {
      throw new Error("Missing required fields: code, type, or category")
    }

    const photo = formData.get("photo") as File | null

    const id = data.code.toLowerCase().replace(/[^a-z0-9]/g, "")

    let photoUrl = ""
    if (photo) {
      try {
        const blob = await put(photo.name, photo, {
          access: "public",
          addRandomSuffix: true,
        })

        photoUrl = blob.url
        console.log("API: Photo uploaded successfully:", {
          url: photoUrl,
          size: photo.size,
          type: photo.type,
        })
      } catch (uploadError) {
        console.error("API: Error uploading photo:", uploadError)
        throw new Error(
          `Failed to upload photo: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
        )
      }
    }

    const productData = {
      id,
      ...data,
      photoUrl,
      createdAt: new Date().toISOString(),
    }

    console.log("API: Saving product data to database:", productData)

    try {
      await kv.hset(`product:${id}`, productData)
      console.log("API: Product saved successfully:", id)
    } catch (dbError) {
      console.error("API: Error saving to database:", dbError)
      throw new Error(`Database error: ${dbError instanceof Error ? dbError.message : "Unknown error"}`)
    }

    return NextResponse.json({ success: true, id, photoUrl })
  } catch (error) {
    console.error("API: Error creating product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create product",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}


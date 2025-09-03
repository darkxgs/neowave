import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { productDb, handleDatabaseError } from "@/lib/database"

export async function GET() {
  try {
    console.log("API: Fetching products from PostgreSQL")
    
    const products = await productDb.getAll()
    console.log("API: Products fetched successfully, count:", products.length)
    
    // Transform the data to match frontend expectations
    const transformedProducts = products.map(product => {
      // Parse the specifications JSON if it exists
      let specifications = []
      let filters = []
      
      if (product.specifications) {
        try {
          const parsed = typeof product.specifications === 'string' 
            ? JSON.parse(product.specifications) 
            : product.specifications
          
          // Handle the combined format from database
          if (parsed.specifications) {
            specifications = parsed.specifications
          }
          if (parsed.filters) {
            filters = parsed.filters
          }
        } catch (parseError) {
          console.error("Error parsing specifications for product:", product.id, parseError)
          specifications = []
          filters = []
        }
      }
      
      return {
        ...product,
        specifications,
        filters
      }
    })
    
    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("API: Error fetching products:", error)
    handleDatabaseError(error, "fetching products")
  }
}

export async function POST(request: Request) {
  try {
    console.log("API: Starting product creation")
    
    const formData = await request.formData()
    const dataString = formData.get("data") as string
    const photo = formData.get("photo") as File | null
    
    if (!dataString) {
      console.log("API: No data field found")
      return NextResponse.json({ success: false, error: "No product data provided" }, { status: 400 })
    }
    
    let parsedData
    try {
      parsedData = JSON.parse(dataString)
    } catch (parseError) {
      console.error("API: Error parsing product data:", parseError)
      return NextResponse.json({ success: false, error: "Invalid product data format" }, { status: 400 })
    }
    
    const { code, type, category, description, name } = parsedData
    
    console.log("API: Product data received:", { code, type, category, description, name, photoName: photo?.name })
    
    if (!code || !type || !category || !name) {
      console.log("API: Missing required fields")
      return NextResponse.json({ success: false, error: "Missing required fields: code, type, category, and name are required" }, { status: 400 })
    }
    
    let photoUrl = ""
    
    if (photo && photo.size > 0) {
      try {
        console.log("API: Uploading photo to blob storage")
        const blob = await put(photo.name, photo, {
          access: "public",
        })
        photoUrl = blob.url
        console.log("API: Photo uploaded successfully:", photoUrl)
      } catch (blobError) {
        console.error("API: Error uploading photo:", blobError)
        console.log("API: Continuing without photo upload")
        // Continue without photo instead of failing the entire request
        photoUrl = ""
      }
    }
    
    const productDataToSave = {
      code,
      name,
      type,
      category,
      description,
      photo_url: photoUrl,
      datasheet_url: parsedData.datasheetUrl || "",
      specifications: parsedData.specifications || [],
      filters: parsedData.filters || [],
    }
    
    console.log("API: Saving product to PostgreSQL:", productDataToSave)
    
    try {
      const product = await productDb.create(productDataToSave)
      console.log("API: Product saved successfully")
      return NextResponse.json({ success: true, message: "Product created successfully", product })
    } catch (error) {
      console.error("API: Database save error:", error)
      return handleDatabaseError(error, "creating product")
    }
  } catch (error) {
    console.error("API: Error creating product:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}


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
          // Specifications are stored directly as JSON array
          const rawSpecs = typeof product.specifications === 'string' 
            ? JSON.parse(product.specifications) 
            : product.specifications
          
          // Filter out placeholder specifications (those with dots or empty values)
          specifications = rawSpecs.filter(spec => {
            // Skip specifications with placeholder names or empty options
            if (!spec.name || spec.name === '.' || spec.name.trim() === '') {
              return false
            }
            
            // Filter out options that are placeholders
            const validOptions = spec.options?.filter(option => 
              option.code !== '.' && 
              option.label !== '.' && 
              option.value !== '.' &&
              option.code?.trim() !== '' &&
              option.label?.trim() !== '' &&
              option.value?.trim() !== ''
            ) || []
            
            // Only include specifications that have valid options
            if (validOptions.length === 0) {
              return false
            }
            
            // Update the specification with filtered options
            spec.options = validOptions
            return true
          })
        } catch (parseError) {
          console.error("Error parsing specifications for product:", product.id, parseError)
          specifications = []
        }
      }
      
      // Parse filters if they exist (stored separately in the filters column)
      if (product.filters) {
        try {
          filters = typeof product.filters === 'string' 
            ? JSON.parse(product.filters) 
            : product.filters
        } catch (parseError) {
          console.error("Error parsing filters for product:", product.id, parseError)
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
          addRandomSuffix: true
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


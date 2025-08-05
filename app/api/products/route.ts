import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("API: Fetching products from Supabase")
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error("API: Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    // Transform snake_case to camelCase for frontend compatibility
    const transformedProducts = products?.map(product => ({
      ...product,
      photoUrl: product.photo_url,
      datasheetUrl: product.datasheet_url,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    })) || []
    
    console.log("API: Products fetched successfully, count:", transformedProducts.length)
    return NextResponse.json(transformedProducts)
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
      category: data.category,
      type: data.type,
      name: data.name,
      code: data.code,
      datasheet_url: data.datasheetUrl || null,
      photo_url: photoUrl || null,
      specifications: data.specifications || [],
      filters: data.filters || [],
    }

    console.log("API: Saving product data to database:", productData)

    const { data: insertedProduct, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      console.error("API: Error saving to database:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log("API: Product saved successfully:", insertedProduct.id)
    return NextResponse.json({ 
      success: true, 
      id: insertedProduct.id, 
      photoUrl,
      product: {
        ...insertedProduct,
        photoUrl: insertedProduct.photo_url,
        datasheetUrl: insertedProduct.datasheet_url,
        createdAt: insertedProduct.created_at,
        updatedAt: insertedProduct.updated_at
      }
    })
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


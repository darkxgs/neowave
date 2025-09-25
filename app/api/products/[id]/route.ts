import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { productDb, handleDatabaseError } from "@/lib/database"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await productDb.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return handleDatabaseError(error, "deleting product")
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
    // Get the existing product first to preserve photo URL if needed
    const existingProduct = await productDb.getById(id)
    
    // Handle both JSON and FormData
    let data
    let photoUrl = ""
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (from data entry form)
      const formData = await request.formData()
      const dataString = formData.get("data") as string
      const photo = formData.get("photo") as File | null
      
      console.log("API UPDATE: FormData received")
      console.log("API UPDATE: Photo present:", !!photo)
      console.log("API UPDATE: Photo size:", photo?.size || 0)
      console.log("API UPDATE: Photo name:", photo?.name || "none")
      
      if (!dataString) {
        return NextResponse.json({ success: false, error: "No product data provided" }, { status: 400 })
      }
      
      try {
        data = JSON.parse(dataString)
      } catch (parseError) {
        console.error("Error parsing product data:", parseError)
        return NextResponse.json({ success: false, error: "Invalid product data format" }, { status: 400 })
      }

      // Handle photo upload if a new photo is provided
      if (photo && photo.size > 0) {
        try {
          console.log("API: Uploading updated photo to blob storage")
          const blob = await put(photo.name, photo, {
            access: "public",
            addRandomSuffix: true
          })
          photoUrl = blob.url
          console.log("API: Photo uploaded successfully:", photoUrl)
          
          // Add the new photo URL to the data
          data.photo_url = photoUrl
        } catch (blobError) {
          console.error("API: Error uploading photo:", blobError)
          console.log("API: Continuing without photo upload")
          // Continue without photo instead of failing the entire request
        }
      } else {
        console.log("API UPDATE: No new photo provided, keeping existing photo")
        // Keep the existing photo URL if no new photo is provided
        if (existingProduct && existingProduct.photo_url) {
          data.photo_url = existingProduct.photo_url
          console.log("API UPDATE: Preserving existing photo URL:", existingProduct.photo_url)
        }
      }
    } else {
      // Handle JSON (from admin page)
      data = await request.json()
    }
    
    const product = await productDb.update(id, data)
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Error updating product:", error)
    return handleDatabaseError(error, "updating product")
  }
}


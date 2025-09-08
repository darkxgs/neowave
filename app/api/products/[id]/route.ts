import { NextResponse } from "next/server"
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
    
    // Handle both JSON and FormData
    let data
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (from data entry form)
      const formData = await request.formData()
      const dataString = formData.get("data") as string
      
      if (!dataString) {
        return NextResponse.json({ success: false, error: "No product data provided" }, { status: 400 })
      }
      
      try {
        data = JSON.parse(dataString)
      } catch (parseError) {
        console.error("Error parsing product data:", parseError)
        return NextResponse.json({ success: false, error: "Invalid product data format" }, { status: 400 })
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


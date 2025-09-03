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
    const data = await request.json()
    const product = await productDb.update(id, data)
    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Error updating product:", error)
    return handleDatabaseError(error, "updating product")
  }
}


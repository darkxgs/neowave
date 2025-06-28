import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await kv.del(`product:${id}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const data = await request.json()
    await kv.hset(`product:${id}`, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}


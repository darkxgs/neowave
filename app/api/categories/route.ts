import { NextResponse } from "next/server"
import { categoryDb, handleDatabaseError } from "@/lib/database"
import type { ProductCategory } from "@/lib/types/category"

export async function GET() {
  try {
    console.log("API: Fetching categories from PostgreSQL")
    
    const categories = await categoryDb.getAll()
    console.log("API: Categories fetched successfully, count:", categories.length)
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error("API: Error fetching categories:", error)
    return handleDatabaseError(error, "fetching categories")
  }
}

export async function PUT(request: Request) {
  try {
    const { categories } = await request.json()
    await categoryDb.updateAll(categories)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating categories:", error)
    return handleDatabaseError(error, "updating categories")
  }
}


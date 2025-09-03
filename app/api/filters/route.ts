import { NextResponse } from "next/server"
import { filterDb, handleDatabaseError } from "@/lib/database"
import type { Filter } from "@/lib/FilterContext"

export async function GET() {
  try {
    console.log("API: Fetching filters from PostgreSQL")
    
    const filters = await filterDb.getAll()
    console.log("API: Filters fetched successfully, count:", filters.length)
    
    return NextResponse.json(filters)
  } catch (error) {
    console.error("API: Error fetching filters:", error)
    return handleDatabaseError(error, "fetching filters")
  }
}

export async function POST(request: Request) {
  try {
    const filterData = await request.json()
    const filter = await filterDb.create(filterData)
    return NextResponse.json({ success: true, filter })
  } catch (error) {
    console.error("Error adding filter:", error)
    return handleDatabaseError(error, "creating filter")
  }
}

export async function DELETE(request: Request) {
  try {
    const { filterId } = await request.json()
    await filterDb.delete(filterId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting filter:", error)
    return handleDatabaseError(error, "deleting filter")
  }
}


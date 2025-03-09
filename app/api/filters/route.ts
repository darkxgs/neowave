import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import type { Filter } from "@/lib/FilterContext"

const FILTERS_KEY = "product_filters"

export async function GET() {
  try {
    const filters = await kv.get<Filter[]>(FILTERS_KEY)

    // If no filters exist, initialize with empty array
    if (!filters) {
      const emptyFilters: Filter[] = []
      await kv.set(FILTERS_KEY, emptyFilters)
      return NextResponse.json(emptyFilters)
    }

    return NextResponse.json(filters)
  } catch (error) {
    console.error("Error fetching filters:", error)
    return NextResponse.json({ error: "Failed to fetch filters" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const filter = (await request.json()) as Filter

    // Validate filter structure
    if (!filter.id || !filter.name || !filter.typeId) {
      return NextResponse.json({ error: "Invalid filter format" }, { status: 400 })
    }

    // Get existing filters
    const filters = (await kv.get<Filter[]>(FILTERS_KEY)) || []

    // Check for duplicates
    if (filters.some((f) => f.id === filter.id)) {
      return NextResponse.json({ error: "Filter already exists" }, { status: 409 })
    }

    // Add new filter
    filters.push(filter)

    // Save updated filters
    await kv.set(FILTERS_KEY, filters)

    return NextResponse.json({ success: true, filter })
  } catch (error) {
    console.error("Error adding filter:", error)
    return NextResponse.json({ error: "Failed to add filter" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Filter ID is required" }, { status: 400 })
    }

    // Get existing filters
    const filters = (await kv.get<Filter[]>(FILTERS_KEY)) || []

    // Filter out the one to remove
    const updatedFilters = filters.filter((f) => f.id !== id)

    // Save updated filters
    await kv.set(FILTERS_KEY, updatedFilters)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting filter:", error)
    return NextResponse.json({ error: "Failed to delete filter" }, { status: 500 })
  }
}


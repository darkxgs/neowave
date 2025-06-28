import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import type { Filter } from "@/lib/FilterContext"

const FILTERS_KEY = "product_filters"

export async function GET() {
  try {
    console.log("API: Fetching filters from KV store")
    
    let filters
    try {
      filters = await kv.get<Filter[]>(FILTERS_KEY)
      console.log("API: Raw filters data fetched:", filters)
    } catch (kvError) {
      console.error("API: KV store connection error:", kvError)
      throw new Error(`Database connection error: ${kvError instanceof Error ? kvError.message : "Unknown error"}`)
    }

    // If no filters exist, initialize with empty array
    if (!filters) {
      console.log("API: No filters found, initializing empty array")
      const emptyFilters: Filter[] = []
      
      try {
        await kv.set(FILTERS_KEY, emptyFilters)
        console.log("API: Empty filters array saved")
      } catch (setError) {
        console.error("API: Error saving empty filters:", setError)
        // Even if saving fails, return empty array
      }
      
      return NextResponse.json(emptyFilters)
    }

    console.log("API: Returning filters, count:", Array.isArray(filters) ? filters.length : "not an array")
    return NextResponse.json(filters)
  } catch (error) {
    console.error("API: Error fetching filters:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch filters" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("API: Processing POST request to add filter")
    const filter = (await request.json()) as Filter

    // Validate filter structure
    if (!filter.id || !filter.name || !filter.typeId) {
      console.error("API: Invalid filter format:", filter)
      return NextResponse.json({ error: "Invalid filter format" }, { status: 400 })
    }

    // Get existing filters
    let filters
    try {
      filters = (await kv.get<Filter[]>(FILTERS_KEY)) || []
    } catch (kvError) {
      console.error("API: KV store error when fetching filters:", kvError)
      return NextResponse.json(
        { error: `Database error: ${kvError instanceof Error ? kvError.message : "Unknown error"}` }, 
        { status: 500 }
      )
    }

    // Check for duplicates
    if (filters.some((f) => f.id === filter.id)) {
      console.log("API: Filter already exists:", filter.id)
      return NextResponse.json({ error: "Filter already exists" }, { status: 409 })
    }

    // Add new filter
    filters.push(filter)

    // Save updated filters
    try {
      await kv.set(FILTERS_KEY, filters)
      console.log("API: Filter added successfully:", filter)
    } catch (setError) {
      console.error("API: Error saving filter:", setError)
      return NextResponse.json(
        { error: `Database error: ${setError instanceof Error ? setError.message : "Unknown error"}` }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, filter })
  } catch (error) {
    console.error("API: Error adding filter:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add filter" }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    console.log("API: Processing DELETE request for filter")
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      console.error("API: Missing filter ID in DELETE request")
      return NextResponse.json({ error: "Filter ID is required" }, { status: 400 })
    }

    // Get existing filters
    let filters
    try {
      filters = (await kv.get<Filter[]>(FILTERS_KEY)) || []
    } catch (kvError) {
      console.error("API: KV store error when fetching filters for deletion:", kvError)
      return NextResponse.json(
        { error: `Database error: ${kvError instanceof Error ? kvError.message : "Unknown error"}` }, 
        { status: 500 }
      )
    }

    // Filter out the one to remove
    const updatedFilters = filters.filter((f) => f.id !== id)

    // Save updated filters
    try {
      await kv.set(FILTERS_KEY, updatedFilters)
      console.log("API: Filter deleted successfully:", id)
    } catch (setError) {
      console.error("API: Error saving updated filters after deletion:", setError)
      return NextResponse.json(
        { error: `Database error: ${setError instanceof Error ? setError.message : "Unknown error"}` }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API: Error deleting filter:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete filter" }, 
      { status: 500 }
    )
  }
}


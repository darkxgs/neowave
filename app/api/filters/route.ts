import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { Filter } from "@/lib/FilterContext"

export async function GET() {
  try {
    console.log("API: Fetching filters from Supabase")

    const { data: filters, error } = await supabase
      .from('product_filters')
      .select('*')
      .order('name')

    if (error) {
      console.error("API: Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    // Transform to match expected format
    const transformedFilters = filters?.map(filter => ({
      id: filter.id,
      name: filter.name,
      typeId: filter.type_id,
      predefined: filter.predefined
    })) || []

    console.log("API: Filters fetched successfully, count:", transformedFilters.length)
    return NextResponse.json(transformedFilters)
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

    // Insert new filter
    const { data: insertedFilter, error } = await supabase
      .from('product_filters')
      .insert([{
        id: filter.id,
        name: filter.name,
        type_id: filter.typeId,
        predefined: filter.predefined || false
      }])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        console.log("API: Filter already exists:", filter.id)
        return NextResponse.json({ error: "Filter already exists" }, { status: 409 })
      }
      console.error("API: Error saving filter:", error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log("API: Filter added successfully:", insertedFilter)
    return NextResponse.json({
      success: true, filter: {
        id: insertedFilter.id,
        name: insertedFilter.name,
        typeId: insertedFilter.type_id,
        predefined: insertedFilter.predefined
      }
    })
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

    // Delete filter from Supabase
    const { error } = await supabase
      .from('product_filters')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("API: Error deleting filter:", error)
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }

    console.log("API: Filter deleted successfully:", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API: Error deleting filter:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete filter" },
      { status: 500 }
    )
  }
}


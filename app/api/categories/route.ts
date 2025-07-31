import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { ProductCategory } from "@/lib/types/category"

export async function GET() {
  try {
    console.log("API: Fetching categories from Supabase")
    
    const { data: categories, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name')

    if (error) {
      console.error("API: Supabase error:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log("API: Categories fetched successfully, count:", categories?.length || 0)
    return NextResponse.json(categories || [])
  } catch (error) {
    console.error("API: Error in categories endpoint:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch categories" }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    console.log("API: Processing PUT request to update categories")
    const categories = await request.json()

    // Validate categories structure
    if (!Array.isArray(categories)) {
      console.error("API: Invalid categories format, not an array:", categories)
      return NextResponse.json({ error: "Invalid categories format" }, { status: 400 })
    }

    for (const category of categories) {
      if (!category.id || !category.name || !Array.isArray(category.types)) {
        console.error("API: Invalid category structure:", category)
        return NextResponse.json({ error: "Invalid category structure" }, { status: 400 })
      }
    }

    // Update categories in Supabase
    const updates = categories.map(category => ({
      id: category.id,
      name: category.name,
      types: category.types
    }))

    const { error } = await supabase
      .from('product_categories')
      .upsert(updates)

    if (error) {
      console.error("API: Supabase error during update:", error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log("API: Categories updated successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API: Error updating categories:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update categories" }, 
      { status: 500 }
    )
  }
}


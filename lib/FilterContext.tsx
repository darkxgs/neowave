"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import { kv } from "@vercel/kv"

export type Filter = {
  id: string
  name: string
  typeId: string
  predefined?: boolean
}

type FilterContextType = {
  filters: Filter[]
  addFilter: (filter: Filter) => Promise<void>
  removeFilter: (id: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

const FILTERS_KEY = "product_filters"

// Helper function to generate predefined filters
const generatePredefinedFilters = () => {
  const predefinedFilters: Filter[] = []

  // Temperature and Humidity filters
  const tempHumidFilters = [
    { name: "Duct", typeId: "temp-humid" },
    { name: "Water", typeId: "temp-humid" },
    { name: "Outdoor", typeId: "temp-humid" },
    { name: "Indoor", typeId: "temp-humid" },
    { name: "Temperature & Humidity", typeId: "temp-humid" },
    { name: "Temperature Only", typeId: "temp-humid" },
  ]

  // Air Quality filters
  const airQualityFilters = [
    { name: "Indoor", typeId: "air-quality" },
    { name: "Outdoor", typeId: "air-quality" },
    { name: "VOC", typeId: "air-quality" },
    { name: "CO", typeId: "air-quality" },
    { name: "CO2", typeId: "air-quality" },
    { name: "Wall Mounted", typeId: "air-quality" },
    { name: "Duct Mounted", typeId: "air-quality" },
  ]

  // Pressure filters
  const pressureFilters = [
    { name: "Switches", typeId: "pressure" },
    { name: "Sensors", typeId: "pressure" },
    { name: "Liquid", typeId: "pressure" },
    { name: "Air", typeId: "pressure" },
  ]

  // Process each filter group
  const allFilterGroups = [tempHumidFilters, airQualityFilters, pressureFilters]
  allFilterGroups.forEach((group) => {
    group.forEach((filter) => {
      predefinedFilters.push({
        id: `${filter.typeId}-${filter.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: filter.name,
        typeId: filter.typeId,
        predefined: true,
      })
    })
  })

  return predefinedFilters
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFilters()
  }, [])

  // Update the fetchFilters function to ensure predefined filters are always loaded
  const fetchFilters = async () => {
    try {
      setIsLoading(true)

      // Fetch custom filters from API endpoint instead of directly from KV store
      const response = await fetch("/api/filters")
      if (!response.ok) {
        throw new Error("Failed to fetch filters from API")
      }

      const storedFilters = await response.json()
      console.log("Fetched filters from API:", storedFilters)

      // Get predefined filters
      const predefinedFilters = generatePredefinedFilters()

      // Combine predefined and custom filters
      // Filter out any custom filters that have the same ID as predefined ones
      const customFilters = storedFilters.filter((filter) => !predefinedFilters.some((pf) => pf.id === filter.id))

      const allFilters = [...predefinedFilters, ...customFilters]

      console.log("Loaded filters:", {
        predefined: predefinedFilters.length,
        custom: customFilters.length,
        total: allFilters.length,
      })

      setFilters(allFilters)
      setError(null)
    } catch (error) {
      console.error("Error fetching filters:", error)
      setError("Failed to load filters")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the addFilter function to ensure it properly saves and returns the filter
  const addFilter = async (filter: Filter): Promise<Filter> => {
    try {
      // Check for duplicates
      if (filters.some((f) => f.id === filter.id)) {
        throw new Error("Filter already exists")
      }

      // Don't allow modifying predefined filters
      if (filter.predefined) {
        throw new Error("Cannot modify predefined filters")
      }

      // Add to state
      const updatedFilters = [...filters, filter]
      setFilters(updatedFilters)

      // Save to API endpoint
      const response = await fetch("/api/filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filter),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save filter")
      }

      console.log("Filter saved successfully:", filter)

      // Refresh filters from server to ensure consistency
      fetchFilters()

      return filter // Return the added filter
    } catch (error) {
      console.error("Error adding filter:", error)
      setError(error instanceof Error ? error.message : "Failed to add filter")
      throw error
    }
  }

  const removeFilter = async (id: string) => {
    try {
      // Don't allow removing predefined filters
      const filterToRemove = filters.find((f) => f.id === id)
      if (filterToRemove?.predefined) {
        throw new Error("Cannot remove predefined filters")
      }

      // Remove from state
      const updatedFilters = filters.filter((f) => f.id !== id)
      setFilters(updatedFilters)

      // Only save custom filters to KV store
      const customFilters = updatedFilters.filter((f) => !f.predefined)
      await kv.set(FILTERS_KEY, customFilters)
    } catch (error) {
      console.error("Error removing filter:", error)
      setError("Failed to remove filter")
      throw error
    }
  }

  return (
    <FilterContext.Provider value={{ filters, addFilter, removeFilter, isLoading, error }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}


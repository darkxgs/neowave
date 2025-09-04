"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"

export type Filter = {
  id: string
  name: string
  typeId: string
  predefined?: boolean
}

type FilterContextType = {
  filters: Filter[]
  addFilter: (filter: Filter) => Promise<any>
  removeFilter: (id: string) => Promise<void>
  isLoading: boolean
  error: string | null
  refetchFilters: () => Promise<void>
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

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
      console.log("Fetching filters...")
      setIsLoading(true)
      setError(null)

      // Try the primary endpoint first
      try {
        // Fetch custom filters from API endpoint
        const response = await fetch("/api/filters")
        console.log("Filters API response status:", response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error("API error response:", errorText)
          throw new Error(`Failed to fetch filters: ${response.status} ${errorText}`)
        }

        const storedFilters = await response.json()
        console.log("Fetched filters from API:", storedFilters)

        // Get predefined filters
        const predefinedFilters = generatePredefinedFilters()

        // Combine predefined and custom filters
        // Filter out any custom filters that have the same ID as predefined ones
        const customFilters = Array.isArray(storedFilters) 
          ? storedFilters.filter((filter) => !predefinedFilters.some((pf) => pf.id === filter.id))
          : []

        const allFilters = [...predefinedFilters, ...customFilters]

        console.log("Loaded filters:", {
          predefined: predefinedFilters.length,
          custom: customFilters.length,
          total: allFilters.length,
        })

        setFilters(allFilters)
        return
      } catch (primaryError) {
        console.error("Primary filters endpoint failed, trying fallback:", primaryError)
        
        // Try the fallback endpoint
        const fallbackResponse = await fetch("/api/fallback-filters")
        
        if (!fallbackResponse.ok) {
          throw new Error(`Both primary and fallback endpoints failed`)
        }
        
        const fallbackFilters = await fallbackResponse.json()
        console.log("Fallback filters fetched:", fallbackFilters)
        
        if (!fallbackFilters || !Array.isArray(fallbackFilters)) {
          throw new Error("Invalid data format from fallback API")
        }
        
        setFilters(fallbackFilters)
      }
    } catch (error) {
      console.error("Error fetching filters:", error)
      setError("Failed to load filters")
      
      // Even in case of error, set the predefined filters
      // to ensure the application can continue to work
      setFilters(generatePredefinedFilters())
    } finally {
      setIsLoading(false)
    }
  }

  // Update the addFilter function to handle errors more gracefully
  const addFilter = async (filter: Filter) => {
    try {
      setError(null)
      
      // Check for duplicates
      if (filters.some((f) => f.id === filter.id)) {
        throw new Error("Filter already exists")
      }

      // Don't allow modifying predefined filters
      if (filter.predefined) {
        throw new Error("Cannot modify predefined filters")
      }

      // Add to state optimistically
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
      return filter
    } catch (error) {
      console.error("Error adding filter:", error)
      setError(error instanceof Error ? error.message : "Failed to add filter")
      
      // Revert the optimistic update
      setFilters((prevFilters) => prevFilters.filter((f) => f.id !== filter.id))
      throw error
    }
  }

  const removeFilter = async (id: string) => {
    try {
      setError(null)
      
      // Don't allow removing predefined filters
      const filterToRemove = filters.find((f) => f.id === id)
      if (filterToRemove?.predefined) {
        throw new Error("Cannot remove predefined filters")
      }

      // Remove from state optimistically
      const previousFilters = [...filters]
      setFilters((prev) => prev.filter((f) => f.id !== id))

      try {
        // Delete from API
        const response = await fetch(`/api/filters`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filterId: id }),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete filter")
        }
        
        console.log("Filter removed successfully:", id)
      } catch (apiError) {
        console.error("Error removing filter from API:", apiError)
        // Restore previous state if API call fails
        setFilters(previousFilters)
        throw apiError
      }
    } catch (error) {
      console.error("Error removing filter:", error)
      setError(error instanceof Error ? error.message : "Failed to remove filter")
      throw error
    }
  }

  return (
    <FilterContext.Provider value={{ 
      filters, 
      addFilter, 
      removeFilter, 
      isLoading, 
      error,
      refetchFilters: fetchFilters 
    }}>
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


"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, Thermometer, Wind, Gauge, Ruler, Download } from "lucide-react"
import { sensorTypes, modelSpecifications, sensorModels } from "@/lib/data"
import { toast } from "sonner"
import Image from "next/image"
import { ProductCategorySelector } from "./product-category-selector"
import { SelectionProgress } from "./selection-progress"
import { FilterOption } from "./filter-option"
// import { ProductDetails } from "./product-details"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { useCategories } from "@/lib/CategoryContext"

const STEPS = ["category", "type", "filter", "model", "specs"]

const modelCharacteristics = {
  // Existing temperature and humidity models
  TxTH52: { outdoor: true, tempHumidity: true },
  TxTH28N: { duct: true, tempHumidity: true },
  "TxTH91-XP": { indoor: true, tempHumidity: true },
  TxSL22: { water: true, tempOnly: true, level: true },
  TxTH1P: { duct: true, tempHumidity: true },
  TxT02: { duct: true, tempOnly: true },
  TxTH28: { indoor: true, tempHumidity: true },
  TxTH25: { indoor: true, tempHumidity: true },

  // Add air quality sensor models
  TxCOW31: { outdoor: true, co: true, wallMounted: true },
  TxCOI32: { indoor: true, co: true },
  TxCDW33: { outdoor: true, co2: true, wallMounted: true },
  TxCDD34: { indoor: true, co2: true, ductMounted: true },
  TxCDI35: { indoor: true, co2: true },
  TxAQ37: { indoor: true, voc: true, co2: true },
  TxCDT380: { indoor: true, outdoor: true, co2: true, wallMounted: true, ductMounted: true },

  // Pressure sensors
  TXADP12: { sensors: true, air: true },
  DPS52: { switches: true, liquid: true, air: true },
  DPS18: { switches: true, air: true },
  TxDP35: { sensors: true, air: true },
  TxLDP16: { sensors: true, air: true },
}

export function ProductSelector() {
  const [step, setStep] = useState<"category" | "type" | "filter" | "model" | "specs">("category")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [model, setModel] = useState("")
  const [copied, setCopied] = useState(false)
  const [specs, setSpecs] = useState<Record<string, string>>({})
  const [filters, setFilters] = useState<Record<string, boolean>>({
    duct: false,
    water: false,
    outdoor: false,
    indoor: false,
    tempHumidity: false,
    tempOnly: false,
    co: false,
    co2: false,
    voc: false,
    wallMounted: false,
    ductMounted: false,
    switches: false,
    sensors: false,
    liquid: false,
    air: false,
  })
  const [description, setDescription] = useState("")
  const [productCode, setProductCode] = useState("")
  const [customProducts, setCustomProducts] = useState<any[]>([])
  const [availableFilters, setAvailableFilters] = useState<any[]>([])

  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { categories, isLoading } = useCategories()

  useEffect(() => {
    const fetchCustomProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error("Failed to fetch custom products")
        }
        const data = await response.json()
        console.log("Fetched custom products:", data) // Add this log
        setCustomProducts(data)
      } catch (error) {
        console.error("Error fetching custom products:", error)
      }
    }

    fetchCustomProducts()
  }, [])

  // Add this after the existing useEffect for fetching products (around line 50-60)
  useEffect(() => {
    // This will ensure filters are properly loaded and synchronized
    const syncFilters = async () => {
      try {
        // Fetch filters directly from the API to ensure we have the latest data
        const response = await fetch("/api/filters")
        if (!response.ok) {
          throw new Error("Failed to fetch filters")
        }
        const data = await response.json()
        console.log("Fetched filters:", data)
        setAvailableFilters(data)

        // If we have a selected type, update the active filters
        if (selectedType) {
          const typeFilters = data.filter((f) => f.typeId === selectedType)
          console.log("Available filters for type:", typeFilters)
        }
      } catch (error) {
        console.error("Error fetching filters:", error)
      }
    }

    syncFilters()
  }, [selectedType]) // Re-run when selectedType changes

  useEffect(() => {
    // Reset filters when type changes
    setFilters((prev) => {
      const newFilters: Record<string, boolean> = {}
      // Copy over predefined filters
      Object.keys(prev).forEach((key) => {
        newFilters[key] = false
      })
      // Add custom filters
      availableFilters.forEach((filter) => {
        newFilters[filter.id] = false
      })
      return newFilters
    })
  }, [selectedType, availableFilters])

  const selectedSensorType = sensorTypes.find((type) => type.id === selectedType)
  const selectedModel = model ? modelSpecifications[model as keyof typeof modelSpecifications] : null

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "temp-humid":
        return <Thermometer className="h-5 w-5" />
      case "air-quality":
        return <Wind className="h-5 w-5" />
      case "pressure":
        return <Gauge className="h-5 w-5" />
      case "level":
        return <Ruler className="h-5 w-5" />
      case "flow":
        return <Download className="h-5 w-5" />
      default:
        return null
    }
  }

  const getRequiredSpecs = () => {
    if (!selectedType || !model) return []

    const customProduct = customProducts.find(
      (product) => product.code && product.code.split("-")[0] === model.split("-")[0],
    )
    if (customProduct) {
      console.log("Found custom product specs:", customProduct.specifications)
      return customProduct.specifications.map((spec: any) => spec.name)
    }

    if (!selectedModel) return []
    return Object.keys(selectedModel.availableOptions)
  }

  const getSpecOptions = (specType: string) => {
    if (!selectedType || !model) return []

    const customProduct = customProducts.find(
      (product) => product.code && product.code.split("-")[0] === model.split("-")[0],
    )
    if (customProduct) {
      console.log("Getting spec options for:", specType)
      const spec = customProduct.specifications.find((s: any) => s.name === specType)
      if (spec) {
        console.log("Found specification:", spec)
        return spec.options
      }
      return []
    }

    const availableOptions = selectedModel.availableOptions[specType]
    if (!availableOptions) return []

    try {
      // If availableOptions is a string, it refers to a measureRange type
      if (typeof availableOptions === "string") {
        const rangeType = availableOptions
        return selectedSensorType?.specifications.measureRange?.[rangeType] || []
      }

      // If availableOptions is an array of strings, map them to the specifications
      if (Array.isArray(availableOptions) && typeof availableOptions[0] === "string") {
        const specOptions = selectedSensorType?.specifications[specType]
        if (!Array.isArray(specOptions)) return []
        return specOptions.filter((opt) => availableOptions.includes(opt.value))
      }

      // If availableOptions is already an array of objects with value and label
      if (Array.isArray(availableOptions) && typeof availableOptions[0] === "object") {
        return availableOptions
      }

      return []
    } catch (error) {
      console.error("Error getting spec options:", error)
      return []
    }
  }

  const generateProductCode = (currentSpecs: Record<string, string>) => {
    if (!selectedType || !model) return ""

    const customProduct = customProducts.find(
      (product) => product.code && product.code.split("-")[0] === model.split("-")[0],
    )

    // Handle custom products
    if (customProduct) {
      console.log("Generating code for custom product:", customProduct)
      console.log("Current specs:", currentSpecs)

      const allSpecsSelected = customProduct.specifications.every((spec: any) => currentSpecs[spec.name])
      if (!allSpecsSelected) {
        toast.error("Please select all specifications to generate the product code")
        return ""
      }

      const specCodes = customProduct.specifications.map((spec: any) => {
        const selectedOption = spec.options.find((opt: any) => opt.value === currentSpecs[spec.name])
        return selectedOption?.code || ""
      })

      const baseCode = customProduct.code.split("-")[0]
      const newCode = `${baseCode}-${specCodes.join("-")}`
      console.log("Generated code:", newCode)
      return newCode
    }

    // Handle standard models
    const modelSpec = modelSpecifications[model as keyof typeof modelSpecifications]
    if (!modelSpec) {
      console.error("Model specifications not found:", model)
      return ""
    }

    // Check if all required specifications are selected
    const requiredSpecs = getRequiredSpecs()
    const missingSpecs = requiredSpecs.filter((spec) => !currentSpecs[spec])

    if (missingSpecs.length > 0) {
      const missingSpecsFormatted = missingSpecs.map((spec) => spec.replace(/([A-Z])/g, " $1").toLowerCase()).join(", ")
      toast.error(`Please select all required specifications: ${missingSpecsFormatted}`)
      return ""
    }

    try {
      const code = modelSpec.generateCode(currentSpecs)
      if (!code) {
        toast.error("Unable to generate product code. Please check your selections.")
        return ""
      }
      return code
    } catch (error) {
      console.error("Error generating product code:", error)
      toast.error("Error generating product code. Please try again.")
      return ""
    }
  }

  const handleSpecChange = (specType: string, value: string) => {
    console.log("Changing spec for custom product:", specType, "to value:", value)
    setSpecs((prev) => {
      const newSpecs = { ...prev, [specType]: value }
      console.log("New specs state for custom product:", newSpecs)
      const newCode = generateProductCode(newSpecs)
      if (newCode) {
        setProductCode(newCode)
        setDescription(getDetailedDescription())
      }
      return newSpecs
    })
  }

  const resetSelections = () => {
    setStep("category")
    setSelectedCategory("")
    setSelectedType("")
    setModel("")
    setSpecs({})
    setFilters({
      duct: false,
      water: false,
      outdoor: false,
      indoor: false,
      tempHumidity: false,
      tempOnly: false,
      co: false,
      co2: false,
      voc: false,
      wallMounted: false,
      ductMounted: false,
      switches: false,
      sensors: false,
      liquid: false,
      air: false,
    })
    setProductCode("")
    setDescription("")
    // setComparisonList([])
  }

  const copyToClipboard = async (text: string, type: "code" | "description") => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand("copy")
          textArea.remove()
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err)
          textArea.remove()
          throw new Error("Copy failed")
        }
      }
      if (type === "code") {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
      toast.success(`${type === "code" ? "Product code" : "Description"} copied to clipboard!`)
    } catch (error) {
      console.error("Copy failed:", error)
      toast.error(
        `Failed to copy ${type === "code" ? "product code" : "description"}. Please try manually selecting and copying.`,
      )
    }
  }

  const copyDescription = async () => {
    if (description) {
      await navigator.clipboard.writeText(description)
      toast.success("Product description copied to clipboard!")
    }
  }

  // const addToComparison = () => {
  //   const productCode = generateProductCode()
  //   if (productCode && !comparisonList.includes(productCode)) {
  //     setComparisonList((prev) => [...prev, productCode])
  //     toast.success("Product added to comparison")
  //   } else if (comparisonList.includes(productCode)) {
  //     toast.error("This product is already in the comparison list")
  //   }
  // }

  // const removeFromComparison = (productCode: string) => {
  //   setComparisonList((prev) => prev.filter((code) => code !== productCode))
  // }

  // Let's update the filter handling in the ProductSelector component to ensure filters are properly applied

  // Find the handleFilterApply function and update it
  const handleFilterApply = () => {
    // Log active filters for debugging
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key]) => key)

    console.log("Applying filters:", activeFilters)

    // Continue to model selection
    setStep("model")
  }

  // Updated getFilteredModels function
  const getFilteredModels = (sensorType: any) => {
    // For non-sensor categories, only show custom products
    if (!sensorType?.specifications?.model) {
      const activeFilters = Object.entries(filters)
        .filter(([_, value]) => value)
        .map(([key]) => key)

      console.log("Active filters for custom products:", activeFilters)

      // If no filters are active, show all products of this type
      if (activeFilters.length === 0) {
        return customProducts
          .filter((product) => product.type === selectedType)
          .map((product) => ({
            value: product.code,
            label: product.name,
          }))
      }

      // Filter products based on active filters
      return customProducts
        .filter((product) => {
          // First check if product is of the correct type
          if (product.type !== selectedType) return false

          // For the 5 ports filter, check specifications
          if (activeFilters.includes("industrial-switches-5-ports-1741512599592")) {
            // Check if product actually has 5 ports in its specifications
            const hasPortsSpec = product.specifications?.some(
              (spec) =>
                spec.name.toLowerCase().includes("port") &&
                spec.options.some((opt) => opt.value === "5" || opt.label === "5"),
            )

            // If it's not actually a 5-port product, filter it out
            if (!hasPortsSpec && product.code !== "5ports-5x") {
              return false
            }
          }

          // Check if product has ALL of the active filters
          return activeFilters.every((filterId) => product.filters?.includes(filterId))
        })
        .map((product) => ({
          value: product.code,
          label: product.name,
        }))
    }

    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key]) => key)

    console.log("Active filters for model filtering:", activeFilters)

    // Get all available models for this type
    const availableModels = [...(sensorType.specifications.model || [])]

    // Add matching custom products
    customProducts.forEach((product) => {
      if (product.type === selectedType) {
        // Only add custom products that match ALL active filters
        const hasMatchingFilters =
          activeFilters.length === 0 ||
          (product.filters && activeFilters.every((filterId) => product.filters.includes(filterId)))

        if (hasMatchingFilters) {
          availableModels.push({
            value: product.code,
            label: product.name,
          })
        }
      }
    })

    // If no filters are active, return all models
    if (activeFilters.length === 0) {
      return availableModels
    }

    // Filter models based on active filters
    return availableModels.filter((modelOption) => {
      const modelInfo = modelCharacteristics[modelOption.value as keyof typeof modelCharacteristics]
      if (!modelInfo) {
        // For custom products, check if they match ALL filters
        const customProduct = customProducts.find((p) => p.code === modelOption.value)
        if (customProduct) {
          return activeFilters.every((filterId) => customProduct.filters?.includes(filterId))
        }
        return false
      }

      // For predefined models, check if they match ALL filters
      return activeFilters.every((filter) => !!modelInfo[filter as keyof typeof modelInfo])
    })
  }

  const getProductDescription = () => {
    if (!selectedType || !model) return ""
    const modelSpec = modelSpecifications[model as keyof typeof modelSpecifications]
    return modelSpec?.description || ""
  }

  const getDetailedDescription = () => {
    if (!selectedType || !model || !specs) return ""

    const customProduct = customProducts.find(
      (product) => product.code && product.code.split("-")[0] === model.split("-")[0],
    )
    if (customProduct) {
      const specDescriptions = customProduct.specifications
        .map((spec: any) => {
          const selectedValue = specs[spec.name]
          const selectedOption = spec.options.find((opt: any) => opt.value === selectedValue)
          if (!selectedValue) return `${spec.name}: Not selected`
          return `${spec.name}: ${selectedOption?.label || selectedValue}`
        })
        .join(" | ")

      return `${customProduct.name} - ${specDescriptions}`
    }

    // Rest of the function remains the same
    const modelName = sensorModels[selectedType]?.find((m) => m.id === model)?.name || ""
    const specDescriptions = Object.entries(specs)
      .map(([key, value]) => {
        if (!value) return `${key.replace(/([A-Z])/g, " $1").toLowerCase()}: Not selected`
        const specOptions = getSpecOptions(key)
        const specLabel = specOptions.find((opt) => opt.value === value)?.label || value
        return `${key.replace(/([A-Z])/g, " $1").toLowerCase()}: ${specLabel}`
      })
      .join(" | ")

    return `${modelName} with ${specDescriptions}`
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setStep("type")
  }

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    // Skip filter step for types that don't have filters
    if (["level", "flow"].includes(typeId)) {
      setStep("model")
    } else {
      setStep("filter")
    }
  }

  const handleModelSelect = (modelId: string) => {
    setModel(modelId)
    setProductCode("")
    setDescription("")

    const customProduct = customProducts.find(
      (product) => product.code && product.code.split("-")[0] === modelId.split("-")[0],
    )
    if (customProduct) {
      console.log("Selected custom product:", customProduct)

      // Initialize specs with empty values for all specifications
      const initialSpecs = customProduct.specifications.reduce((acc: Record<string, string>, spec: any) => {
        acc[spec.name] = ""
        return acc
      }, {})

      setSpecs(initialSpecs)
      console.log("Initialized specs:", initialSpecs)
    } else {
      setSpecs({})
    }
    setStep("specs")
  }

  const handleDatasheetDownload = () => {
    // First check if it's a custom product
    const customProduct = customProducts.find(
      (product) => product.code && product.code.split("-")[0] === model.split("-")[0],
    )
    if (customProduct && customProduct.datasheetUrl) {
      window.open(customProduct.datasheetUrl, "_blank")
      return
    }

    const datasheetUrls: Record<string, string> = {
      // Temperature and Humidity Sensors
      TxTH52: "https://neowave.tech/wp-content/uploads/2024/09/TxTH52-1.pdf",
      TxTH28N: "https://neowave.tech/wp-content/uploads/2024/09/TxTH28N-3.pdf",
      "TxTH91-XP": "https://neowave.tech/wp-content/uploads/2024/07/TxTH91-XP-2.pdf",
      TxTH91: "https://neowave.tech/wp-content/uploads/2024/07/TxTH91-XP-2.pdf", // Alternative code
      TxTHP: "https://neowave.tech/wp-content/uploads/2024/02/pdf-1.pdf",
      TxT02: "https://neowave.tech/wp-content/uploads/2024/02/TxT02.pdf",
      TxTH28: "https://neowave.tech/wp-content/uploads/2024/02/PDF.pdf",
      TxTH25: "https://neowave.tech/wp-content/uploads/2024/02/PDF.pdf", // Same as TxTH28

      // Air Quality Sensors
      AQS820: "https://neowave.tech/wp-content/uploads/2024/11/AQS820-1.pdf",
      TxCOI8: "https://neowave.tech/wp-content/uploads/2024/11/TxCOI8-2.pdf",
      TxCOI32: "https://neowave.tech/wp-content/uploads/2024/11/TxCOI8-2.pdf", // Alternative code
      TxAQ84: "https://neowave.tech/wp-content/uploads/2024/09/TxAQ84-1.pdf",
      TxAQ37: "https://neowave.tech/wp-content/uploads/2024/09/TxAQ84-1.pdf", // Alternative code
      TxCDT: "https://neowave.tech/wp-content/uploads/2024/03/TXCDT.pdf",
      TxCDT380: "https://neowave.tech/wp-content/uploads/2024/03/TXCDT.pdf", // Alternative code
      TxCOW: "https://neowave.tech/wp-content/uploads/2024/02/Wall-mounted-electrochemical-CO-sensor-1.pdf",
      TxCOW31: "https://neowave.tech/wp-content/uploads/2024/02/Wall-mounted-electrochemical-CO-sensor-1.pdf", // Alternative code
      TxCDI: "https://neowave.tech/wp-content/uploads/2024/02/Indoor-CO2-Monitor-Transmitter-TxCDI-1.pdf",
      TxCDI35: "https://neowave.tech/wp-content/uploads/2024/02/Indoor-CO2-Monitor-Transmitter-TxCDI-1.pdf", // Alternative code
      TxCDD: "https://neowave.tech/wp-content/uploads/2024/02/TxCDD-1-1.pdf",
      TxCDD34: "https://neowave.tech/wp-content/uploads/2024/02/TxCDD-1-1.pdf", // Alternative code
      TxCDW: "https://neowave.tech/wp-content/uploads/2024/02/Wall-Mounted-CO2-Monitor-Transmitter.pdf",
      TxCDW33: "https://neowave.tech/wp-content/uploads/2024/02/Wall-Mounted-CO2-Monitor-Transmitter.pdf", // Alternative code

      // Pressure Sensors
      TXADP12: "https://neowave.tech/wp-content/uploads/2024/03/TXADP12-1.pdf",
      DPS52: "https://neowave.tech/wp-content/uploads/2024/02/DPS52-2.pdf",
      DPS18: "https://neowave.tech/wp-content/uploads/2024/02/DPS18-1.pdf",
      TxDP35: "https://neowave.tech/wp-content/uploads/2024/02/TxDP35.pdf",
      TxLDP16: "https://neowave.tech/wp-content/uploads/2024/02/TxLDP16-1.pdf",

      // Level and Flow Sensors
      TxSL20: "https://neowave.tech/wp-content/uploads/2024/02/TxSL20-1.pdf",
      TxSL22: "https://neowave.tech/wp-content/uploads/2024/02/TxSL22.pdf",
      LFS22: "https://neowave.tech/wp-content/uploads/2024/02/LFS22.pdf",

      // HVAC Control
      "VTRM20-XP": "https://neowave.tech/wp-content/uploads/2024/09/VTRM20-XP-2.pdf",
      VTRM20: "https://neowave.tech/wp-content/uploads/2024/09/VTRM20-XP-2.pdf", // Alternative code
    }

    const baseModelCode = model.split("-")[0]
    console.log("Attempting to find datasheet for model:", baseModelCode)

    const datasheetUrl = datasheetUrls[baseModelCode]

    if (datasheetUrl) {
      console.log("Opening datasheet URL:", datasheetUrl)
      window.open(datasheetUrl, "_blank")
    } else {
      console.log("No datasheet found for model:", baseModelCode)
      toast.error(
        customProduct ? "No datasheet URL provided for this custom product" : "Datasheet not available for this model",
      )
    }
  }

  return (
    <>
      <Card className="bg-[#1B2531] border-[#2a3744]" role="region" aria-label="Product Selector">
        <CardHeader className="flex flex-row items-center justify-between" aria-label="Product Selector Header">
          <CardTitle className="text-[#40C4FF] text-xl font-normal">Product Selector</CardTitle>
          <Button
            onClick={resetSelections}
            variant="outline"
            className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
          >
            Reset
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 px-3 sm:px-6">
          <SelectionProgress steps={STEPS} currentStep={step} />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-medium text-gray-200">
              {step === "category" && "Select Product Category"}
              {step === "type" && "Select Sensor Type"}
              {step === "filter" && "Filter Options"}
              {step === "model" && "Select Model"}
              {step === "specs" && "Select Specifications"}
            </h3>
            {step !== "category" && (
              <Button
                onClick={() => {
                  setStep(STEPS[STEPS.indexOf(step) - 1])
                  setProductCode("")
                  setDescription("")
                }}
                variant="outline"
                className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
              >
                Back
              </Button>
            )}
          </div>
          <div className="transition-all duration-300 ease-in-out">
            {step === "category" && (
              <div className="animate-fadeIn">
                {isLoading ? (
                  <div className="text-white">Loading categories...</div>
                ) : (
                  <ProductCategorySelector onCategorySelect={handleCategorySelect} />
                )}
              </div>
            )}

            {step === "type" && (
              <div className="animate-fadeIn">
                <div className="grid grid-cols-2 gap-4">
                  {categories
                    .find((c) => c.id === selectedCategory)
                    ?.types.map((type) => (
                      <Button
                        key={type.id}
                        onClick={() => handleTypeSelect(type.id)}
                        variant="outline"
                        className="justify-start text-left text-gray-200 transition-all duration-200 hover:scale-105 whitespace-normal h-auto min-h-[44px] py-2"
                      >
                        {selectedCategory === "sensors-switches" && (
                          <span className="mr-2">{getSensorIcon(type.id)}</span>
                        )}
                        {type.name}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {step === "filter" && (
              <div className="animate-fadeIn">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-200">
                    {["level", "flow"].includes(selectedType) ? "No filters available" : "Filter Options"}
                  </h3>
                  {!["level", "flow"].includes(selectedType) && (
                    <div className="flex flex-wrap gap-2 w-full overflow-x-hidden">
                      {/* Only render predefined filters based on the current selected type */}
                      {selectedType === "temp-humid" && (
                        <>
                          <FilterOption
                            label="Duct"
                            isActive={filters.duct}
                            onClick={() => setFilters((prev) => ({ ...prev, duct: !prev.duct }))}
                            tooltip="Sensors designed for duct installation"
                          />
                          <FilterOption
                            label="Water"
                            isActive={filters.water}
                            onClick={() => setFilters((prev) => ({ ...prev, water: !prev.water }))}
                            tooltip="Sensors for water-related measurements"
                          />
                          <FilterOption
                            label="Outdoor"
                            isActive={filters.outdoor}
                            onClick={() => setFilters((prev) => ({ ...prev, outdoor: !prev.outdoor }))}
                            tooltip="Sensors suitable for outdoor use"
                          />
                          <FilterOption
                            label="Indoor"
                            isActive={filters.indoor}
                            onClick={() => setFilters((prev) => ({ ...prev, indoor: !prev.indoor }))}
                            tooltip="Sensors designed for indoor environments"
                          />
                          <FilterOption
                            label="Temperature & Humidity"
                            isActive={filters.tempHumidity}
                            onClick={() => setFilters((prev) => ({ ...prev, tempHumidity: !prev.tempHumidity }))}
                            tooltip="Sensors that measure both temperature and humidity"
                          />
                          <FilterOption
                            label="Temperature Only"
                            isActive={filters.tempOnly}
                            onClick={() => setFilters((prev) => ({ ...prev, tempOnly: !prev.tempOnly }))}
                            tooltip="Sensors that measure temperature only"
                          />
                        </>
                      )}
                      {selectedType === "air-quality" && (
                        <>
                          <FilterOption
                            label="Indoor"
                            isActive={filters.indoor}
                            onClick={() => setFilters((prev) => ({ ...prev, indoor: !prev.indoor }))}
                            tooltip="Indoor air quality sensors"
                          />
                          <FilterOption
                            label="Outdoor"
                            isActive={filters.outdoor}
                            onClick={() => setFilters((prev) => ({ ...prev, outdoor: !prev.outdoor }))}
                            tooltip="Outdoor air quality sensors"
                          />
                          <FilterOption
                            label="VOC"
                            isActive={filters.voc}
                            onClick={() => setFilters((prev) => ({ ...prev, voc: !prev.voc }))}
                            tooltip="Volatile Organic Compounds detection"
                          />
                          <FilterOption
                            label="CO"
                            isActive={filters.co}
                            onClick={() => setFilters((prev) => ({ ...prev, co: !prev.co }))}
                            tooltip="Carbon Monoxide detection"
                          />
                          <FilterOption
                            label="CO₂"
                            isActive={filters.co2}
                            onClick={() => setFilters((prev) => ({ ...prev, co2: !prev.co2 }))}
                            tooltip="Carbon Dioxide detection"
                          />
                          <FilterOption
                            label="Wall Mounted"
                            isActive={filters.wallMounted}
                            onClick={() => setFilters((prev) => ({ ...prev, wallMounted: !prev.wallMounted }))}
                            tooltip="Wall mounted sensors"
                          />
                          <FilterOption
                            label="Duct Mounted"
                            isActive={filters.ductMounted}
                            onClick={() => setFilters((prev) => ({ ...prev, ductMounted: !prev.ductMounted }))}
                            tooltip="Duct mounted sensors"
                          />
                        </>
                      )}
                      {selectedType === "pressure" && (
                        <>
                          <FilterOption
                            label="Switches"
                            isActive={filters.switches}
                            onClick={() => setFilters((prev) => ({ ...prev, switches: !prev.switches }))}
                            tooltip="Pressure switches functionality"
                          />
                          <FilterOption
                            label="Sensors"
                            isActive={filters.sensors}
                            onClick={() => setFilters((prev) => ({ ...prev, sensors: !prev.sensors }))}
                            tooltip="Pressure sensor functionality"
                          />
                          <FilterOption
                            label="Liquid"
                            isActive={filters.liquid}
                            onClick={() => setFilters((prev) => ({ ...prev, liquid: !prev.liquid }))}
                            tooltip="For liquid pressure measurement"
                          />
                          <FilterOption
                            label="Air"
                            isActive={filters.air}
                            onClick={() => setFilters((prev) => ({ ...prev, air: !prev.air }))}
                            tooltip="For air pressure measurement"
                          />
                        </>
                      )}

                      {/* Only render custom filters for the current selected type */}
                      {availableFilters
                        .filter((filter) => filter.typeId === selectedType)
                        .map((filter) => (
                          <FilterOption
                            key={filter.id}
                            label={filter.name}
                            isActive={filters[filter.id] || false}
                            onClick={() => setFilters((prev) => ({ ...prev, [filter.id]: !prev[filter.id] }))}
                            tooltip={`Custom filter: ${filter.name}`}
                          />
                        ))}
                    </div>
                  )}
                  <Button onClick={handleFilterApply} className="w-full bg-[#40C4FF] text-white hover:bg-blue-400">
                    {["level", "flow"].includes(selectedType) ? "Continue to Model Selection" : "Apply Filters"}
                  </Button>
                </div>
              </div>
            )}

            {step === "model" && (
              <div className="animate-fadeIn">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-200">Select Model</h3>
                  </div>
                  {console.log("Available models for type:", selectedType, getFilteredModels(selectedSensorType))}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getFilteredModels(selectedSensorType).map((modelOption: any) => (
                      <Button
                        key={modelOption.value}
                        onClick={() => handleModelSelect(modelOption.value)}
                        variant="outline"
                        className="justify-start text-left text-gray-200 whitespace-normal h-auto min-h-[44px] py-2 w-full break-words"
                      >
                        {modelOption.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === "specs" && (
              <div className="animate-fadeIn grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="md:col-span-2 mb-2">
                  <p className="text-sm text-gray-400">All specifications are required to generate the product code.</p>
                </div>
                {getRequiredSpecs().map((specType) => {
                  const specOptions = getSpecOptions(specType)
                  if (!specOptions.length) return null

                  const isRequired = true // All specs are required
                  const isSelected = !!specs[specType]

                  return (
                    <div key={specType} className="space-y-2">
                      <label className="text-sm text-gray-200 capitalize flex items-center gap-1">
                        {specType.replace(/([A-Z])/g, " $1").toLowerCase()}
                        {isRequired && <span className="text-red-500">*</span>}
                      </label>
                      <Select
                        value={specs[specType] || ""}
                        onValueChange={(value) => handleSpecChange(specType, value)}
                      >
                        <SelectTrigger
                          className={`bg-[#1f2937] border-[#374151] text-gray-200 ${
                            isRequired && !isSelected ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder={`Select ${specType.replace(/([A-Z])/g, " $1").toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1f2937] border-[#374151]">
                          {specOptions.map((option: any) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="text-gray-200 hover:bg-[#374151]"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Product Code Display */}
          {productCode && (
            <div className="pt-4 space-y-4 border-t border-[#2a3744]">
              <div>
                <div className="text-sm text-gray-200">Product Code:</div>
                <div className="text-lg font-medium text-[#40C4FF] mt-1 break-all" aria-live="polite">
                  {productCode}
                </div>
                <div className="text-sm text-gray-400 mt-2 leading-relaxed" aria-live="polite">
                  {getDetailedDescription()}
                </div>
                {model && (
                  <div className="mt-4">
                    {(customProducts.find((p) => p.code === model)?.photoUrl ||
                      sensorModels[selectedType]?.find((m) => m.id === model)?.imageUrl) && (
                      <div className="relative w-[200px] h-[200px]">
                        <Image
                          src={
                            customProducts.find((p) => p.code === model)?.photoUrl ||
                            sensorModels[selectedType]?.find((m) => m.id === model)?.imageUrl ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={`${model} Product Image`}
                          fill
                          className="rounded-lg border border-[#2a3744] object-contain bg-white"
                          onError={(e) => {
                            const imgElement = e.target as HTMLImageElement
                            console.error("Image load error:", {
                              originalSrc: imgElement.src,
                              model,
                              error: e,
                            })
                            imgElement.src = "/placeholder.svg"
                            imgElement.onerror = null
                          }}
                          crossOrigin="anonymous"
                          loading="eager"
                          priority
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  onClick={() => copyToClipboard(productCode, "code")}
                  disabled={!productCode}
                  className="bg-[#40C4FF] text-white hover:bg-blue-400 whitespace-nowrap"
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy Code
                </Button>
                <Button
                  onClick={() => copyToClipboard(getDetailedDescription(), "description")}
                  disabled={!model}
                  className="bg-[#40C4FF] text-white hover:bg-blue-400 whitespace-nowrap"
                >
                  Copy Description
                </Button>
                {model && (
                  <Button onClick={handleDatasheetDownload} className="bg-[#40C4FF] text-white hover:bg-blue-400">
                    Download Datasheet
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* <ComparisonView comparisonList={comparisonList} removeFromComparison={removeFromComparison} /> */}
    </>
  )
}


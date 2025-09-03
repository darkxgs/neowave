"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Plus, Trash2, AlertCircle, Save, ArrowLeft, ArrowRight, Filter } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryTypeManager } from "@/components/category-type-manager"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useCategories } from "@/lib/CategoryContext"
import { useFilters } from "@/lib/FilterContext"

type SpecificationOption = {
  value: string
  code: string
  label: string
}

type Specification = {
  name: string
  options: SpecificationOption[]
}

type ProductFilter = {
  id: string
  name: string
  typeId: string
  predefined?: boolean
}

interface DataEntryFormProps {
  onProductAdded: () => void
  editingProduct: any | null
}

export function DataEntryForm({ onProductAdded, editingProduct }: DataEntryFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    category: "",
    type: "",
    name: "",
    datasheetUrl: "",
  })
  const [specifications, setSpecifications] = useState<Specification[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const { categories } = useCategories()
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [advancedModePassword, setAdvancedModePassword] = useState("")
  const [showAdvancedMode, setShowAdvancedMode] = useState(false)

  // Filter management
  const { filters, addFilter, removeFilter } = useFilters()
  const [newFilterName, setNewFilterName] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const router = useRouter()

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        category: editingProduct.category || "",
        type: editingProduct.type || "",
        name: editingProduct.name || "",
        datasheetUrl: editingProduct.datasheetUrl || "",
      })
      setSpecifications(editingProduct.specifications || [])
      setPhoto(editingProduct.photo || null)
      setPhotoPreview(editingProduct.photoPreview || null)

      // Set selected filters from the editing product
      if (editingProduct.filters) {
        setSelectedFilters(editingProduct.filters)
      }
    } else {
      resetForm()
    }
  }, [editingProduct])

  // Get available filters for the selected type
  const availableFilters = useMemo(() => {
    if (!formData.type) return []
    return filters.filter((filter) => filter.typeId === formData.type)
  }, [formData.type, filters])

  const availableSensorTypes = useMemo(() => {
    const category = categories.find((cat) => cat.id === formData.category)
    return category?.types || []
  }, [formData.category, categories])

  const totalSteps = 5 // Added one more step for filters
  const progress = (step / totalSteps) * 100

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (currentStep) {
      case 1:
        if (!formData.category) newErrors.category = "Category is required"
        if (!formData.type) newErrors.type = "Type is required"
        break
      case 2:
        // Filter step doesn't require validation
        break
      case 3:
        if (!formData.name) newErrors.name = "Product name is required"
        if (formData.datasheetUrl && !isValidUrl(formData.datasheetUrl)) {
          newErrors.datasheetUrl = "Invalid URL format"
        }
        break
      case 4:
        if (specifications.length === 0) {
          newErrors.specifications = "At least one specification is required"
        } else {
          specifications.forEach((spec, index) => {
            if (!spec.name) newErrors[`spec_${index}_name`] = "Specification name is required"
            if (spec.options.length === 0) {
              newErrors[`spec_${index}_options`] = "At least one option is required"
            } else {
              spec.options.forEach((option, optIndex) => {
                if (!option.value) newErrors[`spec_${index}_option_${optIndex}_value`] = "Value is required"
                if (!option.code) newErrors[`spec_${index}_option_${optIndex}_code`] = "Code is required"
                if (!option.label) newErrors[`spec_${index}_option_${optIndex}_label`] = "Label is required"
              })
            }
          })
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prevStep) => Math.min(prevStep + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if product name is provided
    if (!formData.name) {
      setErrors((prev) => ({ ...prev, name: "Product name is required" }))
      setStep(3) // Move to the step with the name field
      toast.error("Please provide a product name")
      return
    }

    // Check if category and type are provided
    if (!formData.category || !formData.type) {
      setErrors((prev) => ({
        ...prev,
        category: !formData.category ? "Category is required" : "",
        type: !formData.type ? "Type is required" : "",
      }))
      setStep(1) // Move to the step with category/type fields
      toast.error("Please select a category and type")
      return
    }

    try {
      const productData = {
        ...formData,
        specifications,
        filters: selectedFilters,
        code: formData.name ? generateProductCode(formData, specifications) : "",
      }

      console.log("Submitting product data:", productData)

      const formDataToSend = new FormData()
      formDataToSend.append("data", JSON.stringify(productData))
      if (photo) {
        formDataToSend.append("photo", photo)
      }

      const response = await fetch("/api/products", {
        method: "POST",
        body: formDataToSend,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error("Server error:", result)
        throw new Error(result.error || "Failed to add product")
      }

      console.log("Product added successfully:", result)

      toast.success("Product added successfully!")
      onProductAdded()
      resetForm()
    } catch (error) {
      console.error("Error adding product:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      })

      toast.error(error instanceof Error ? `Error: ${error.message}` : "Failed to add product. Please try again.")
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { name: string; value: string },
  ) => {
    const { name, value } = e.target ? e.target : e
    setFormData((prev) => {
      if (name === "category") {
        return { ...prev, [name]: value, type: "" }
      }
      if (name === "type") {
        setSelectedFilters([]) // Reset selected filters when type changes
        return { ...prev, [name]: value }
      }
      return { ...prev, [name]: value }
    })
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddFilter = () => {
    if (newFilterName.trim() && formData.type) {
      try {
        // Generate a unique ID for the filter
        const filterId = `${formData.type}-${newFilterName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

        // Create the new filter object
        const newFilter = {
          id: filterId,
          name: newFilterName,
          typeId: formData.type,
        }

        // Add the filter to the global filter list
        addFilter(newFilter)
          .then(() => {
            // Add this filter to the selected filters for this product
            setSelectedFilters((prev) => [...prev, filterId])
            setNewFilterName("")
            toast.success(`Added filter: ${newFilterName}`)

            // Force close the dialog
            const closeButton = document.querySelector(
              '[data-state="open"] button[aria-label="Close"]',
            ) as HTMLButtonElement
            if (closeButton) {
              closeButton.click()
            }
          })
          .catch((error) => {
            console.error("Error adding filter:", error)
            toast.error(`Failed to add filter: ${error.message || "Unknown error"}`)
          })
      } catch (error) {
        console.error("Error in handleAddFilter:", error)
        toast.error(`Error adding filter: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    } else {
      if (!formData.type) {
        toast.error("Please select a product type first")
      } else if (!newFilterName.trim()) {
        toast.error("Please enter a filter name")
      }
    }
  }

  const handleToggleFilter = (filterId: string) => {
    setSelectedFilters((prev) => {
      if (prev.includes(filterId)) {
        return prev.filter((id) => id !== filterId)
      } else {
        return [...prev, filterId]
      }
    })
  }

  const handleDeleteFilter = (filterId: string) => {
    const filter = availableFilters.find((f) => f.id === filterId)

    // Don't allow deleting predefined filters
    if (filter?.predefined) {
      toast.error("Cannot remove predefined filters")
      return
    }

    // Remove from global filters
    removeFilter(filterId)

    // Also remove from selected filters if it was selected
    setSelectedFilters((prev) => prev.filter((id) => id !== filterId))

    toast.success("Filter removed")
  }

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { name: "", options: [] }])
  }

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index))
  }

  const addOption = (specIndex: number) => {
    setSpecifications((prev) => {
      const newSpecs = [...prev]
      newSpecs[specIndex].options.push({ value: "", code: "", label: "" })
      return newSpecs
    })
  }

  const updateSpecification = (index: number, field: keyof Specification, value: string) => {
    setSpecifications((prev) => {
      const newSpecs = [...prev]
      if (field === "name") {
        newSpecs[index].name = value
      }
      return newSpecs
    })
    setErrors((prev) => ({ ...prev, [`spec_${index}_name`]: "" }))
  }

  const updateOption = (specIndex: number, optionIndex: number, field: keyof SpecificationOption, value: string) => {
    setSpecifications((prev) => {
      const newSpecs = [...prev]
      newSpecs[specIndex].options[optionIndex][field] = value
      return newSpecs
    })
    setErrors((prev) => ({ ...prev, [`spec_${specIndex}_option_${optionIndex}_${field}`]: "" }))
  }

  const removeOption = (specIndex: number, optionIndex: number) => {
    setSpecifications((prev) => {
      const newSpecs = [...prev]
      newSpecs[specIndex].options = newSpecs[specIndex].options.filter((_, i) => i !== optionIndex)
      return newSpecs
    })
  }

  const resetForm = () => {
    setFormData({
      category: "",
      type: "",
      name: "",
      datasheetUrl: "",
    })
    setSpecifications([])
    setStep(1)
    setErrors({})
    setPhoto(null)
    setPhotoPreview(null)
    setSelectedFilters([])
  }

  const generateProductCode = (formData: any, specifications: Specification[]) => {
    if (!formData.name) {
      console.error("Product name is missing")
      return ""
    }
    let code = formData.name.split(" ")[0]
    specifications.forEach((spec) => {
      if (spec.options && spec.options.length > 0 && spec.options[0].code) {
        code += `-${spec.options[0].code}`
      } else {
        console.warn(`Missing code for specification: ${spec.name}`)
      }
    })
    console.log("Generated product code:", code)
    return code
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const toggleAdvancedMode = () => {
    if (advancedModePassword === "admin123") {
      setShowAdvancedMode(!showAdvancedMode)
      setAdvancedModePassword("")
    } else {
      toast.error("Incorrect password for advanced mode")
    }
  }

  return (
    <Card className="bg-[#1B2531] border-[#2a3744]">
      <CardHeader>
        <CardTitle className="text-[#40C4FF] text-xl font-normal">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </CardTitle>
        <Progress value={progress} className="w-full mt-2" />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Mode</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category" className="text-white">
                      Product Category
                    </Label>
                    <Select
                      name="category"
                      value={formData.category}
                      onValueChange={(value) => handleChange({ name: "category", value })}
                    >
                      <SelectTrigger className="bg-[#2a3744] border-[#3a4754] text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1B2531] border-[#3a4754]">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-white hover:bg-[#2a3744]">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errors.category}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  {formData.category && (
                    <div>
                      <Label htmlFor="type" className="text-white">
                        Product Type
                      </Label>
                      <Select
                        name="type"
                        value={formData.type}
                        onValueChange={(value) => handleChange({ name: "type", value })}
                      >
                        <SelectTrigger className="bg-[#2a3744] border-[#3a4754] text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1B2531] border-[#3a4754]">
                          {availableSensorTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id} className="text-white hover:bg-[#2a3744]">
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{errors.type}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && ( // New step for filters
                <div className="space-y-4">
                  <div className="space-y-4">
                    <Label className="text-white text-xl">Product Filters</Label>

                    <div className="flex items-center gap-2 bg-[#2a3744] p-3 rounded-md">
                      <Input
                        value={newFilterName}
                        onChange={(e) => setNewFilterName(e.target.value)}
                        className="bg-[#1B2531] border-[#3a4754] text-white flex-grow"
                        placeholder="Enter filter name"
                        disabled={!formData.type}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newFilterName.trim() && formData.type) {
                            // Generate a unique ID for the filter
                            const filterId = `${formData.type}-${newFilterName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`

                            // Create the new filter object
                            const newFilter = {
                              id: filterId,
                              name: newFilterName,
                              typeId: formData.type,
                            }

                            // Add the filter
                            addFilter(newFilter)
                              .then(() => {
                                // Add this filter to the selected filters for this product
                                setSelectedFilters((prev) => [...prev, filterId])
                                setNewFilterName("")
                                toast.success(`Added filter: ${newFilterName}`)
                              })
                              .catch((error) => {
                                console.error("Error adding filter:", error)
                                toast.error(`Failed to add filter: ${error.message || "Unknown error"}`)
                              })
                          } else {
                            if (!formData.type) {
                              toast.error("Please select a product type first")
                            } else if (!newFilterName.trim()) {
                              toast.error("Please enter a filter name")
                            }
                          }
                        }}
                        className="bg-[#40C4FF] text-white hover:bg-blue-400"
                        disabled={!newFilterName.trim() || !formData.type}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Filter
                      </Button>
                    </div>
                  </div>

                  <div className="bg-[#2a3744] rounded-lg p-4">
                    <p className="text-gray-300 mb-4">
                      Filters help categorize products and make them easier to find. Select existing filters or add
                      custom ones for this product type.
                    </p>

                    {formData.type ? (
                      availableFilters.length > 0 ? (
                        <div className="space-y-4">
                          <Label className="text-white">Available Filters</Label>
                          <div className="flex flex-wrap gap-2">
                            {availableFilters.map((filter) => (
                              <div key={filter.id} className="flex items-center">
                                <Badge
                                  variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                                  className={`
                                    cursor-pointer mr-1 px-3 py-1
                                    ${
                                      selectedFilters.includes(filter.id)
                                        ? "bg-[#40C4FF]"
                                        : "bg-transparent text-[#40C4FF] border-[#40C4FF]"
                                    }
                                  `}
                                  onClick={() => handleToggleFilter(filter.id)}
                                >
                                  {filter.name}
                                </Badge>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-transparent"
                                  onClick={() => handleDeleteFilter(filter.id)}
                                  // Hide delete button for predefined filters
                                  style={{ display: filter.predefined ? "none" : "block" }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <Filter className="mx-auto h-12 w-12 opacity-20 mb-2" />
                          <p>No filters available for this product type.</p>
                          <p className="text-sm mt-2">Add a new filter to get started.</p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <p>Please select a product type first.</p>
                      </div>
                    )}
                  </div>

                  {selectedFilters.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-white">Selected Filters:</Label>
                      <div className="mt-2 space-x-2">
                        {selectedFilters.map((filterId) => {
                          const filter = availableFilters.find((f) => f.id === filterId)
                          return filter ? (
                            <Badge key={filter.id} className="bg-[#40C4FF]">
                              {filter.name}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Product Name
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-[#2a3744] border-[#3a4754] text-white"
                    />
                    {errors.name && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errors.name}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="datasheetUrl" className="text-white">
                      Datasheet URL
                    </Label>
                    <Input
                      type="url"
                      id="datasheetUrl"
                      name="datasheetUrl"
                      value={formData.datasheetUrl}
                      onChange={handleChange}
                      className="bg-[#2a3744] border-[#3a4754] text-white"
                      placeholder="https://example.com/datasheet.pdf"
                    />
                    {errors.datasheetUrl && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errors.datasheetUrl}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="photo" className="text-white">
                      Product Photo
                    </Label>
                    <Input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="bg-[#2a3744] border-[#3a4754] text-white"
                    />
                    {photoPreview && (
                      <div className="mt-2">
                        <img
                          src={photoPreview || "/placeholder.svg"}
                          alt="Product preview"
                          className="max-w-full h-auto max-h-48 rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Specifications</Label>
                    <Button
                      type="button"
                      onClick={addSpecification}
                      variant="outline"
                      size="sm"
                      className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Specification
                    </Button>
                  </div>
                  {specifications.map((spec, specIndex) => (
                    <Card key={specIndex} className="bg-[#2a3744] border-[#3a4754]">
                      <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                          <Input
                            placeholder="Specification name (e.g., Accuracy)"
                            value={spec.name}
                            onChange={(e) => updateSpecification(specIndex, "name", e.target.value)}
                            className="flex-grow mr-2 bg-[#1B2531] border-[#3a4754] text-white"
                          />
                          <Button
                            type="button"
                            onClick={() => removeSpecification(specIndex)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {errors[`spec_${specIndex}_name`] && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errors[`spec_${specIndex}_name`]}</AlertDescription>
                          </Alert>
                        )}
                        {spec.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <Input
                              placeholder="Value (e.g., ±3%RH)"
                              value={option.value}
                              onChange={(e) => updateOption(specIndex, optionIndex, "value", e.target.value)}
                              className="flex-grow bg-[#1B2531] border-[#3a4754] text-white"
                            />
                            <Input
                              placeholder="Code (e.g., 3)"
                              value={option.code}
                              onChange={(e) => updateOption(specIndex, optionIndex, "code", e.target.value)}
                              className="w-24 bg-[#1B2531] border-[#3a4754] text-white"
                            />
                            <Input
                              placeholder="Label (e.g., ±3%RH(±0.5℃))"
                              value={option.label}
                              onChange={(e) => updateOption(specIndex, optionIndex, "label", e.target.value)}
                              className="flex-grow bg-[#1B2531] border-[#3a4754] text-white"
                            />
                            <Button
                              type="button"
                              onClick={() => removeOption(specIndex, optionIndex)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {errors[`spec_${specIndex}_options`] && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errors[`spec_${specIndex}_options`]}</AlertDescription>
                          </Alert>
                        )}
                        <Button
                          type="button"
                          onClick={() => addOption(specIndex)}
                          variant="outline"
                          size="sm"
                          className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#1B2531]"
                        >
                          <Plus className="w-4 h-4 mr-2" /> Add Option
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {errors.specifications && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{errors.specifications}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Review and Submit</h3>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <span className="font-medium">Category:</span> {formData.category}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Type:</span> {formData.type}
                    </p>
                    {selectedFilters.length > 0 && (
                      <div className="text-gray-300">
                        <span className="font-medium">Filters:</span>{" "}
                        {selectedFilters
                          .map((filterId) => {
                            const filter = availableFilters.find((f) => f.id === filterId)
                            return filter ? filter.name : ""
                          })
                          .join(", ")}
                      </div>
                    )}
                    <p className="text-gray-300">
                      <span className="font-medium">Name:</span> {formData.name}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Datasheet URL:</span> {formData.datasheetUrl}
                    </p>
                    {photo && (
                      <p className="text-gray-300">
                        <span className="font-medium">Photo:</span> {photo.name}
                      </p>
                    )}
                    <div className="text-gray-300">
                      <span className="font-medium">Specifications:</span>
                      <ul className="list-disc list-inside ml-4 mt-2">
                        {specifications.map((spec, index) => (
                          <li key={index}>
                            {spec.name}: {spec.options.map((opt) => opt.label).join(", ")}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="advanced">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="advanced-mode"
                    checked={showAdvancedMode}
                    onCheckedChange={() => {
                      if (showAdvancedMode) {
                        setShowAdvancedMode(false)
                        setAdvancedModePassword("")
                      } else {
                        if (advancedModePassword === "admin123") {
                          setShowAdvancedMode(true)
                          setAdvancedModePassword("")
                          toast.success("Advanced mode enabled")
                        } else {
                          toast.error("Incorrect password for advanced mode")
                        }
                      }
                    }}
                  />
                  <Label htmlFor="advanced-mode" className="text-white">
                    Enable Advanced Mode
                  </Label>
                </div>
                {!showAdvancedMode && (
                  <Input
                    type="password"
                    value={advancedModePassword}
                    onChange={(e) => setAdvancedModePassword(e.target.value)}
                    placeholder="Enter password for advanced mode"
                    className="bg-[#2a3744] border-[#3a4754] text-white"
                  />
                )}
                {showAdvancedMode && <CategoryTypeManager />}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6">
            <div className="flex space-x-2">
              {step > 1 && (
                <Button type="button" onClick={handlePrevious} variant="outline" className="text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
              )}
              <Button 
                type="button" 
                onClick={() => router.push("/")} 
                variant="outline" 
                className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Product Generator
              </Button>
            </div>
            {step < totalSteps && (
              <Button type="button" onClick={handleNext} className="bg-[#40C4FF] text-white hover:bg-blue-400">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            {step === totalSteps && (
              <Button type="submit" className="bg-[#40C4FF] text-white hover:bg-blue-400">
                <Save className="w-4 h-4 mr-2" /> {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/lib/CategoryContext"
import { useFilters } from "@/lib/FilterContext"
import { useProductContext } from "@/lib/ProductContext"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

export function ProductSelector() {
  const { categories } = useCategories()
  const { filters } = useFilters()
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState("")
  const { addProduct } = useProductContext()

  const resetSelection = () => {
    setStep(1)
    setSelectedCategory("")
    setSelectedType("")
    setSelectedFilters([])
    setSelectedModel("")
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedType("")
    setSelectedFilters([])
    setSelectedModel("")
    setStep(2)
  }

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    setSelectedFilters([])
    setSelectedModel("")
    setStep(3)
  }

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId)
      } else {
        return [...prev, filterId]
      }
    })
  }

  const handleContinueToModels = () => {
    setStep(4)
  }

  const handleModelSelect = (model: any) => {
    setSelectedModel(model.id)
    addProduct(model)
    // After adding, reset to allow for another selection
    resetSelection()
  }

  // Get available types for the selected category
  const availableTypes = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.types || []
    : []

  // Get available filters for the selected type
  const availableFilters = selectedType
    ? filters.filter(f => f.typeId === selectedType)
    : []

  // Get available models (this would come from your data)
  const availableModels = selectedType
    ? [
        { id: 'model1', name: 'Model A', code: 'MA-100', typeName: 'Temperature', imageUrl: '/placeholder.svg' },
        { id: 'model2', name: 'Model B', code: 'MB-200', typeName: 'Humidity', imageUrl: '/placeholder.svg' },
        { id: 'model3', name: 'Model C', code: 'MC-300', typeName: 'Pressure', imageUrl: '/placeholder.svg' },
      ]
    : []

  return (
    <Card className="bg-[#1B2531] border-[#2a3744]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-[#40C4FF] text-xl font-normal">Product Selector</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetSelection}
          className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
        >
          Reset
        </Button>
      </CardHeader>
      <CardContent>
        {/* Steps indicator */}
        <div className="flex items-center justify-between mb-8 relative">
          {/* Line connecting steps */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-700" style={{ top: '16px', zIndex: 0 }}></div>
          
          {/* Step circles */}
          <div className={`relative z-10 text-center ${step >= 1 ? 'text-[#40C4FF]' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${step >= 1 ? 'bg-[#40C4FF]' : 'bg-gray-700'}`}>
              <span className="text-white">1</span>
            </div>
            <span className="text-xs block">Category</span>
          </div>
          
          <div className={`relative z-10 text-center ${step >= 2 ? 'text-[#40C4FF]' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${step >= 2 ? 'bg-[#40C4FF]' : 'bg-gray-700'}`}>
              <span className="text-white">2</span>
            </div>
            <span className="text-xs block">Type</span>
          </div>
          
          <div className={`relative z-10 text-center ${step >= 3 ? 'text-[#40C4FF]' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${step >= 3 ? 'bg-[#40C4FF]' : 'bg-gray-700'}`}>
              <span className="text-white">3</span>
            </div>
            <span className="text-xs block">Filter</span>
          </div>
          
          <div className={`relative z-10 text-center ${step >= 4 ? 'text-[#40C4FF]' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${step >= 4 ? 'bg-[#40C4FF]' : 'bg-gray-700'}`}>
              <span className="text-white">4</span>
            </div>
            <span className="text-xs block">Model</span>
          </div>
          
          <div className={`relative z-10 text-center ${step >= 5 ? 'text-[#40C4FF]' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${step >= 5 ? 'bg-[#40C4FF]' : 'bg-gray-700'}`}>
              <span className="text-white">5</span>
            </div>
            <span className="text-xs block">Specs</span>
          </div>
        </div>

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Select Product Category</h3>
            <div className="space-y-2">
              {/* I/O modules and data transmission */}
              <Button
                variant="outline"
                className="w-full justify-between text-left py-3 text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
                onClick={() => handleCategorySelect("io-modules")}
              >
                I/O modules and data transmission
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              
              {/* Sensors and Switches */}
              <Button
                variant="outline"
                className="w-full justify-between text-left py-3 text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
                onClick={() => handleCategorySelect("sensors")}
              >
                Sensors and Switches
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              
              {/* HVAC control */}
              <Button
                variant="outline"
                className="w-full justify-between text-left py-3 text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
                onClick={() => handleCategorySelect("hvac")}
              >
                HVAC control
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              
              {/* Power & Energy */}
              <Button
                variant="outline"
                className="w-full justify-between text-left py-3 text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
                onClick={() => handleCategorySelect("power")}
              >
                Power & Energy
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              
              {/* Life Safety Systems */}
              <Button
                variant="outline"
                className="w-full justify-between text-left py-3 text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
                onClick={() => handleCategorySelect("safety")}
              >
                Life Safety Systems
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              
              {/* Industrial Switches */}
              <Button
                variant="outline"
                className="w-full justify-between text-left py-3 text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
                onClick={() => handleCategorySelect("industrial")}
              >
                Industrial Switches
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Type Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Select Type</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep(1)}
                className="text-[#40C4FF] hover:bg-[#2a3744]"
              >
                Back
              </Button>
            </div>
            <div className="space-y-2">
              {availableTypes.map(type => (
                <Button
                  key={type.id}
                  variant="outline"
                  className="w-full justify-between text-left py-3 text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
                  onClick={() => handleTypeSelect(type.id)}
                >
                  {type.name}
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Filter Selection */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Select Filters (Optional)</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep(2)}
                className="text-[#40C4FF] hover:bg-[#2a3744]"
              >
                Back
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableFilters.length > 0 ? (
                availableFilters.map(filter => (
                  <Badge
                    key={filter.id}
                    variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                    className={`
                      cursor-pointer px-3 py-1
                      ${
                        selectedFilters.includes(filter.id)
                          ? "bg-[#40C4FF]"
                          : "bg-transparent text-[#40C4FF] border-[#40C4FF]"
                      }
                    `}
                    onClick={() => handleFilterToggle(filter.id)}
                  >
                    {filter.name}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No filters available for this type.</p>
              )}
            </div>
            <Button 
              onClick={handleContinueToModels}
              className="w-full bg-[#40C4FF] text-white hover:bg-blue-400"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 4: Model Selection */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Select Model</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep(3)}
                className="text-[#40C4FF] hover:bg-[#2a3744]"
              >
                Back
              </Button>
            </div>
            <div className="space-y-2">
              {availableModels.map(model => (
                <div
                  key={model.id}
                  className="flex items-center justify-between bg-[#2a3744] p-4 rounded-lg cursor-pointer hover:bg-[#3a4754]"
                  onClick={() => handleModelSelect(model)}
                >
                  <div className="flex items-center">
                    {model.imageUrl && (
                      <img
                        src={model.imageUrl}
                        alt={model.name}
                        className="w-10 h-10 object-contain mr-3 bg-white rounded p-1"
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">{model.name}</p>
                      <p className="text-gray-400 text-sm">{model.code}</p>
                    </div>
                  </div>
                  <Badge className="bg-[#40C4FF]">{model.typeName}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


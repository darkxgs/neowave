"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sensorTypes, sensorModels } from "@/lib/data"
import { useAuth } from "@/lib/AuthContext"
import { Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function ProductGenerator() {
  const [sensorType, setSensorType] = useState("")
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({})

  const handleSpecChange = (specType: string, value: string) => {
    setSelectedSpecs((prev) => ({ ...prev, [specType]: value }))
  }

  const selectedSensorType = sensorTypes.find((type) => type.id === sensorType)

  const generateProductCode = () => {
    if (!selectedSensorType) return ""

    const specValues = Object.values(selectedSpecs)
    if (specValues.length !== Object.keys(selectedSensorType.specifications).length) return ""

    return `${sensorType.toUpperCase()}-${specValues.join("-")}`
  }

  const resetSelections = () => {
    setSensorType("")
    setSelectedSpecs({})
  }

  const { isAuthenticated } = useAuth()
  const router = useRouter()

  return (
    <Card className="bg-[#1B2531] border-[#2a3744]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#40C4FF] text-xl font-normal">Select Sensor Type and Specifications</CardTitle>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Button
              onClick={() => router.push("/admin/data-entry")}
              variant="outline"
              className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
            >
              <Settings className="w-4 h-4 mr-2" />
              Data Entry
            </Button>
          )}
          <Button
            onClick={resetSelections}
            variant="outline"
            className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]"
          >
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Sensor Type:</label>
          <Select
            value={sensorType}
            onValueChange={(value) => {
              setSensorType(value)
              setSelectedSpecs({})
            }}
          >
            <SelectTrigger className="bg-[#2a3744] border-[#3a4754] text-white">
              <SelectValue placeholder="Select sensor type" />
            </SelectTrigger>
            <SelectContent className="bg-[#1B2531] border-[#3a4754]">
              {sensorTypes.map((type) => (
                <SelectItem
                  key={type.id}
                  value={type.id}
                  className="text-white hover:bg-[#2a3744] focus:bg-[#2a3744] focus:text-white"
                >
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedSensorType && <p className="text-sm text-gray-400 mt-1">{selectedSensorType.description}</p>}
        </div>

        {selectedSensorType && (
          <div className="space-y-4">
            {Object.entries(selectedSensorType.specifications).map(([specType, options]) => (
              <div key={specType} className="space-y-2">
                <label className="text-sm font-medium text-white capitalize">{specType}:</label>
                <Select
                  value={selectedSpecs[specType] || ""}
                  onValueChange={(value) => handleSpecChange(specType, value)}
                >
                  <SelectTrigger className="bg-[#2a3744] border-[#3a4754] text-white">
                    <SelectValue placeholder={`Select ${specType}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1B2531] border-[#3a4754]">
                    {options.map((option: any) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-white hover:bg-[#2a3744] focus:bg-[#2a3744] focus:text-white"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}

        {generateProductCode() && (
          <div className="pt-4 border-t border-[#2a3744]">
            <p className="text-sm font-medium text-white">Generated Product Code:</p>
            <p className="text-lg font-bold text-[#40C4FF] mt-1">{generateProductCode()}</p>
          </div>
        )}

        {sensorType && (
          <div className="pt-4 border-t border-[#2a3744]">
            <h3 className="text-lg font-medium text-[#40C4FF] mb-2">Available Models:</h3>
            <ul className="space-y-2">
              {sensorModels[sensorType].map((model) => (
                <li key={model.id} className="bg-[#2a3744] p-3 rounded-md">
                  <span className="text-white font-medium">{model.name}</span>
                  <span className="text-gray-400 ml-2">Code: {model.code}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


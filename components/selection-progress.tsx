"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectionProgressProps {
  steps: string[]
  currentStep: string
  "aria-label"?: string
}

export function SelectionProgress({ steps, currentStep, "aria-label": ariaLabel }: SelectionProgressProps) {
  const currentStepIndex = steps.indexOf(currentStep)

  return (
    <div className="flex items-center justify-between mb-6 relative" aria-label={ariaLabel || "Selection Progress"}>
      {/* Progress line background */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#2a3744] -translate-y-1/2 z-0" />

      {/* Active progress line */}
      <div
        className="absolute top-1/2 left-0 h-[2px] bg-[#40C4FF] -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
        style={{
          width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
        }}
      />

      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center z-10">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
              index === currentStepIndex
                ? "bg-[#40C4FF] text-white"
                : index < currentStepIndex
                  ? "bg-[#40C4FF] text-white"
                  : "bg-[#2a3744] text-gray-400",
            )}
          >
            {index < currentStepIndex ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
          </div>
          <span
            className={cn("mt-2 text-xs capitalize", index <= currentStepIndex ? "text-[#40C4FF]" : "text-gray-500")}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  )
}


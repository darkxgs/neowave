"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FilterOptionProps {
  label: string
  isActive: boolean
  onClick: () => void
  tooltip: string
}

export function FilterOption({ label, isActive, onClick, tooltip }: FilterOptionProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipOpen}>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "default" : "outline"}
            onClick={onClick}
            className={isActive ? "bg-[#40C4FF]" : "border-[#40C4FF] text-[#40C4FF]"}
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => setIsTooltipOpen(false)}
          >
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


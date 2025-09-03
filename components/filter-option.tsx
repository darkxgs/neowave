"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Filter } from "@/lib/FilterContext"

interface FilterOptionProps {
  filter: Filter
  active: boolean
  onClick: () => void
}

export function FilterOption({ filter, active, onClick }: FilterOptionProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip open={isTooltipOpen}>
        <TooltipTrigger asChild>
          <Button
            variant={active ? "default" : "outline"}
            onClick={onClick}
            className={active ? "bg-[#40C4FF]" : "border-[#40C4FF] text-[#40C4FF]"}
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => setIsTooltipOpen(false)}
          >
            {filter.name}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{filter.predefined ? `Standard filter: ${filter.name}` : `Custom filter: ${filter.name}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


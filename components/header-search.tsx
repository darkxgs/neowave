"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get("s")
    window.location.href = `https://neowave.tech/?s=${encodeURIComponent(searchQuery as string)}`
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#40C4FF]"
            aria-label="Open search"
            onClick={() => setIsOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="w-full bg-[#1B2531] border-[#2a3744]">
          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close search">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <form
            role="search"
            method="get"
            className="flex items-center space-x-2"
            action="https://neowave.tech/"
            onSubmit={handleSubmit}
          >
            <Input
              type="search"
              className="flex-grow bg-[#2a3744] border-[#3a4754] text-white"
              placeholder="Search For Neo Wave Product"
              name="s"
              aria-label="search-form"
            />
            <Button type="submit" className="bg-[#40C4FF] text-white hover:bg-blue-400">
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}


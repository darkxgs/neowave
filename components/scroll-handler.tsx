"use client"

import { useEffect } from "react"

export function ScrollHandler() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollBy(0, 50)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  return null
}


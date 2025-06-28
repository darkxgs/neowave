"use client"

import { useState, useEffect, useCallback } from "react"

export function useScroll(threshold = 0) {
  const [isScrolled, setIsScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > threshold
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled)
    }
  }, [isScrolled, threshold])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const throttledScroll = () => {
      if (timeoutId) return
      timeoutId = setTimeout(() => {
        handleScroll()
        timeoutId = setTimeout(() => {
          timeoutId = undefined
        }, 100)
      }, 10)
    }

    window.addEventListener("scroll", throttledScroll)
    return () => {
      window.removeEventListener("scroll", throttledScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [handleScroll])

  return isScrolled
}


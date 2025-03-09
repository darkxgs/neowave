"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Database, Lock } from "lucide-react"

export function AdminLink() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push("/admin/data-entry")}
      className="fixed bottom-4 right-4 z-50 bg-[#1B2531] border-[#3a4754] text-[#40C4FF] hover:bg-[#2a3744] shadow-lg"
    >
      <Database className="h-4 w-4 mr-2" />
      <span>Data Entry</span>
      <Lock className="h-3 w-3 ml-2 opacity-70" />
    </Button>
  )
} 
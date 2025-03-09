import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-[#111827] text-white">
      <h2 className="text-4xl font-bold text-[#40C4FF] mb-4">404</h2>
      <p className="text-xl mb-6">Page not found</p>
      <Button asChild variant="outline" className="text-[#40C4FF] border-[#40C4FF] hover:bg-[#2a3744]">
        <Link href="/">
          Return to Home
        </Link>
      </Button>
    </div>
  )
} 
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
}

export function BackButton({ href = "/dashboard", label = "Volver", className = "" }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button variant="ghost" size="sm" className={`flex items-center gap-1 px-2 ${className}`} onClick={handleClick}>
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}


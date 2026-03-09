"use client"

import { Building2 } from "lucide-react"
import { useEffect, useState } from "react"

export function SessionLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 300)
          return 100
        }
        return prev + 2
      })
    }, 30)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-2xl bg-primary/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div className="h-1.5 w-64 overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full rounded-full bg-primary transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Verificando sesion...</p>
        </div>
      </div>
    </div>
  )
}

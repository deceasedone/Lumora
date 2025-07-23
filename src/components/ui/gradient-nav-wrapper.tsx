"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface GradientNavWrapperProps {
  children: React.ReactNode
  className?: string
}

// THIS COMPONENT IS CORRECT - NO CHANGES NEEDED
export function GradientNavWrapper({ children, className }: GradientNavWrapperProps) {
  return <div className={cn("flex items-center gap-3", className)}>{children}</div>
}
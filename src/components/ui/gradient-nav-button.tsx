"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// --- FIX 1: Update the props interface ---
// We extend the standard HTML Button attributes.
// This allows our component to accept any prop a normal <button> can, like `type`, `aria-label`, etc.
export interface GradientNavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  title: string
  gradientFrom: string
  gradientTo: string
}

// --- FIX 2: Use React.forwardRef ---
// This allows parent components (like DialogTrigger) to get a reference to our underlying <button> element.
export const GradientNavButton = React.forwardRef<HTMLButtonElement, GradientNavButtonProps>(
  ({ children, title, gradientFrom, gradientTo, className, disabled, ...props }, ref) => {
    return (
      <button
        // --- FIX 3: Pass the ref and spread the rest of the props ---
        ref={ref}
        {...props} // This is crucial! It applies props like `onClick`, `aria-*`, `data-state` from parent triggers.
        style={
          {
            "--gradient-from": gradientFrom,
            "--gradient-to": gradientTo,
          } as React.CSSProperties
        }
        disabled={disabled} // The `disabled` attribute on a button handles everything for us.
        className={cn(
          "relative w-[40px] h-[40px] bg-[var(--card)] border border-[var(--border)] shadow-sm rounded-full flex items-center justify-center transition-all duration-500 hover:w-[120px] hover:shadow-lg group cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:w-[40px]", // Add disabled styles
          className,
        )}
      >
        {/* The inner structure remains the same */}
        <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100 group-disabled:opacity-0"></span>
        <span className="absolute top-[5px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[10px] opacity-0 -z-10 transition-all duration-500 group-hover:opacity-30 group-disabled:opacity-0"></span>
        <span className="relative z-10 transition-all duration-500 group-hover:scale-0 delay-0">
          <span className="text-[var(--foreground)] group-hover:text-white transition-colors duration-300">
            {children}
          </span>
        </span>
        <span className="absolute text-white uppercase tracking-wide text-xs font-medium transition-all duration-500 scale-0 group-hover:scale-100 delay-150 whitespace-nowrap">
          {title}
        </span>
      </button>
    )
  }
)
// Set a display name for better debugging
GradientNavButton.displayName = "GradientNavButton"
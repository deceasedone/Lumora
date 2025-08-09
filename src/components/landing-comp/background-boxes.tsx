"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const isTouchDevice = () =>
  typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)

const COLORS = [
  "rgb(147 51 234)",
  "rgb(139 92 246)",
  "rgb(168 85 247)",
  "rgb(196 181 253)",
  "rgb(59 130 246)",
  "rgb(147 197 253)",
  "rgb(165 180 252)",
  "rgb(216 180 254)",
  "rgb(196 181 253)",
]

const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const [dims, setDims] = React.useState(() => {
    if (typeof window === "undefined") return { rows: 40, cols: 24 }
    const w = window.innerWidth
    if (w < 640) return { rows: 22, cols: 12 } // sm
    if (w < 1024) return { rows: 30, cols: 18 } // md
    return { rows: 40, cols: 24 } // lg+
  })

  // Throttled resize to adapt density; improves Chrome perf on smaller screens
  React.useEffect(() => {
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const w = window.innerWidth
        setDims((prev) => {
          const next = w < 640 ? { rows: 22, cols: 12 } : w < 1024 ? { rows: 30, cols: 18 } : { rows: 40, cols: 24 }
          return prev.rows === next.rows && prev.cols === next.cols ? prev : next
        })
      })
    }
    window.addEventListener("resize", onResize, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  const rows = React.useMemo(() => Array.from({ length: dims.rows }), [dims.rows])
  const cols = React.useMemo(() => Array.from({ length: dims.cols }), [dims.cols])

  const getRandomColor = React.useCallback(() => COLORS[Math.floor(Math.random() * COLORS.length)], [])

  const containerStyle = React.useMemo(
    () => ({
      transform:
        "translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)",
      contain: "layout paint size",
      willChange: "transform",
    }),
    [],
  )

  const touch = isTouchDevice()

  return (
    <div
      style={containerStyle}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div key={`row` + i} className="w-16 h-8 border-l border-purple-900/30 relative">
          {cols.map((_, j) =>
            touch ? (
              <div key={`col` + j} className="w-16 h-8 border-r border-t border-purple-900/30 relative" />
            ) : (
              <motion.div
                key={`col` + j}
                whileHover={{ backgroundColor: getRandomColor(), transition: { duration: 0.08 } }}
                className="w-16 h-8 border-r border-t border-purple-900/30 relative"
                transition={{ type: "tween", duration: 0.08 }}
              >
                {j % 2 === 0 && i % 2 === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute h-6 w-10 -top-[14px] -left-[22px] text-purple-700/30 stroke-[1px] pointer-events-none"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                ) : null}
              </motion.div>
            ),
          )}
        </div>
      ))}
    </div>
  )
}

export const Boxes = React.memo(BoxesCore)
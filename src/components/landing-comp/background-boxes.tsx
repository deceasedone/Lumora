"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1)
  const cols = new Array(100).fill(1)

  // Purple/violet theme colors for LUMORA
  const colors = [
    "rgb(147 51 234)", // purple-600
    "rgb(139 92 246)", // violet-500
    "rgb(168 85 247)", // purple-500
    "rgb(196 181 253)", // violet-300
    "rgb(59 130 246)", // blue-500
    "rgb(147 197 253)", // blue-300
    "rgb(165 180 252)", // indigo-300
    "rgb(216 180 254)", // purple-300
    "rgb(196 181 253)", // violet-300
  ]

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div key={`row` + i} className="w-16 h-8 border-l border-purple-900/30 relative">
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-purple-900/30 relative"
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
          ))}
        </motion.div>
      ))}
    </div>
  )
}

export const Boxes = React.memo(BoxesCore)

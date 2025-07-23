"use client"

import { motion } from "motion/react"

interface RippleLogoProps {
  className?: string
  size?: number
  rippleCount?: number
}

export function RippleLogo({
  className = "",
  size = 64,
  rippleCount = 4,
}: RippleLogoProps) {
  const coreSize = size * 0.125
  const rippleMax = size * 0.75

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Core */}
      <motion.div
        className="rounded-full bg-[var(--accent)]"
        style={{
          width: coreSize,
          height: coreSize,
        }}
      />

      {/* Ripples */}
      {Array.from({ length: rippleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute border rounded-full border-[var(--border)]"
          animate={{
            width: [0, rippleMax],
            height: [0, rippleMax],
            opacity: [1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  )
}

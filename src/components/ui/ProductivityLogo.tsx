"use client"

import { motion } from "motion/react"

interface ProductivityLogoProps {
  className?: string
  size?: number
  pulseCount?: number
}

export function ProductivityLogo({
  className = "",
  size = 64,
  pulseCount = 3,
}: ProductivityLogoProps) {
  const coreSize = size * 0.375

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Core */}
      <motion.div
        className="rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--border)]"
        style={{
          width: coreSize,
          height: coreSize,
        }}
      />

      {/* Pulse Rings */}
      {Array.from({ length: pulseCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-[var(--border)]"
          style={{
            width: coreSize,
            height: coreSize,
          }}
          animate={{
            scale: [1, 2.5, 1],
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  )
}

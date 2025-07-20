"use client"

import { motion } from "motion/react"

interface LumoraLogoProps {
  className?: string
  size?: number
}

export function LumoraLogo({
  className = "",
  size = 64,
}: LumoraLogoProps) {
  const coreSize = size * 0.25
  const orbitSize = size * 0.75
  const particleSize = size * 0.125
  const particleColor = "var(--accent)"
  const orbitColor = "var(--border)"

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Core */}
      <motion.div
        className="rounded-full bg-[var(--accent)]"
        style={{ width: coreSize, height: coreSize }}
      />

      {/* Orbit Ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          width: orbitSize,
          height: orbitSize,
          borderColor: orbitColor,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Orbiting Particle */}
        <motion.div
          className="absolute -top-1 left-1/2 rounded-full -translate-x-1/2"
          style={{
            width: particleSize,
            height: particleSize,
            backgroundColor: particleColor,
          }}
          animate={{
            boxShadow: [
              `0 0 5px ${particleColor}`,
              `0 0 20px ${particleColor}`,
              `0 0 5px ${particleColor}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

"use client"

import { motion } from "motion/react"

interface LumoraLogoProps {
  className?: string
  size?: number
  coreColor?: string
  orbitColor?: string
}

export function LumoraLogo({
  className = "",
  size = 64,
  coreColor = "var(--accent)",
  orbitColor = "var(--border)",
}: LumoraLogoProps) {
  const coreSize = size * 0.25
  const orbitSize = size * 0.75
  const particleSize = size * 0.125

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Core */}
      <motion.div
        className="rounded-full"
        style={{
          width: coreSize,
          height: coreSize,
          backgroundColor: coreColor,
        }}
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
            backgroundColor: coreColor,
            boxShadow: `0 0 5px ${coreColor}, 0 0 20px ${coreColor}, 0 0 5px ${coreColor}`,
          }}
          animate={{
            boxShadow: [
              `0 0 5px ${coreColor}`,
              `0 0 20px ${coreColor}`,
              `0 0 5px ${coreColor}`,
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

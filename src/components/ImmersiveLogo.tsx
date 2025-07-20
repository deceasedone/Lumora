"use client"

import { motion } from "motion/react"

interface ImmersiveLogoProps {
  className?: string
  size?: number
  morphingSpeed?: number
}

export function ImmersiveLogo({
  className = "",
  size = 64,
  morphingSpeed = 8,
}: ImmersiveLogoProps) {
  const shapeSize = size * 0.625

  return (
    <motion.div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.div
        className="bg-gradient-to-br from-[var(--accent)] to-[var(--border)]"
        style={{ width: shapeSize, height: shapeSize }}
        animate={{
          borderRadius: [
            "20% 80% 80% 20%",
            "80% 20% 20% 80%",
            "50% 50% 50% 50%",
            "20% 80% 80% 20%",
          ],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: morphingSpeed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

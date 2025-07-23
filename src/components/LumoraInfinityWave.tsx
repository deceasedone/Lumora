"use client"

import { motion } from "framer-motion"

interface ParticleConstellationProps {
  className?: string
  size?: number
  particleColor?: string
  lineColor?: string
  particleCount?: number
  animationSpeed?: number
}

export function ParticleConstellation({
  className = "",
  size = 64,
  particleColor = "#8b5cf6",
  lineColor = "#8b5cf6",
  particleCount = 5,
  animationSpeed = 2,
}: ParticleConstellationProps) {
  // Define particle positions in a constellation pattern
  const particles = [
    { x: size * 0.167, y: size * 0.167 }, // Top left
    { x: size * 0.833, y: size * 0.167 }, // Top right
    { x: size * 0.5, y: size * 0.5 },     // Center
    { x: size * 0.167, y: size * 0.833 }, // Bottom left
    { x: size * 0.833, y: size * 0.833 }, // Bottom right
  ].slice(0, particleCount)

  // Define connections between particles
  const connections = [
    [0, 1], // Top edge
    [0, 2], // Top left to center
    [1, 2], // Top right to center
    [2, 3], // Center to bottom left
    [2, 4], // Center to bottom right
  ].filter(([a, b]) => a < particleCount && b < particleCount)

  return (
    <motion.div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Particles */}
      {particles.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * 0.125,
            height: size * 0.125,
            left: pos.x - size * 0.0625,
            top: pos.y - size * 0.0625,
            backgroundColor: particleColor,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: animationSpeed,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        {connections.map(([startIdx, endIdx], i) => {
          const start = particles[startIdx]
          const end = particles[endIdx]

          return (
            <motion.line
              key={i}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={lineColor}
              strokeWidth="1"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          )
        })}
      </svg>
    </motion.div>
  )
}

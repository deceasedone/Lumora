"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BreathingMeditation() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "pause">("inhale")
  const [seconds, setSeconds] = useState(0)
  const [cycle, setCycle] = useState(0)

  const breathingPattern = {
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
  }

  const phaseMessages = {
    inhale: "In",
    hold: "Hold",
    exhale: "Out",
    pause: "Pause",
  }

  const phaseColors = {
    inhale: "from-[var(--primary)] to-[var(--accent)]",
    hold: "from-[var(--secondary)] to-[var(--accent)]",
    exhale: "from-[var(--accent)] to-[var(--primary)]",
    pause: "from-[var(--accent)] to-[var(--secondary)]",
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1
          const currentPhaseDuration = breathingPattern[phase]

          if (newSeconds >= currentPhaseDuration) {
            if (phase === "inhale") {
              setPhase("hold")
            } else if (phase === "hold") {
              setPhase("exhale")
            } else if (phase === "exhale") {
              setPhase("pause")
            } else {
              setPhase("inhale")
              setCycle((prev) => prev + 1)
            }
            return 0
          }
          return newSeconds
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, phase])

  const progress = (seconds / breathingPattern[phase]) * 100

  return (
    <div className="w-36 h-36 bg-gradient-to-br from-[var(--background)] to-[var(--card)] border border-[var(--border)] rounded-lg p-2 flex flex-col">
      {/* Header */}
      <div className="text-center mb-1">
        <div className="text-[var(--foreground)] text-[10px] font-medium">Breathe</div>
        <div className="text-[var(--muted-foreground)] text-[9px]">Cycle: {cycle}</div>
      </div>

      {/* Breathing Circle */}
      <div className="flex-1 flex items-center justify-center relative">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-r ${phaseColors[phase]} transition-all duration-1000 ${
            isActive ? "animate-pulse" : ""
          } flex items-center justify-center`}
          style={{
            transform: phase === "inhale" ? "scale(1.3)" : phase === "exhale" ? "scale(0.7)" : "scale(1)",
            transition: "transform 1s ease-in-out",
          }}
        >
          <div className="text-[var(--foreground)] text-center">
            <div className="text-[10px] font-semibold">{phaseMessages[phase]}</div>
            <div className="text-[9px] opacity-75">{breathingPattern[phase] - seconds}</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[var(--muted)] rounded-full h-[3px] mb-1">
        <div
          className={`h-[3px] rounded-full bg-gradient-to-r ${phaseColors[phase]} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-1">
        <Button
          onClick={() => setIsActive(!isActive)}
          size="icon"
          className="bg-[var(--primary)] hover:bg-[var(--accent)] text-[var(--primary-foreground)] h-5 w-5 p-0"
        >
          {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </Button>

        <Button
          onClick={() => {
            setIsActive(false)
            setPhase("inhale")
            setSeconds(0)
            setCycle(0)
          }}
          size="icon"
          variant="outline"
          className="border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] bg-transparent h-5 w-5 p-0"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

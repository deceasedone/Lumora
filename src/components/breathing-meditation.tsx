"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BreathingMeditation() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "pause">("inhale")
  const [seconds, setSeconds] = useState(0)
  const [cycle, setCycle] = useState(0)

  // Breathing pattern: 4-4-4-4 (inhale-hold-exhale-pause)
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
    inhale: "from-blue-400 to-cyan-400",
    hold: "from-yellow-400 to-orange-400",
    exhale: "from-green-400 to-emerald-400",
    pause: "from-purple-400 to-pink-400",
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1
          const currentPhaseDuration = breathingPattern[phase]

          if (newSeconds >= currentPhaseDuration) {
            // Move to next phase
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
    <div className="w-48 h-48 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 rounded-lg p-3 flex flex-col">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="text-white text-sm font-medium">Breathe</div>
        <div className="text-slate-400 text-xs">Cycle: {cycle}</div>
      </div>

      {/* Breathing Circle */}
      <div className="flex-1 flex items-center justify-center relative">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${phaseColors[phase]} transition-all duration-1000 ${
            isActive ? "animate-pulse" : ""
          } flex items-center justify-center`}
          style={{
            transform: phase === "inhale" ? "scale(1.3)" : phase === "exhale" ? "scale(0.7)" : "scale(1)",
            transition: "transform 1s ease-in-out",
          }}
        >
          <div className="text-white text-center">
            <div className="text-xs font-semibold">{phaseMessages[phase]}</div>
            <div className="text-xs opacity-75">{breathingPattern[phase] - seconds}</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-1 mb-2">
        <div
          className={`h-1 rounded-full bg-gradient-to-r ${phaseColors[phase]} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => setIsActive(!isActive)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white h-6 w-6 p-0"
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
          size="sm"
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent h-6 w-6 p-0"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

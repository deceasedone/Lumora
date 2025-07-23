"use client"

import { useAtomValue } from "jotai"
import { dailyGoalAtom, timerAtom } from "@/context/data"

import { Progress } from "./ui/progress"
import { DailyGoalDrawerTrigger } from "./overlay"
import { RetroVideoPlayer } from "./retro-video-player"
import { BreathingMeditation } from "./breathing-meditation"
import { ParticleButton } from "./ui/particle-button"

export function BottomHeader() {
  const dailyGoal = useAtomValue(dailyGoalAtom)
  const timer = useAtomValue(timerAtom)
  const progress = dailyGoal > 0 ? Math.min((timer / dailyGoal) * 100, 100) : 0

  return (
    <div className="relative flex w-full flex-col justify-center">
      <div className="flex w-full items-center justify-between gap-4 px-2 py-3">
        {/* 1. Video Player (increased height to match breathing component) */}
        <div className="flex-1 max-w-[420px] h-48">
          <RetroVideoPlayer title="Animatrix" />
        </div>

        {/* 2. Breathing Meditation (center component) */}
        <div className="flex items-center justify-center shrink-0">
          <BreathingMeditation />
        </div>

        {/* 3. Right Side Controls - Star Button + Daily Goal Progress */}
        <div className="flex items-center gap-4 shrink-0">


          {/* Daily Goal Progress */}
          {dailyGoal > 0 && (
            <div className="flex w-32 flex-col items-center">
              <div className="mb-2 flex w-full justify-center">
                <DailyGoalDrawerTrigger />
              </div>
              <Progress value={progress} className="h-2 w-full" />
              <span className="mt-1 text-[10px] text-[var(--muted-foreground)] text-center">
                {Math.floor(timer / (60 * 1000))} /{" "}
                {Math.floor(dailyGoal / (60 * 1000))} min
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
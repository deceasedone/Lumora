"use client"

import { useAtomValue } from "jotai"
import { dailyGoalAtom, timerAtom } from "@/context/data"

import { Progress } from "./ui/progress"
import { DailyGoalDrawerTrigger } from "./overlay"
import { RetroVideoPlayer } from "./retro-video-player"
import { BreathingMeditation } from "./breathing-meditation"
import { ParticleButton } from "./ui/particle-button"
import { GradientNavButton } from "./ui/gradient-nav-button"
import { Zap, Shuffle } from "lucide-react"
import { showMotivationToast, showFactToast } from "./popups"

export function BottomHeader() {
  const dailyGoal = useAtomValue(dailyGoalAtom)
  const timer = useAtomValue(timerAtom)
  const progress = dailyGoal > 0 ? Math.min((timer / dailyGoal) * 100, 100) : 0

  return (
    <div className="relative flex w-full flex-col justify-center">
      <div className="flex w-full items-center gap-4 ">
        {/* 1. Video Player (increased height to match breathing component) */}
        <div className="flex-1 h-full max-w-[500px]">
          <RetroVideoPlayer title="Animatrix" />
        </div>
        {/* 2. Breathing Meditation (immediately to the right) */}
        <BreathingMeditation />
        {/* 3. Summon Button with Motivate and Surprise below */}
        <div className="flex flex-col items-center">
          <button
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)] text-[var(--primary-foreground)] font-semibold tracking-wide shadow-lg transition-all duration-200 mb-2 border-2 border-[var(--border)] hover:scale-105 hover:border-[var(--accent)] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60 focus:ring-offset-2"
            onClick={() => alert('A Virtual Companion will be Added Soon!!')}
          >
            Summon
          </button>
          <div className="flex flex-row gap-2 w-full justify-center">
            <GradientNavButton title="Motivate" gradientFrom="#a955ff" gradientTo="#ea51ff" onClick={showMotivationToast}>
              <Zap className="h-4 w-4" />
            </GradientNavButton>
            <GradientNavButton title="Surprise" gradientFrom="#56CCF2" gradientTo="#2F80ED" onClick={showFactToast}>
              <Shuffle className="h-4 w-4" />
            </GradientNavButton>
          </div>
        </div>
        {/* 4. Daily Goal Progress (moved to far right) */}
        {dailyGoal > 0 && (
          <div className="flex w-32 flex-col items-center ml-auto">
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
  )
}
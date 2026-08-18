"use client"

import { useAtomValue } from "jotai"
import { dailyGoalAtom, timerAtom } from "@/context/data"
import { Progress } from "./ui/progress"
import { DailyGoalDrawerTrigger } from "./overlay"
import { DaylightWidget } from "./dashboard-widgets/daylight-widget"
import { YearWidget } from "./dashboard-widgets/year-widget"
import { WorldClockWidget } from "./dashboard-widgets/world-clock-widget"
import { GradientNavButton } from "./ui/gradient-nav-button"
import { Zap, Shuffle, Sparkles } from "lucide-react"
import { showMotivationToast, showFactToast } from "./popups"
import { useShimeji } from "./shimeji/ShimejiSpec"

export function BottomHeader() {
  const dailyGoal = useAtomValue(dailyGoalAtom)
  const timer = useAtomValue(timerAtom)
  const { summon, count } = useShimeji()
  const progress = dailyGoal > 0 ? Math.min((timer / dailyGoal) * 100, 100) : 0

  return (
    <div className="relative flex w-full flex-col justify-center h-[140px]"> {/* Fixed height prevents player shrinkage */}
      <div className="flex w-full items-center gap-4 h-full">
        {/* 1–3. Daylight, Year, and World Clock */}
        <div className="flex flex-1 items-stretch gap-3 h-full min-w-0">
          <div className="flex-1 min-w-0">
            <DaylightWidget />
          </div>
          <div className="flex-1 min-w-0">
            <YearWidget />
          </div>
          <WorldClockWidget />
        </div>
        {/* 3. Summon Button with Motivate and Surprise below (COMMENTED OUT FOR SPACE) */}
        {/* 
        <div className="flex flex-col items-center">
          <button
            className="px-6 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold tracking-wide shadow-lg transition-all duration-200 mb-2 border-2 border-[var(--border)] hover:scale-105 hover:border-[var(--accent)] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60 focus:ring-offset-2"
            onClick={() => alert('A Virtual Companion will be Added Soon!!')}
          >
            Summon
          </button>
          <div className="flex flex-row gap-2 w-full justify-center">
            <GradientNavButton title="Motivate" gradientFrom="#a955ff" gradientTo="#ea51ff" onClick={() => showMotivationToast()}>
              <Zap className="h-4 w-4" />
            </GradientNavButton>
            <GradientNavButton title="Surprise" gradientFrom="#56CCF2" gradientTo="#2F80ED" onClick={() => showFactToast()}>
              <Shuffle className="h-4 w-4" />
            </GradientNavButton>
          </div>
        </div> 
        */}
        {/* 4. Right Side Cluster: Goal Ring + Tiny Summon Button */}
        <div className="flex h-full flex-col items-center justify-center ml-auto pr-2 sm:pr-4 shrink-0 pl-2">
          
          {/* Daily Goal Ring */}
          {dailyGoal > 0 && (
            <div className="mb-1">
              <DailyGoalDrawerTrigger />
            </div>
          )}

          {/* Tiny Summon Button below the ring */}
          <button
            onClick={() => summon()}
            className="group flex items-center justify-center transition-transform hover:scale-110 outline-none"
            title={`Summon random companion${count > 0 ? ` (${count} active)` : ""}`}
            aria-label="Summon random companion"
          >
            <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shadow-sm group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)]/10 transition-colors">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--primary)] opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
          
        </div>
      </div>
    </div>
  )
}
"use client"

import { BrainCircuit } from "lucide-react"
import { useAtomValue } from "jotai"
import { dailyGoalAtom, timerAtom } from "@/context/data"
import { Progress } from "./ui/progress"
import { DailyGoalDrawerTrigger } from "./overlay"

export function Stats() {
  const dailyGoal = useAtomValue(dailyGoalAtom)
  const timer = useAtomValue(timerAtom)
  const progress = dailyGoal > 0 ? Math.min((timer / dailyGoal) * 100, 100) : 0

  return (
    <div className="relative flex h-full w-full flex-col justify-center p-4">

      {/* Flex row: left = animatrix, right = progress bar */}
      <div className="flex w-full items-center">
        <div className="flex-1 flex flex-col items-center justify-center">
          <BrainCircuit className="h-6 w-6 text-[var(--muted-foreground)]/50" />
          <h3 className="mt-2 text-sm font-semibold text-[var(--muted-foreground)]">
            Animatrix
          </h3>
          <p className="text-xs text-[var(--muted-foreground)]/70 mt-1">
            Future integrations will appear here.
          </p>
        </div>
        {dailyGoal > 0 && (
          <div className="flex flex-col items-center ml-4 w-28">
            <div className="mb-2 flex justify-center w-full">
              <DailyGoalDrawerTrigger />
            </div>
            <Progress value={progress} className="h-2 w-full" />
            <span className="text-[10px] text-[var(--muted-foreground)] mt-1">
              {Math.floor(timer / (60 * 1000))} / {Math.floor(dailyGoal / (60 * 1000))} min
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
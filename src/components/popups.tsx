"use client"

import { MOTIVATIONAL_QUOTES, SURPRISING_FACTS } from "@/data/misc"
import { Lightbulb, Sparkles } from "lucide-react"
import { toast } from "sonner"

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export const showMotivationToast = () => {
  const quote = getRandomItem(MOTIVATIONAL_QUOTES)
  toast(quote, {
    icon: <Lightbulb className="h-4 w-4 text-yellow-400" />,
    duration: 5000,
  })
}

export const showFactToast = () => {
  const fact = getRandomItem(SURPRISING_FACTS)
  toast(fact, {
    icon: <Sparkles className="h-4 w-4 text-cyan-400" />,
    duration: 5000,
  })
}

"use client"

import { SURPRISING_FACTS } from "@/data/misc"
import { Lightbulb, Sparkles } from "lucide-react"
import { toast } from "sonner"

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export const showMotivationToast = async () => {
  try {
    const response = await fetch('https://api.quotable.io/quotes/random')
    const data = await response.json()
    
    if (data && data.length > 0 && data[0].content) {
      const quote = `${data[0].content} - ${data[0].author}`
      toast(quote, {
        icon: <Lightbulb className="h-4 w-4 text-yellow-400" />,
        duration: 5000,
      })
    } else {
      // Fallback to a default quote if API fails
      toast("The only way to do great work is to love what you do. - Steve Jobs", {
        icon: <Lightbulb className="h-4 w-4 text-yellow-400" />,
        duration: 5000,
      })
    }
  } catch (error) {
    console.error('Failed to fetch motivational quote:', error)
    // Fallback to a default quote if API fails
    toast("Believe you can and you're halfway there. - Theodore Roosevelt", {
      icon: <Lightbulb className="h-4 w-4 text-yellow-400" />,
      duration: 5000,
    })
  }
}

export const showFactToast = async () => {
  try {
    const response = await fetch('https://f-api.ir/api/facts/random')
    const data = await response.json()
    
    if (data && data.fact) {
      const fact = `${data.fact} - ${data.category}`
      toast(fact, {
        icon: <Sparkles className="h-4 w-4 text-cyan-400" />,
        duration: 5000,
      })
    } else {
      // Fallback to a default fact if API fails
      toast("A single cloud can weigh more than 1 million pounds. - Nature", {
        icon: <Sparkles className="h-4 w-4 text-cyan-400" />,
        duration: 5000,
      })
    }
  } catch (error) {
    console.error('Failed to fetch surprising fact:', error)
    // Fallback to a default fact if API fails
    toast("Bananas are berries, but strawberries aren't. - Nature", {
      icon: <Sparkles className="h-4 w-4 text-cyan-400" />,
      duration: 5000,
    })
  }
}

import type React from "react"
import { cn } from "@/lib/utils"
import { Timer, CheckSquare, BookOpen, Palette, Music, Users, Brain, Zap } from "lucide-react"

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Pomodoro Mastery",
      description:
        "Advanced focus sessions with customizable intervals and productivity analytics that adapt to your natural rhythm.",
      icon: <Timer className="w-6 h-6" />,
    },
    {
      title: "Intelligent Tasks",
      description:
        "AI-powered task prioritization with smart scheduling and seamless integration with your focus sessions.",
      icon: <CheckSquare className="w-6 h-6" />,
    },
    {
      title: "Mindful Journaling",
      description:
        "Capture insights with markdown support, mood tracking, and AI-powered reflection prompts that help you grow.",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: "Sonic Landscapes",
      description: "Curated audio experiences with binaural beats, nature sounds, and focus-enhancing frequencies.",
      icon: <Music className="w-6 h-6" />,
    },
    {
      title: "Reality Themes",
      description:
        "Transform your workspace with immersive themes - from minimalist zen gardens to cyberpunk terminals.",
      icon: <Palette className="w-6 h-6" />,
    },
    {
      title: "Focus Tribes",
      description:
        "Join synchronized study sessions, share accountability with peers, and build lasting productivity habits.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "AI Companion",
      description:
        "Your personal productivity coach that learns your patterns and suggests optimizations for peak performance.",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      title: "Flow States",
      description:
        "Enter deep work modes with distraction blocking, ambient lighting cues, and neuroplasticity-based focus training.",
      icon: <Zap className="w-6 h-6" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  )
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string
  description: string
  icon: React.ReactNode
  index: number
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-purple-500/20",
        (index === 0 || index === 4) && "lg:border-l border-purple-500/20",
        index < 4 && "lg:border-b border-purple-500/20",
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-purple-950/20 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-purple-950/20 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-purple-400">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-purple-500/30 group-hover/feature:bg-purple-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-300 max-w-xs relative z-10 px-10">{description}</p>
    </div>
  )
}

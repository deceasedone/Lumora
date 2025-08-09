import type React from "react"
import { cn } from "@/lib/utils"
import { Timer, LayoutDashboard, Cat, Palette, Music, Users, Brain, Zap, PlaySquare } from "lucide-react"

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Live Focus Rooms",
      description:
        "Join collaborative sessions with synchronized timers and YouTube playback, enabling real-time chat, voice calls, and screen sharing.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Dynamic Focus Timer",
      description:
        "Stay on task with a customizable Pomodoro timer that seamlessly integrates with your personal dashboard and live focus rooms.",
      icon: <Timer className="w-6 h-6" />,
    },
    {
      title: "Virtual Companion",
      description:
        "A virtual companion that roams your screen, providing a delightful and engaging presence to accompany you during your work sessions.",
      icon: <Cat className="w-6 h-6" />,
    },
    {
      title: "Unified Productivity Suite",
      description:
        "Manage your tasks, calendar, and journal with powerful, integrated tools for streamlined organization and self-reflection.",
      icon: <LayoutDashboard className="w-6 h-6" />,
    },
    {
      title: "Immersive Themes",
      description:
        "Personalize your workspace with a wide selection of dynamic themes, from calm zen gardens to futuristic cyberpunk aesthetics.",
      icon: <Palette className="w-6 h-6" />,
    },
    {
      title: "Ambient Soundscapes",
      description:
        "Enhance your concentration with a curated library of ambient soundscapes, binaural beats, and focus-enhancing frequencies.",
      icon: <Music className="w-6 h-6" />,
    },
    {
      title: "Full-Screen Focus Mode",
      description:
        "Enter a distraction-free, full-screen environment with live wallpapers and dynamic timers to achieve peak concentration.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Synchronized Media Player",
      description:
        "A shared video player that allows everyone in a live room to watch and listen to content together, perfectly in sync.",
      icon: <PlaySquare className="w-6 h-6" />,
    },
  ];

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

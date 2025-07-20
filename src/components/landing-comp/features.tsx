"use client"

import { Timer, CheckSquare, BookOpen, Palette, Music, Users, Zap, Brain } from "lucide-react"
import { FeaturesSectionWithHoverEffects } from "@/components/landing-comp/feature-section-with-hover-effects"

export function Features() {
  const features = [
    {
      icon: Timer,
      title: "Pomodoro Mastery",
      description:
        "Advanced focus sessions with customizable intervals, break reminders, and productivity analytics that adapt to your natural rhythm.",
      gradient: "from-purple-500 to-violet-600",
      glowColor: "purple-500/20",
    },
    {
      icon: CheckSquare,
      title: "Intelligent Tasks",
      description:
        "AI-powered task prioritization with smart scheduling, deadline tracking, and seamless integration with your focus sessions.",
      gradient: "from-blue-500 to-cyan-600",
      glowColor: "blue-500/20",
    },
    {
      icon: BookOpen,
      title: "Mindful Journaling",
      description:
        "Capture insights with markdown support, mood tracking, and AI-powered reflection prompts that help you grow.",
      gradient: "from-violet-500 to-purple-600",
      glowColor: "violet-500/20",
    },
    {
      icon: Music,
      title: "Sonic Landscapes",
      description:
        "Curated audio experiences with binaural beats, nature sounds, and focus-enhancing frequencies tailored to your workflow.",
      gradient: "from-cyan-500 to-blue-600",
      glowColor: "cyan-500/20",
    },
    {
      icon: Palette,
      title: "Reality Themes",
      description:
        "Transform your entire workspace with immersive themes - from minimalist zen gardens to cyberpunk terminals.",
      gradient: "from-pink-500 to-rose-600",
      glowColor: "pink-500/20",
    },
    {
      icon: Users,
      title: "Focus Tribes",
      description:
        "Join synchronized study sessions, share accountability with peers, and build lasting productivity habits together.",
      gradient: "from-indigo-500 to-purple-600",
      glowColor: "indigo-500/20",
    },
    {
      icon: Brain,
      title: "AI Companion",
      description:
        "Your personal productivity coach that learns your patterns and suggests optimizations for peak performance.",
      gradient: "from-emerald-500 to-teal-600",
      glowColor: "emerald-500/20",
    },
    {
      icon: Zap,
      title: "Flow States",
      description:
        "Enter deep work modes with distraction blocking, ambient lighting cues, and neuroplasticity-based focus training.",
      gradient: "from-orange-500 to-red-600",
      glowColor: "orange-500/20",
    },
  ]

  return (
    <section id="features" className="py-32 relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-purple-400 text-sm font-medium">✨ Powerful Features</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            Beyond Ordinary
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Productivity
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the next evolution of digital workspaces with features designed to unlock your full potential.
          </p>
        </div>

        <FeaturesSectionWithHoverEffects />
      </div>
    </section>
  )
}

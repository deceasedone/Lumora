"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { LampContainer } from "@/components/landing-comp/lamp"
import { HeroSection } from "@/components/landing-comp/3d-hero-section-boxes"

interface HeroProps {
  onGetStarted: () => void
  onAuthClick: (type: "login" | "signup") => void
}

export function Hero({ onGetStarted, onAuthClick }: HeroProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<"lumora" | "lumora">("lumora")

  return (
    <LampContainer>
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 text-center max-w-5xl mx-auto"
      >
        {/* Theme Switcher */}
        <div className="mb-8 flex justify-center">
          <div className="bg-black/40 backdrop-blur-xl rounded-full p-1.5 border border-purple-500/30 shadow-2xl shadow-purple-500/10">
            <Button
              variant={currentTheme === "lumora" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTheme("lumora")}
              className={
                currentTheme === "lumora"
                  ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg"
                  : "text-purple-300 hover:text-white hover:bg-purple-500/20"
              }
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Zen Mode
            </Button>
            <Button
              variant={currentTheme === "lumora" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTheme("lumora")}
              className={
                currentTheme === "lumora"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "text-blue-300 hover:text-white hover:bg-blue-500/20"
              }
            >
              <span className="w-4 h-4 mr-2 text-xs font-mono">[M]</span>
              Matrix Mode
            </Button>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="bg-gradient-to-br from-white via-purple-200 to-violet-300 py-4 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-7xl leading-tight mb-6">
          Your Digital
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
            Sanctuary
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Transform your productivity with an immersive workspace that adapts to your mood. Combine powerful focus tools
          with stunning visuals and ambient soundscapes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 text-white hover:from-purple-600 hover:via-violet-600 hover:to-blue-600 px-10 py-4 text-lg font-semibold shadow-2xl shadow-purple-500/25 border-0 group"
          >
            <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Enter Lumora
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-white px-10 py-4 text-lg bg-transparent backdrop-blur-sm"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </div>

        {/* Enhanced Audio Player Preview */}
        <div className="relative max-w-lg mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">Lofi Sanctuary</div>
                  <div className="text-purple-300 text-sm">Ambient Focus Mix</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-purple-400 hover:bg-purple-500/20 hover:text-white w-12 h-12 rounded-xl"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
            </div>

            <div className="space-y-3">
              <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-400 to-blue-500 h-2 rounded-full w-1/3 shadow-lg shadow-purple-500/50"></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>2:34</span>
                <span>8:42</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section Component */}
        <HeroSection onGetStarted={onGetStarted} onAuthClick={onAuthClick} />
      </motion.div>
    </LampContainer>
  )
}

"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Spline from "@splinetool/react-spline"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, Sparkles } from "lucide-react"

function HeroSplineBackground() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        pointerEvents: "auto",
        overflow: "hidden",
      }}
    >
      <Spline
        style={{
          width: "100%",
          height: "100vh",
          pointerEvents: "auto",
        }}
        scene="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode"
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.8), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.8)),
            linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.9))
          `,
          pointerEvents: "none",
        }}
      />
    </div>
  )
}

function ScreenshotSection({ screenshotRef }: { screenshotRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <section className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 mt-11 md:mt-12">
      <div
        ref={screenshotRef}
        className="bg-gray-900/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-purple-500/30 w-full md:w-[80%] lg:w-[70%] mx-auto"
      >
        <div>
          <img
            src="/placeholder.svg?height=600&width=1200"
            alt="Lumora Dashboard Preview"
            className="w-full h-auto block rounded-lg mx-auto"
          />
        </div>
      </div>
    </section>
  )
}

function HeroContent({ onGetStarted }: { onGetStarted: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<"zen" | "matrix">("zen")

  return (
    <div className="text-white px-4 max-w-screen-xl mx-auto w-full flex flex-col lg:flex-row justify-between items-start lg:items-center py-16">
      <div className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-8 lg:mb-0">
        {/* Theme Switcher */}
        <div className="mb-8 flex justify-start">
          <div className="bg-black/40 backdrop-blur-xl rounded-full p-1.5 border border-purple-500/30 shadow-2xl shadow-purple-500/10">
            <Button
              variant={currentTheme === "zen" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTheme("zen")}
              className={
                currentTheme === "zen"
                  ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg"
                  : "text-purple-300 hover:text-white hover:bg-purple-500/20"
              }
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Zen Mode
            </Button>
            <Button
              variant={currentTheme === "matrix" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTheme("matrix")}
              className={
                currentTheme === "matrix"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "text-blue-300 hover:text-white hover:bg-blue-500/20"
              }
            >
              <span className="w-4 h-4 mr-2 text-xs font-mono">[M]</span>
              Matrix Mode
            </Button>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-wide bg-gradient-to-br from-white via-purple-200 to-violet-300 bg-clip-text text-transparent">
          Your Digital
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
            Sanctuary
          </span>
        </h1>
        <div className="text-sm text-purple-300 opacity-90 mt-4 font-mono">FOCUS \ FLOW \ ZEN \ MATRIX</div>
      </div>
      <div className="w-full lg:w-1/2 pl-0 lg:pl-8 flex flex-col items-start">
        <p className="text-base sm:text-lg opacity-80 mb-6 max-w-md text-gray-300">
          Transform your productivity with an immersive workspace that adapts to your mood. Where focus meets artistry.
        </p>
        <div className="flex pointer-events-auto flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 text-white font-semibold py-2.5 sm:py-3.5 px-6 sm:px-8 rounded-2xl transition duration-300 hover:scale-105 flex items-center justify-center w-full sm:w-auto shadow-lg shadow-purple-500/25"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-white" />
            Enter the Matrix
          </button>
          <button className="border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-white font-semibold py-2.5 sm:py-3.5 px-6 sm:px-8 rounded-2xl transition duration-300 w-full sm:w-auto">
            <Play className="w-4 h-4 mr-2" />
            Watch Demo
          </button>
        </div>

        {/* Enhanced Audio Player Preview */}
        <div className="relative max-w-sm w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Lofi Sanctuary</div>
                  <div className="text-purple-300 text-xs">Ambient Focus Mix</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-purple-400 hover:bg-purple-500/20 hover:text-white w-10 h-10 rounded-xl"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-400 to-blue-500 h-1.5 rounded-full w-1/3 shadow-lg shadow-purple-500/50"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>2:34</span>
                <span>8:42</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Navbar({ onAuthClick }: { onAuthClick: (type: "login" | "signup") => void }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-20"
      style={{
        backgroundColor: "rgba(13, 13, 24, 0.3)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderRadius: "0 0 0.75rem 0.75rem",
      }}
    >
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-violet-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-violet-500 to-blue-500 rounded-xl blur-md opacity-50 -z-10"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">
                ZEN MATRIX
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-300 hover:text-purple-400 text-sm transition duration-150">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-purple-400 text-sm transition duration-150">
              How It Works
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-purple-400 text-sm transition duration-150">
              Reviews
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onAuthClick("login")}
            className="text-gray-300 hover:text-purple-400 px-4 py-2 text-sm transition duration-300"
          >
            Login
          </button>
          <button
            onClick={() => onAuthClick("signup")}
            className="border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-white px-5 py-2 rounded-full text-sm transition duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  )
}

const HeroSection = ({
  onGetStarted,
  onAuthClick,
}: { onGetStarted: () => void; onAuthClick: (type: "login" | "signup") => void }) => {
  const screenshotRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (screenshotRef.current && heroContentRef.current) {
        requestAnimationFrame(() => {
          const scrollPosition = window.pageYOffset
          if (screenshotRef.current) {
            screenshotRef.current.style.transform = `translateY(-${scrollPosition * 0.5}px)`
          }
          const maxScroll = 400
          const opacity = 1 - Math.min(scrollPosition / maxScroll, 1)
          if (heroContentRef.current) {
            heroContentRef.current.style.opacity = opacity.toString()
          }
        })
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative">
      <Navbar onAuthClick={onAuthClick} />
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <HeroSplineBackground />
        </div>
        <div
          ref={heroContentRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <HeroContent onGetStarted={onGetStarted} />
        </div>
      </div>
      <div className="bg-black relative z-10" style={{ marginTop: "-10vh" }}>
        <ScreenshotSection screenshotRef={screenshotRef} />
      </div>
    </div>
  )
}

export { HeroSection }

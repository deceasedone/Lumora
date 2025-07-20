"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Sparkles,
  Timer,
  Music,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  details: string[]
  image?: string
  color: string
}

interface HowItWorksProps {
  steps?: Step[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showProgress?: boolean
  variant?: "carousel" | "tabs" | "progressive"
}

const defaultSteps: Step[] = [
  {
    id: 1,
    title: "Choose Your Reality",
    description: "Select your perfect environment - from serene zen gardens to cyberpunk terminals",
    icon: <Sparkles className="w-6 h-6" />,
    details: [
      "Switch between Zen and Matrix themes instantly",
      "Customize ambient lighting and visual effects",
      "Create personalized workspace environments",
      "Save and share your favorite setups",
    ],
    color: "from-purple-500 to-violet-600",
  },
  {
    id: 2,
    title: "Craft Your Soundscape",
    description: "Layer binaural beats, nature sounds, and focus frequencies for peak performance",
    icon: <Music className="w-6 h-6" />,
    details: [
      "Access curated focus-enhancing audio libraries",
      "Mix and match different sound layers",
      "AI-powered audio recommendations",
      "Sync soundscapes with your work sessions",
    ],
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: 3,
    title: "Enter Flow State",
    description: "Launch intelligent Pomodoro sessions that adapt to your natural rhythm",
    icon: <Timer className="w-6 h-6" />,
    details: [
      "Smart break timing based on your productivity patterns",
      "Seamless task integration with focus sessions",
      "Real-time productivity analytics and insights",
      "Collaborative focus rooms with team members",
    ],
    color: "from-violet-500 to-purple-600",
  },
  {
    id: 4,
    title: "Evolve & Grow",
    description: "Track insights, analyze patterns, and receive AI-powered growth suggestions",
    icon: <BarChart3 className="w-6 h-6" />,
    details: [
      "Comprehensive productivity analytics dashboard",
      "AI-powered insights and recommendations",
      "Goal tracking and achievement celebrations",
      "Export data and integrate with other tools",
    ],
    color: "from-cyan-500 to-blue-600",
  },
]

const StepCard: React.FC<{ step: Step; isActive: boolean; onClick: () => void }> = ({ step, isActive, onClick }) => {
  return (
    <motion.div
      className={`relative cursor-pointer transition-all duration-300 ${isActive ? "scale-105" : "hover:scale-102"}`}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`p-6 border-2 transition-all duration-300 h-full ${
          isActive
            ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/25"
            : "border-purple-500/20 hover:border-purple-500/40 bg-black/60 backdrop-blur-xl"
        }`}
      >
        <div className="flex items-start space-x-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${step.color} text-white shadow-lg`}
          >
            {step.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                Step {step.id}
              </Badge>
              {isActive && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-purple-400">
                  <CheckCircle className="w-4 h-4" />
                </motion.div>
              )}
            </div>
            <h3
              className={`font-semibold text-lg mb-2 transition-colors ${isActive ? "text-purple-300" : "text-white"}`}
            >
              {step.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const StepDetails: React.FC<{ step: Step }> = ({ step }) => {
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <div
          className={`inline-flex w-20 h-20 rounded-full bg-gradient-to-r ${step.color} items-center justify-center text-white text-2xl shadow-2xl`}
        >
          {step.icon}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{step.title}</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{step.description}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {step.details.map((detail, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{detail}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const HowItWorks: React.FC<HowItWorksProps> = ({
  steps = defaultSteps,
  autoPlay = false,
  autoPlayInterval = 5000,
  showProgress = true,
  variant = "carousel",
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying && autoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length)
      }, autoPlayInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, autoPlay, autoPlayInterval, steps.length])

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length)
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)
  }

  const goToStep = (index: number) => {
    setCurrentStep(index)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      prevStep()
    } else if (event.key === "ArrowRight") {
      nextStep()
    } else if (event.key === " ") {
      event.preventDefault()
      setIsPlaying(!isPlaying)
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <section
      className="py-32 px-4 bg-black relative overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="How it works guide"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/10 to-black" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-blue-400 text-sm font-medium">🚀 Simple Process</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Your Journey to
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Peak Focus
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your productivity in four simple steps. No complex setup, just pure focus enhancement.
            </p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-400">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 items-stretch">
          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} isActive={currentStep === index} onClick={() => goToStep(index)} />
          ))}
        </div>

        {/* Step Details */}
        <div className="relative min-h-[400px] mb-8">
          <AnimatePresence mode="wait">
            <StepDetails step={steps[currentStep]} />
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
              aria-label="Previous step"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-white bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              aria-label="Next step"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-white bg-transparent"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            {autoPlay && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
                className="text-purple-300 hover:bg-purple-500/10 hover:text-white"
              >
                <Play className={`w-4 h-4 mr-2 ${isPlaying ? "opacity-50" : ""}`} />
                {isPlaying ? "Pause" : "Play"}
              </Button>
            )}

            <Button className="group bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 text-white hover:from-purple-600 hover:via-violet-600 hover:to-blue-600 shadow-lg shadow-purple-500/25">
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentStep === index
                  ? "bg-purple-500 scale-125 shadow-lg shadow-purple-500/50"
                  : "bg-purple-500/30 hover:bg-purple-500/50"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HowItWorksDemo() {
  return <HowItWorks autoPlay={true} showProgress={true} variant="carousel" />
}

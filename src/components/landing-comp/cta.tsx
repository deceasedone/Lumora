"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import { Boxes } from "@/components/landing-comp/background-boxes"
import { cn } from "@/lib/utils"

interface CTAProps {
  onGetStarted: () => void
}

export function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Animated Background Boxes Container */}
      <div className="relative min-h-[800px] w-full flex flex-col items-center justify-center py-32">
        {/* Background boxes */}
        <div className="absolute inset-0 w-full h-full bg-black z-0">
          <div className="absolute inset-0 w-full h-full bg-black z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
          <Boxes />
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto text-center z-30">
          <div className="max-w-5xl mx-auto text-center">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-violet-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-violet-500 to-blue-500 rounded-3xl blur-xl opacity-50 -z-10 animate-pulse" />
              </div>
            </div>

            {/* Headline */}
            <h2 className={cn("text-5xl md:text-8xl font-bold mb-8 text-white relative z-20 leading-tight")}>
              Ready to Enter
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                 LUMORA?
              </span>
            </h2>

            {/* Subheadline */}
            <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed relative z-20">
              Join the digital sanctuary where productivity meets artistry. Transform your workflow into a masterpiece.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 relative z-20">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 text-white hover:from-purple-600 hover:via-violet-600 hover:to-blue-600 px-12 py-6 text-xl font-bold shadow-2xl shadow-purple-500/25 border-0 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Start Your Journey
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative z-20">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">
                  50K+
                </div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  4.9★
                </div>
                <div className="text-gray-400">User Rating</div>
              </div>
            </div>

            {/* Fine print */}
            <div className="mt-12 text-sm text-gray-500 relative z-20">
              <p>✨ No credit card required • 🚀 Setup in 60 seconds • 🔒 Your data stays private</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

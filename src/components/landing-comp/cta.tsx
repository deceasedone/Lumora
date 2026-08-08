"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface CTAProps {
  onGetStarted: () => void
}

export const CTA = React.memo(function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="relative overflow-hidden bg-[#F8F6F2]">
      <div className="relative min-h-[800px] w-full flex flex-col items-center justify-center py-32">
        <div className="absolute inset-0 w-full h-full bg-[#F8F6F2] z-0">
          {/* Soft ambient radial accents */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(122,184,168,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,197,212,0.15),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(143,188,143,0.12),transparent_55%)]" />
        </div>

        <div className="max-w-5xl mx-auto text-center z-30">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-[#7AB8A8] rounded-3xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <h2 className={cn("text-5xl md:text-8xl font-bold mb-8 text-[#2C3338] relative z-20 leading-tight")}>
            Ready to Enter
            <br />
            <span className="text-[#7AB8A8]">
              LUMORA?
            </span>
          </h2>

          <p className="text-2xl text-[#2C3338]/70 mb-12 max-w-3xl mx-auto leading-relaxed relative z-20">
            Join the digital sanctuary where productivity meets artistry. Transform your workflow into a masterpiece.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 relative z-20">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-[#8FBC8F] text-white hover:bg-[#7AB8A8] px-12 py-6 text-xl font-bold shadow-lg border-0 group"
            >
              <Zap className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              Start Your Journey
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          <div className="mt-4 text-sm text-[#2C3338]/60 relative z-20">
            <p>✨ No credit card required • 🚀 Setup in 60 seconds • 🔒 Your data stays private</p>
          </div>
        </div>
      </div>
    </section>
  )
})
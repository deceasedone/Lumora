"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "@/components/landing-comp/3d-hero-section-boxes"
import { Features } from "@/components/landing-comp/features"
import { HowItWorks } from "@/components/landing-comp/how-it-works"
import { Testimonials } from "@/components/landing-comp/testimonials"
import { CTA } from "@/components/landing-comp/cta"
import { Footer } from "@/components/landing-comp/footer"
import { AuthModalSimple } from "@/components/auth-comp/auth-modal-simple"
import { BrowserWarningPopup } from "@/components/landing-comp/browser-warning-popup"

export default function LandingPage() {
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Show warning popup on initial load
    setShowWarning(true)
    
    // Hide after 3 seconds
    const timer = setTimeout(() => {
      setShowWarning(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <HeroSection onGetStarted={() => setAuthModal("signup")} onAuthClick={setAuthModal} />
      {showWarning && <BrowserWarningPopup onClose={() => setShowWarning(false)} />}
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA onGetStarted={() => setAuthModal("signup")} />
      <Footer />

      {authModal && (
        <AuthModalSimple
          type={authModal}
          onClose={() => setAuthModal(null)}
          onSwitchType={(type) => setAuthModal(type)}
        />
      )}
    </div>
  )
}

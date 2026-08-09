"use client"
import React from "react"
import { useEffect, useRef, useState, Suspense } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, Sparkles } from "lucide-react"
import { LumoraLogo } from "../lumora"

// Load Spline on client only and code-split it out of the initial bundle
const SplineComponent = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  // Rendering placeholder handled inside HeroSplineBackground for full-height loader
})

// --- Lazy-loaded HeroSplineBackground ---
// The Spline component is heavy. We create a separate component for it
// and then lazy-load it to prevent it from blocking the initial page render.

const HeroSplineBackground = React.memo(function HeroSplineBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  const rootContainerStyle = React.useMemo(
    () => ({
      position: "relative" as const,
      width: "100%",
      height: "100vh",
      pointerEvents: "auto" as const,
      overflow: "hidden" as const,
      contain: "layout paint size" as const,
      willChange: "transform" as const,
      display: "flex" as const,
      background: `linear-gradient(90deg, #F8F6F2 0%, #F8F6F2 45%, #7AB8A8 60%, #50C29B 100%)`,
    }),
    [],
  )

  const halfContainerStyle = React.useMemo(
    () => ({
      width: "50%",
      height: "100vh",
      pointerEvents: "auto" as const,
      overflow: "hidden" as const,
      position: "relative" as const,
    }),
    [],
  )

  // Defer loading until hero is in view and browser is idle
  useEffect(() => {
    let observer: IntersectionObserver | null = null

    const loadWhenIdle = () => {
      const ric = (window as Window & { requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number }).requestIdleCallback;
      if (typeof ric === "function") {
        ric(() => setShouldLoad(true), { timeout: 1500 })
      } else {
        setTimeout(() => setShouldLoad(true), 200)
      }
    }

    if (containerRef.current && !shouldLoad) {
      observer = new IntersectionObserver((entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          loadWhenIdle()
          observer?.disconnect()
        }
      }, { rootMargin: "200px" })

      observer.observe(containerRef.current)
    }

    return () => observer?.disconnect()
  }, [shouldLoad])

  // DOM cleanup function to remove Spline watermarks upon load
  const removeSplineLogo = () => {
    document.querySelectorAll('a[href*="spline.design"]').forEach(el => el.remove());
    document.querySelectorAll('*').forEach(el => {
      if (el.shadowRoot) {
        el.shadowRoot.querySelectorAll('a[href*="spline.design"]').forEach(logo => logo.remove());
      }
    });
  };

  return (
    <div ref={containerRef} style={rootContainerStyle}>
      {shouldLoad ? (
        <>
          {/* LEFT SIDE: Cream Background with Green Boxes */}
          <div style={halfContainerStyle}>
            <div style={{ width: '100%', height: '100%', background: '#7AB8A8', mixBlendMode: 'multiply' }}>
              <div style={{ width: '100%', height: '100%', mixBlendMode: 'screen' }}>
                <SplineComponent 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    transform: 'translateZ(0)', 
                    transformOrigin: 'center center',
                    filter: 'grayscale(1) invert(1) contrast(1.5)' 
                  }} 
                  scene="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode" 
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Green Background with Light Boxes */}
          <div style={halfContainerStyle}>
            <div style={{ width: '100%', height: '100%', mixBlendMode: 'screen' }}>
              <SplineComponent 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  transform: 'translateZ(0)', 
                  transformOrigin: 'center center',
                  filter: 'grayscale(1) brightness(1.5)' 
                }} 
                scene="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode" 
              />
            </div>
          </div>
        </>
      ) : (
        <HeroSplineLoader />
      )}
    </div>
  )
})

// A simple loader to show while the 3D scene is loading.
function HeroSplineLoader() {
  return (
    <div style={{ 
      width: "100%", 
      height: "100vh", 
      display: "flex", 
      background: `linear-gradient(90deg, #F8F6F2 0%, #F8F6F2 45%, #7AB8A8 60%, #50C29B 100%)` 
    }} />
  )
}


// --- Memoized Sub-components ---
// These components are wrapped in React.memo to prevent re-rendering
// unless their props change.

const ScreenshotSection = React.memo(function ScreenshotSection({ screenshotRef }: { screenshotRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <section className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 mt-11 md:mt-12">
      <div
        ref={screenshotRef}
        className="bg-[#2C3338]/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-[#A8C5D4]/30 w-full md:w-[80%] lg:w-[70%] mx-auto"
      >
        <div>
          <Image
            src="/dashboardpic.png"
            alt="Lumora Dashboard Preview"
            width={1200}
            height={800}
            className="w-full h-auto block rounded-lg mx-auto"
            priority={false} 
          />
        </div>
      </div>
    </section>
  )
})

const HeroContent = React.memo(function HeroContent({ onGetStarted }: { onGetStarted: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="text-white px-4 max-w-screen-xl mx-auto w-full flex flex-col lg:flex-row justify-between items-start lg:items-center py-24 md:py-32">
      <div className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-10 lg:mb-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-wide text-[#2C3338]">
          Your Digital
          <br />
          <span className="text-[#7AB8A8]">
            Sanctuary
          </span>
        </h1>
        <div className="text-sm text-[#2C3338]/60 opacity-90 mt-4 font-mono">Focus • Flow • Clarity • Lumora</div>
      </div>
      <div className="w-full lg:w-1/2 pl-0 lg:pl-8 flex flex-col items-start">
        <p className="text-base sm:text-lg opacity-80 mb-6 max-w-md text-[#2C3338]/70 font-bold">
          Transform your productivity with an immersive workspace that adapts to your mood. Where focus meets artistry.
        </p>        <div className="flex pointer-events-auto flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
          <button
            onClick={onGetStarted}
            className="bg-[#8FBC8F] hover:bg-[#7AB8A8] text-white font-semibold py-2.5 sm:py-3.5 px-6 sm:px-8 rounded-2xl transition duration-300 hover:scale-105 flex items-center justify-center w-full sm:w-auto shadow-lg"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-white" />
            This is LUMORA
          </button>
        </div>
        <div className="relative max-w-sm w-full">
          <div className="relative bg-[#2C3338]/70 backdrop-blur-xl rounded-2xl p-6 border border-[#A8C5D4]/30 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#7AB8A8] rounded-xl flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Lofi Sanctuary</div>
                  <div className="text-[#A8C5D4] text-xs">Ambient Focus Mix</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-[#A8C5D4] hover:bg-white/10 hover:text-white w-10 h-10 rounded-xl"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#8FBC8F] h-1.5 rounded-full w-1/3"></div>
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
})

const Navbar = React.memo(function Navbar({ onAuthClick }: { onAuthClick: (type: "login" | "signup") => void }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-20"
      style={{
        backgroundColor: "rgba(44, 51, 56, 0.35)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderRadius: "0 0 0.75rem 0.75rem",
      }}
    >
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-13 h-13 bg-[#7AB8A8] rounded-2xl flex items-center justify-center shadow-lg">
                <LumoraLogo size={60} coreColor="#F8F6F2" orbitColor="#F8F6F2" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-white">LUMORA</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-white hover:text-[#A8C5D4] text-sm transition duration-150">Features</a>
            <a href="#how-it-works" className="text-white hover:text-[#A8C5D4] text-sm transition duration-150">How It Works</a>
            <a href="#testimonials" className="text-white hover:text-[#A8C5D4] text-sm transition duration-150">Reviews</a>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => onAuthClick("login")} className="text-gray-300 hover:text-[#A8C5D4] px-4 py-2 text-sm transition duration-300">Login</button>
          <button onClick={() => onAuthClick("signup")} className="border border-[#8FBC8F]/60 text-white hover:bg-[#8FBC8F]/20 px-5 py-2 rounded-full text-sm transition duration-300">Get Started</button>
        </div>
      </div>
    </nav>
  )
})


// --- Main HeroSection Component ---
const HeroSection = ({
  onGetStarted,
  onAuthClick,
}: { onGetStarted: () => void; onAuthClick: (type: "login" | "signup") => void }) => {
  const screenshotRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)

  // Optimized scroll handler with throttling for better Chrome performance
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (screenshotRef.current && heroContentRef.current) {
            const scrollPosition = window.pageYOffset
            if (screenshotRef.current) {
              screenshotRef.current.style.transform = `translateY(-${scrollPosition * 0.5}px)`
            }
            const maxScroll = 400
            const opacity = 1 - Math.min(scrollPosition / maxScroll, 1)
            if (heroContentRef.current) {
              heroContentRef.current.style.opacity = opacity.toString()
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    // Chrome-specific optimization
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    const scrollOptions = isChrome ? 
      { passive: true, capture: false } : 
      { passive: true }

    window.addEventListener("scroll", handleScroll, scrollOptions)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative">
      <Navbar onAuthClick={onAuthClick} />
      <div className="relative min-h-[110vh]">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Suspense fallback={<HeroSplineLoader />}>
            <HeroSplineBackground />
          </Suspense>
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
      <div className="bg-[#F8F6F2] relative z-10" style={{ marginTop: "8vh" }}>
        <ScreenshotSection screenshotRef={screenshotRef} />
      </div>
    </div>
  )
}

// Memoize the main HeroSection to reduce re-renders from parent updates
const MemoHeroSection = React.memo(HeroSection)

export { MemoHeroSection as HeroSection }
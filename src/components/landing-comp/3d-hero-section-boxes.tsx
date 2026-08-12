"use client"
import React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, Sparkles } from "lucide-react"
import { LumoraLogo } from "../lumora"

const IsometricHoverField = React.memo(function IsometricHoverField() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const svg = svgRef.current
    if (!container || !svg) return

    const NS = "http://www.w3.org/2000/svg"
    const W = 34
    const H = 17
    const D = 20
    const RADIUS = 3.8
    const PLATEAU = RADIUS * 0.4
    const MAX_LIFT = 75
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const REST = {
      top: [143, 192, 165],
      left: [131, 186, 158],
      right: [126, 178, 152],
      stroke: [185, 213, 194],
    }

    const HOVER = {
      top: [192, 218, 208],
      left: [122, 184, 168],
      right: [98, 141, 132],
      stroke: [248, 246, 242],
    }

    type FieldCell = {
      g: SVGGElement
      top: SVGPolygonElement
      left: SVGPolygonElement
      right: SVGPolygonElement
    }

    const cells = new Map<string, FieldCell>()
    let touched = new Set<string>()
    let originX = 0
    let originY = 0
    let pendingPointerEvent: PointerEvent | null = null
    let rafId: number | null = null
    let resizeTimer: number | null = null

    const clear = () => {
      while (svg.firstChild) svg.removeChild(svg.firstChild)
      cells.clear()
      touched.clear()
    }

    const screenPos = (col: number, row: number) => ({
      x: originX + (col - row) * W,
      y: originY + (col + row) * H,
    })

    const rgbStr = (color: number[]) => `rgb(${color[0]},${color[1]},${color[2]})`

    const lerp = (a: number[], b: number[], t: number) => [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ]

    const polygon = (points: [number, number][], faceKey: "top" | "left" | "right") => {
      const element = document.createElementNS(NS, "polygon") as SVGPolygonElement
      element.setAttribute("points", points.map((pt) => `${pt[0]},${pt[1]}`).join(" "))
      element.setAttribute("fill", rgbStr(REST[faceKey]))
      element.setAttribute("stroke", rgbStr(REST.stroke))
      element.setAttribute("stroke-width", "1")
      element.dataset.face = faceKey
      element.style.transition = reduceMotion ? "none" : "fill 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
      return element
    }

    const buildCube = (col: number, row: number, layer: SVGGElement) => {
      const pos = screenPos(col, row)
      const x = pos.x
      const y = pos.y
      const group = document.createElementNS(NS, "g") as SVGGElement
      group.style.transition = reduceMotion ? "none" : "transform 1s cubic-bezier(0.16, 1, 0.3, 1)"

      const top = polygon([[x, y - H], [x + W, y], [x, y + H], [x - W, y]], "top")
      const left = polygon([[x - W, y], [x, y + H], [x, y + H + D], [x - W, y + D]], "left")
      const right = polygon([[x, y + H], [x + W, y], [x + W, y + D], [x, y + H + D]], "right")

      group.appendChild(top)
      group.appendChild(left)
      group.appendChild(right)
      layer.appendChild(group)

      cells.set(`${col},${row}`, { g: group, top, left, right })
    }

    const buildGrid = () => {
      clear()
      const vw = container.clientWidth || window.innerWidth
      const vh = container.clientHeight || window.innerHeight
      svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`)
      svg.setAttribute("width", `${vw}`)
      svg.setAttribute("height", `${vh}`)

      const defs = document.createElementNS(NS, "defs")
      const grad = document.createElementNS(NS, "linearGradient")
      grad.setAttribute("id", "bgGrad")
      grad.setAttribute("x1", "0%")
      grad.setAttribute("y1", "0%")
      grad.setAttribute("x2", "100%")
      grad.setAttribute("y2", "100%")
      const s1 = document.createElementNS(NS, "stop")
      s1.setAttribute("offset", "0%")
      s1.setAttribute("stop-color", "#8FBC8F")
      const s2 = document.createElementNS(NS, "stop")
      s2.setAttribute("offset", "100%")
      s2.setAttribute("stop-color", "#7AB8A8")
      grad.appendChild(s1)
      grad.appendChild(s2)
      defs.appendChild(grad)
      svg.appendChild(defs)

      const rect = document.createElementNS(NS, "rect")
      rect.setAttribute("width", `${vw}`)
      rect.setAttribute("height", `${vh}`)
      rect.setAttribute("fill", "url(#bgGrad)")
      svg.appendChild(rect)

      originX = vw / 2
      originY = -40

      const layer = document.createElementNS(NS, "g") as SVGGElement
      svg.appendChild(layer)

      const N = Math.min(Math.ceil(vw / (2 * W) + vh / (2 * H)) + 6, 90)
      for (let col = -N; col <= N; col++) {
        for (let row = -N; row <= N; row++) {
          const pos = screenPos(col, row)
          if (pos.x > -W * 2 && pos.x < vw + W * 2 && pos.y > -H * 4 && pos.y < vh + D * 2) {
            buildCube(col, row, layer)
          }
        }
      }
    }

    const smoothstep = (t: number) => t * t * (3 - 2 * t)
    const groupT = (dist: number) => {
      if (dist <= PLATEAU) return 1
      if (dist >= RADIUS) return 0
      return smoothstep(1 - (dist - PLATEAU) / (RADIUS - PLATEAU))
    }

    const applyReveal = (key: string, t: number) => {
      const cell = cells.get(key)
      if (!cell) return
      cell.g.setAttribute("transform", `translate(0,${-MAX_LIFT * t})`)
      cell.top.setAttribute("fill", rgbStr(lerp(REST.top, HOVER.top, t)))
      cell.left.setAttribute("fill", rgbStr(lerp(REST.left, HOVER.left, t)))
      cell.right.setAttribute("fill", rgbStr(lerp(REST.right, HOVER.right, t)))
      const strokeColor = rgbStr(lerp(REST.stroke, HOVER.stroke, t))
      cell.top.setAttribute("stroke", strokeColor)
      cell.left.setAttribute("stroke", strokeColor)
      cell.right.setAttribute("stroke", strokeColor)
      const sw = 1 + t * 0.8
      cell.top.setAttribute("stroke-width", sw.toFixed(2))
      cell.left.setAttribute("stroke-width", sw.toFixed(2))
      cell.right.setAttribute("stroke-width", sw.toFixed(2))
    }

    const resetCell = (key: string) => applyReveal(key, 0)

    const processPointerMove = () => {
      if (!pendingPointerEvent) return
      const evt = pendingPointerEvent
      pendingPointerEvent = null
      rafId = null

      const rect = svg.getBoundingClientRect()
      const mx = evt.clientX - rect.left
      const my = evt.clientY - rect.top
      const A = (mx - originX) / W
      const B = (my - originY) / H
      const col = Math.round((A + B) / 2)
      const row = Math.round((B - A) / 2)

      const bound = Math.ceil(RADIUS)
      const next = new Set<string>()

      for (let dc = -bound; dc <= bound; dc++) {
        for (let dr = -bound; dr <= bound; dr++) {
          const dist = Math.sqrt(dc * dc + dr * dr)
          if (dist > RADIUS) continue
          const key = `${col + dc},${row + dr}`
          if (cells.has(key)) {
            next.add(key)
            applyReveal(key, groupT(dist))
          }
        }
      }

      touched.forEach((key) => {
        if (!next.has(key)) resetCell(key)
      })
      touched = next
    }

    const handleMove = (evt: PointerEvent) => {
      pendingPointerEvent = evt
      if (rafId === null) {
        rafId = window.requestAnimationFrame(processPointerMove)
      }
    }

    const handleLeave = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
        rafId = null
        pendingPointerEvent = null
      }
      touched.forEach(resetCell)
      touched.clear()
    }

    const onResize = () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(buildGrid, 150)
    }

    svg.addEventListener("pointermove", handleMove)
    svg.addEventListener("pointerleave", handleLeave)
    window.addEventListener("resize", onResize)

    buildGrid()

    return () => {
      svg.removeEventListener("pointermove", handleMove)
      svg.removeEventListener("pointerleave", handleLeave)
      window.removeEventListener("resize", onResize)
      if (resizeTimer !== null) window.clearTimeout(resizeTimer)
      clear()
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-auto" aria-hidden="true">
      <svg ref={svgRef} className="block w-full h-full" />
      <div className="pointer-events-none absolute left-1/2 bottom-8 -translate-x-1/2 text-[13px] tracking-[0.02em] text-white/75">
        Move your cursor slowly across the cubes
      </div>
    </div>
  )
})


// --- Memoized Sub-components ---
// These components are wrapped in React.memo to prevent re-rendering
// unless their props change.

const ScreenshotSection = React.memo(function ScreenshotSection({ screenshotRef }: { screenshotRef: React.RefObject<HTMLDivElement> }) {
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
          <span className="text-[#7AB8A8]" style={{ WebkitTextStroke: "1px white" } as React.CSSProperties}>
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
  const screenshotRef = useRef<HTMLDivElement>(null!)
  const heroContentRef = useRef<HTMLDivElement>(null!)

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
        <IsometricHoverField />
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
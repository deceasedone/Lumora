"use client"

import { TestimonialsSection } from "@/components/landing-comp/testimonials-with-marquee"

export function Testimonials() {
  const testimonials = [
    {
      author: {
        name: "Alex Chen",
        handle: "@alexdev",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      text: "ZEN MATRIX completely revolutionized my coding sessions. The Matrix theme makes me feel like Neo while the focus tools keep me in the zone for hours. My productivity has increased by 300%.",
      href: "https://twitter.com/alexdev",
    },
    {
      author: {
        name: "Maya Patel",
        handle: "@mayaux",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      text: "The aesthetic customization is incredible! I switch between Zen mode for creative work and Matrix mode for technical tasks. The ambient soundscapes are perfectly curated.",
      href: "https://twitter.com/mayaux",
    },
    {
      author: {
        name: "Jordan Kim",
        handle: "@jordanphd",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      text: "Study rooms changed everything for my research group. We sync our Pomodoro sessions and stay accountable. The AI journaling helps me process complex concepts.",
    },
    {
      author: {
        name: "Sarah Rodriguez",
        handle: "@sarahfounder",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      text: "This isn't just a productivity app - it's a complete mindset shift. The flow states feature helps me tackle complex problems with unprecedented clarity and focus.",
    },
    {
      author: {
        name: "David Thompson",
        handle: "@davidnomad",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      text: "Working from cafes worldwide, ZEN MATRIX gives me a consistent, beautiful workspace anywhere. The sonic landscapes mask distractions perfectly.",
    },
    {
      author: {
        name: "Lisa Wang",
        handle: "@lisaai",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      text: "The AI companion learns my patterns and suggests optimal work schedules. It's like having a personal productivity coach that actually understands my workflow.",
    },
  ]

  return (
    <TestimonialsSection
      title="Loved by Creators Worldwide"
      description="Join thousands of professionals who've transformed their productivity and found their flow with ZEN MATRIX."
      testimonials={testimonials}
    />
  )
}

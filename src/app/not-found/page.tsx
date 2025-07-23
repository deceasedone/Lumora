import "@/styles/themes.css"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] via-[var(--card)] to-[var(--background)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-24 h-24 bg-[var(--primary)]/15 rounded-full blur-lg animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 left-4 w-16 h-16 bg-[var(--accent)]/5 rounded-full blur-md animate-pulse delay-700"></div>
      
      <div className="relative z-10 text-center max-w-4xl">
        {/* Main illustration area */}
        <div className="mb-12 relative">
          {/* Zen garden inspired design */}
          <div className="mx-auto w-80 h-40 relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--muted)] to-[var(--muted-foreground)]/20 rounded-full opacity-20"></div>
            <div className="absolute top-8 left-12 w-4 h-4 bg-[var(--accent)] rounded-full animate-pulse"></div>
            <div className="absolute top-16 right-20 w-6 h-6 bg-[var(--primary)]/60 rounded-full"></div>
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[var(--accent)]/40 rounded-full animate-bounce delay-500"></div>
            
            {/* Ripple effect */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-20 border-2 border-[var(--accent)]/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-20 h-20 border border-[var(--primary)]/20 rounded-full animate-ping delay-300"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-light text-[var(--foreground)] mb-6 tracking-wide">
            Lost in the
            <span className="block text-[var(--accent)] font-medium">Digital Flow</span>
          </h1>
        </div>

        {/* Content section */}
        <div className="mb-16 space-y-6">
          <p className="text-xl md:text-2xl text-[var(--muted-foreground)] font-light leading-relaxed">
            Sometimes the most productive thing you can do is pause, breathe, and find your way back.
          </p>
          
          <div className="bg-[var(--card)]/50 backdrop-blur-sm border border-[var(--border)]/30 rounded-2xl p-8 mx-auto max-w-2xl">
            <h2 className="text-lg font-medium text-[var(--card-foreground)] mb-4">
              Let's restore your focus together
            </h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              This page may not exist, but your journey to mindful productivity continues. 
              Choose your next step with intention.
            </p>
          </div>
        </div>

        {/* Action grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link href="/dashboard" className="group">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent)]/10 hover:-translate-y-1">
              <div className="text-3xl mb-3">🧘‍♀️</div>
              <h3 className="font-semibold text-[var(--card-foreground)] mb-2">Mindful Sessions</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Center yourself with guided focus sessions</p>
            </div>
          </Link>
          
          <Link href="/dashboard" className="group">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/10 hover:-translate-y-1">
              <div className="text-3xl mb-3">🌊</div>
              <h3 className="font-semibold text-[var(--card-foreground)] mb-2">Ambient Sanctuary</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Immerse in calming soundscapes</p>
            </div>
          </Link>
          
          <Link href="/dashboard" className="group">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent)]/10 hover:-translate-y-1">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold text-[var(--card-foreground)] mb-2">Sacred Workspace</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Create your perfect digital environment</p>
            </div>
          </Link>
        </div>

        {/* Breathing exercise */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-full px-6 py-3">
            <div className="w-3 h-3 bg-[var(--primary)] rounded-full animate-pulse"></div>
            <span className="text-sm text-[var(--primary)] font-medium">Take a moment to breathe deeply</span>
          </div>
        </div>

        {/* Wisdom quote */}
        <div className="border-t border-[var(--border)]/30 pt-8">
          <blockquote className="text-[var(--muted-foreground)] italic text-lg mb-3 font-light">
            "In the midst of movement and chaos, keep stillness inside of you."
          </blockquote>
          <cite className="text-sm text-[var(--muted-foreground)]/70">— Deepak Chopra</cite>
        </div>
      </div>
    </div>
  )
}
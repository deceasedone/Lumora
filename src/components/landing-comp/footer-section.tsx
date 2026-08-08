"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Github, Twitter, DiscIcon as Discord, Mail, Send, Heart } from "lucide-react"
import { LumoraLogo } from "../lumora"
interface FooterdemoProps {
  onSubscribe?: (email: string) => void
}

function Footerdemo({ onSubscribe }: FooterdemoProps) {
  const [isDarkMode] = React.useState(true)
  const [email, setEmail] = React.useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onSubscribe?.(email.trim())
    }
  }

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <footer className="relative border-t border-[#A8C5D4]/30 bg-[#F8F6F2] text-[#2C3338] transition-colors duration-300">

      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            {/* Brand */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-13 h-13 bg-[#7AB8A8] rounded-2xl flex items-center justify-center shadow-lg">
                  <LumoraLogo size={60} coreColor="#F8F6F2" orbitColor="#F8F6F2" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#7AB8A8]">
                  LUMORA
                </span>
                <div className="text-sm text-[#2C3338]/60 -mt-1">Digital Sanctuary</div>
              </div>
            </div>

            <p className="mb-6 text-[#2C3338]/70 leading-relaxed max-w-md">
              Transform your productivity with an immersive digital workspace that adapts to your flow. Where focus
              meets artistry.
            </p>

            <form className="relative" onSubmit={handleSubscribe}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm bg-white border-[#A8C5D4]/40 text-[#2C3338] focus:border-[#7AB8A8] focus:ring-[#7AB8A8]/20"
                required
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-[#8FBC8F] text-white transition-transform hover:scale-105 hover:bg-[#7AB8A8] shadow-md"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#2C3338]">Product</h3>
            <nav className="space-y-2 text-sm">
              <a href="#features" className="block transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
                Features
              </a>
              <a href="#how-it-works" className="block transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
                How It Works
              </a>
              <a href="#" className="block transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
                Pricing
              </a>
              <a href="#" className="block transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
                Roadmap
              </a>
              <a href="#" className="block transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
                API
              </a>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-[#2C3338]">Resources</h3>
            <nav className="space-y-2 text-sm">
              <a href="#" className="block transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
                Documentation
              </a>
              <a href="#" className="block transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
                Tutorials
              </a>
              <a href="#" className="block transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
                Community
              </a>
              <a href="#" className="block transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
                Blog
              </a>
              <a href="#" className="block transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
                Support
              </a>
            </nav>
          </div>

          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold text-[#2C3338]">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-[#A8C5D4]/40 text-[#7AB8A8] hover:bg-[#E8F0EC] hover:text-[#2C3338] bg-transparent"
                    >
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on GitHub</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-[#A8C5D4]/40 text-[#7AB8A8] hover:bg-[#E8F0EC] hover:text-[#2C3338] bg-transparent"
                    >
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-[#A8C5D4]/40 text-[#7AB8A8] hover:bg-[#E8F0EC] hover:text-[#2C3338] bg-transparent"
                    >
                      <Discord className="h-4 w-4" />
                      <span className="sr-only">Discord</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Join our Discord</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-[#A8C5D4]/40 text-[#7AB8A8] hover:bg-[#E8F0EC] hover:text-[#2C3338] bg-transparent"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Contact us via Email</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#A8C5D4]/30 pt-8 text-center md:flex-row">
          <div className="flex items-center text-[#2C3338]/60 text-sm">
            <span>© 2025 LUMORA. Made with</span>
            <Heart className="w-4 h-4 mx-1 text-[#8FBC8F] fill-current" />
            <span>for creators worldwide.</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-[#7AB8A8] text-[#2C3338]/60">
              Cookie Policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }

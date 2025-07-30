"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Github, Twitter, DiscIcon as Discord, Mail, Send, Heart } from "lucide-react"
import { LumoraLogo } from "../lumora"
function Footerdemo() {
  const [isDarkMode] = React.useState(true)

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <footer className="relative border-t border-purple-500/20 bg-black text-white transition-colors duration-300">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/10 to-transparent" />

      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            {/* Brand */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-13 h-13 bg-gradient-to-br from-purple-400 via-violet-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <LumoraLogo size={60} coreColor="rgb(34 211 238)" orbitColor="rgb(34 211 238)" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-violet-500 to-blue-500 rounded-2xl blur-md opacity-50 -z-10"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">
                  LUMORA
                </span>
                <div className="text-sm text-purple-300/60 -mt-1">Digital Sanctuary</div>
              </div>
            </div>

            <p className="mb-6 text-gray-400 leading-relaxed max-w-md">
              Transform your productivity with an immersive digital workspace that adapts to your flow. Where focus
              meets artistry.
            </p>

            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm bg-black/50 border-purple-500/30 text-white focus:border-purple-500 focus:ring-purple-500/20"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white transition-transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Product</h3>
            <nav className="space-y-2 text-sm">
              <a href="#features" className="block transition-colors hover:text-purple-400 text-gray-400">
                Features
              </a>
              <a href="#how-it-works" className="block transition-colors hover:text-purple-400 text-gray-400">
                How It Works
              </a>
              <a href="#" className="block transition-colors hover:text-purple-400 text-gray-400">
                Pricing
              </a>
              <a href="#" className="block transition-colors hover:text-purple-400 text-gray-400">
                Roadmap
              </a>
              <a href="#" className="block transition-colors hover:text-purple-400 text-gray-400">
                API
              </a>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Resources</h3>
            <nav className="space-y-2 text-sm">
              <a href="#" className="block transition-colors hover:text-purple-400 text-gray-400">
                Documentation
              </a>
              <a href="#" className="block transition-colors hover:text-purple-400 text-gray-400">
                Tutorials
              </a>
              <a href="#" className="block transition-colors hover:text-purple-400 text-gray-400">
                Community
              </a>
              <a href="#" className="block transition-colors hover:text-purple-400 text-gray-400">
                Blog
              </a>
              <a href="#" className="block transition-colors hover:text-purple-400 text-gray-400">
                Support
              </a>
            </nav>
          </div>

          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold text-white">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-white bg-transparent"
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
                      className="rounded-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-white bg-transparent"
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
                      className="rounded-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-white bg-transparent"
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
                      className="rounded-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-white bg-transparent"
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-purple-500/20 pt-8 text-center md:flex-row">
          <div className="flex items-center text-gray-400 text-sm">
            <span>© 2025 LUMORA. Made with</span>
            <Heart className="w-4 h-4 mx-1 text-purple-400 fill-current" />
            <span>for creators worldwide.</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-purple-400 text-gray-400">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-purple-400 text-gray-400">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-purple-400 text-gray-400">
              Cookie Policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }

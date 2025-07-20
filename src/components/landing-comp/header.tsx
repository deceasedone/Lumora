"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface HeaderProps {
  onAuthClick: (type: "login" | "signup") => void
}

export function Header({ onAuthClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 via-violet-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-violet-500 to-blue-500 rounded-xl blur-md opacity-50 -z-10"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">
                ZEN MATRIX
              </span>
              <div className="text-xs text-purple-300/60 -mt-1">Digital Sanctuary</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-purple-400 transition-all duration-300 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 hover:text-purple-400 transition-all duration-300 relative group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#testimonials"
              className="text-gray-300 hover:text-purple-400 transition-all duration-300 relative group"
            >
              Reviews
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <Button
              variant="ghost"
              onClick={() => onAuthClick("login")}
              className="text-gray-300 hover:text-purple-400 hover:bg-purple-500/10"
            >
              Login
            </Button>
            <Button
              onClick={() => onAuthClick("signup")}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25 border-0"
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-purple-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-purple-500/20 pt-4">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-purple-400 transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-purple-400 transition-colors">
                Reviews
              </a>
              <Button
                variant="ghost"
                onClick={() => onAuthClick("login")}
                className="text-gray-300 hover:text-purple-400 justify-start hover:bg-purple-500/10"
              >
                Login
              </Button>
              <Button
                onClick={() => onAuthClick("signup")}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
              >
                Get Started
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

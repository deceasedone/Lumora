"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Github, Mail, ArrowRight, X, Sparkles, Lock, User, Chrome } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AuthPageProps {
  onClose?: () => void
  initialMode?: "login" | "signup"
}

export function AuthPage({ onClose, initialMode = "login" }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    console.log("Auth submission:", { mode, formData })
  }

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode)
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen bg-black overflow-y-auto">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex w-full h-screen py-8 lg:py-0">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg"
          >
            {/* Logo */}
            <div className="flex items-center mb-12">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">LUMORA</h1>
                <p className="text-purple-300 text-sm">Digital Sanctuary</p>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Productivity
              </span>
            </h2>

            <p className="text-gray-300 text-lg mb-12 leading-relaxed">
              Join thousands of creators who've discovered their perfect digital workspace. Where focus meets artistry.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {["⚡ Setup in under 60 seconds", "🔒 Bank-level security", "👥 Team collaboration tools"].map(
                (feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center text-gray-300"
                  >
                    <span>{feature}</span>
                  </motion.div>
                ),
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 h-full flex flex-col items-start lg:items-center justify-center px-6 lg:px-12 pt-8 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Mode Toggle */}
            <div className="flex mb-8 p-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <button
                onClick={() => switchMode("login")}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-200 ${
                  mode === "login" ? "bg-white text-black shadow-lg" : "text-gray-300 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode("signup")}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-200 ${
                  mode === "signup" ? "bg-white text-black shadow-lg" : "text-gray-300 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Auth Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl max-h-[80vh] lg:max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {mode === "login" ? <Lock className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
                </div>

                <AnimatePresence mode="wait">
                  <motion.h3
                    key={mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                  </motion.h3>
                </AnimatePresence>

                <p className="text-gray-400">
                  {mode === "login" ? "Sign in to your account" : "Join the productivity revolution"}
                </p>
              </div>

              {/* Social Login */}
              <div className="space-y-3 mb-6">
                <button className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-200 group">
                  <Github className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Continue with GitHub
                </button>
                <button className="w-full h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-200 group">
                  <Chrome className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Continue with Google
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black text-gray-400">or</span>
                </div>
              </div>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, x: mode === "signup" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "signup" ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {mode === "signup" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-gray-300 text-sm font-medium">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="mt-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-gray-300 text-sm font-medium">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="mt-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="h-12 pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="h-12 pl-12 pr-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {mode === "signup" && (
                    <div>
                      <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">
                        Confirm Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          className="h-12 pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 group"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === "login" ? "Sign In" : "Create Account"}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.form>
              </AnimatePresence>

              {/* Footer */}
              <div className="mt-6 text-center">
                {mode === "login" ? (
                  <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                    Forgot your password?
                  </button>
                ) : (
                  <p className="text-gray-400 text-sm">
                    By signing up, you agree to our{" "}
                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                      Privacy Policy
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden mt-8 text-center">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ZEN MATRIX</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

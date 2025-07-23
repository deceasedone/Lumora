"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RetroVideoPlayerProps {
  src?: string
  title?: string
}

export function RetroVideoPlayer({
  src = "/placeholder.mp4",
  title = "Retro Video",
}: RetroVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => setIsLoaded(true)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("ended", handleEnded)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) video.pause()
    else video.play()
    
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => console.log("Next video")
  const handlePrevious = () => console.log("Previous video")

  return (
    <div className="relative w-full h-full">
      {/* All Screen TV with Reduced Bezel */}
      <div
        className="relative rounded-lg border-4 border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 p-1 shadow-2xl h-full flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Minimal Screen Bezel */}
        <div className="relative rounded border border-gray-600 bg-black shadow-inner w-full h-full">
          {/* Video Screen */}
          <div className="relative w-full h-full overflow-hidden rounded bg-black">
            {/* CRT Screen Effect Overlay */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,0,0.03)_2px,rgba(0,255,0,0.03)_4px)]" />

            {/* Video Element */}
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline loop>
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Loading State */}
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="font-mono text-sm text-green-400 animate-pulse">LOADING...</div>
              </div>
            )}

            {/* Play Button Overlay - Always visible when paused */}
            {!isPlaying && isLoaded && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className="h-16 w-16 rounded-full bg-green-600 text-black hover:bg-green-500"
                >
                  <Play className="ml-1 h-8 w-8" />
                </Button>
              </div>
            )}

            {/* All Controls on Left Side */}
            <div
              className={`absolute left-2 top-1/2 z-30 -translate-y-1/2 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handlePrevious}
                  size="sm"
                  variant="ghost"
                  className="h-10 w-10 rounded-full border border-green-400/50 bg-black/70 p-0 text-green-400 hover:bg-black/90 hover:text-green-300"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  onClick={togglePlay}
                  size="sm"
                  variant="ghost"
                  className="h-10 w-10 rounded-full border border-green-400/50 bg-black/70 p-0 text-green-400 hover:bg-black/90 hover:text-green-300"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <Button
                  onClick={handleNext}
                  size="sm"
                  variant="ghost"
                  className="h-10 w-10 rounded-full border border-green-400/50 bg-black/70 p-0 text-green-400 hover:bg-black/90 hover:text-green-300"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
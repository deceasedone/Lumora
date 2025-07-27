"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RetroVideoPlayerProps {
  src?: string
  title?: string
}

export function RetroVideoPlayer({
  src = "https://cdn.pixabay.com/video/2024/09/01/229254_large.mp4",
  title = "Retro Video",
}: RetroVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasError, setHasError] = useState(false)
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

    isPlaying ? video.pause() : video.play()
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => console.log("Next video")
  const handlePrevious = () => console.log("Previous video")

  return (
    <div className="relative w-full h-40">
      {/* Retro Frame */}
      <div
        className="relative h-full w-full rounded-md border-2 border-[var(--border)] bg-[var(--video-player-bg)] p-0.5 shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
       {/* Inner Screen */}
        <div className="relative h-full w-full rounded border border-[var(--border)] bg-[var(--card)] shadow-inner">
          <div className="relative w-full h-full overflow-hidden rounded">
                      {/* CRT FX */}
          {/*  
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[var(--accent)]/5 to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,var(--accent)_2px,var(--accent)_4px)] opacity-30" />
*/}

            {/* Video Element */}
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              playsInline
              loop
              onError={() => setHasError(true)}
            >
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Error Screen */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]">
                <div className="font-mono text-xs text-red-500">VIDEO FAILED TO LOAD</div>
              </div>
            )}

            {/* Loading Screen */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]">
                <div className="font-mono text-xs text-[var(--accent)] animate-pulse">LOADING...</div>
              </div>
            )}

            {/* Center Play Button */}
            {!isPlaying && isLoaded && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--background)]/50">
                <Button
                  onClick={togglePlay}
                  size="icon"
                  className="h-12 w-12 rounded-full bg-[var(--accent)] text-[var(--background)] hover:bg-[var(--primary)]"
                >
                  <Play className="ml-1 h-6 w-6" />
                </Button>
              </div>
            )}

            {/* Left-Side Controls (on hover) */}
            <div
              className={`absolute left-2 top-1/2 z-30 -translate-y-1/2 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex flex-col gap-1">
                <Button
                  onClick={handlePrevious}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full border border-[var(--accent)]/50 bg-[var(--background)]/70 text-[var(--accent)] hover:bg-[var(--background)]/90 hover:text-[var(--primary)] p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  onClick={togglePlay}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full border border-[var(--accent)]/50 bg-[var(--background)]/70 text-[var(--accent)] hover:bg-[var(--background)]/90 hover:text-[var(--primary)] p-0"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <Button
                  onClick={handleNext}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full border border-[var(--accent)]/50 bg-[var(--background)]/70 text-[var(--accent)] hover:bg-[var(--background)]/90 hover:text-[var(--primary)] p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
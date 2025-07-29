"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define the structure for a single video object
interface VideoData {
  src: string
}

// Create a default playlist with the provided video URLs
const defaultVideos: VideoData[] = [
  { src: "https://cdn.pixabay.com/video/2024/09/01/229254_large.mp4" },
  { src: "https://cdn.pixabay.com/video/2015/10/18/1085-142801793.mp4" },
  { src: "https://cdn.pixabay.com/video/2022/03/29/112256-693798366_medium.mp4" },
  { src: "https://cdn.pixabay.com/video/2023/11/26/190776-888535446_small.mp4" },
  { src: "https://cdn.pixabay.com/video/2021/04/15/71122-537102350_small.mp4" },
  { src: "https://cdn.pixabay.com/video/2021/05/25/75169-555034894_small.mp4" },
  { src: "https://cdn.pixabay.com/video/2021/06/25/78891-567754579_small.mp4" },
  { src: "https://cdn.pixabay.com/video/2021/03/08/67358-521707474_small.mp4" },
  { src: "https://cdn.pixabay.com/video/2019/02/19/21536-318978190_small.mp4" },
  { src: "https://cdn.pixabay.com/video/2019/10/09/27706-365890968_small.mp4" },
  { src: "https://cdn.pixabay.com/video/2021/06/27/79230-568252470_small.mp4" },
  { src: "https://cdn.pixabay.com/video/2016/09/05/4933-181466740.mp4" },
]

interface RetroVideoPlayerProps {
  videos?: VideoData[]
}

export function RetroVideoPlayer({
  videos = defaultVideos,
}: RetroVideoPlayerProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentVideo = videos[currentVideoIndex]

  // Effect to manage video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setIsLoaded(true)
      setHasError(false)
    }
    const handleEnded = () => setIsPlaying(false)
    const handleError = () => {
      setHasError(true)
      setIsLoaded(true) // Stop showing loading spinner on error
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("error", handleError)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("error", handleError)
    }
  }, [])

  // Effect to load a new video when the index changes
  useEffect(() => {
    const video = videoRef.current
    if (video && currentVideo) {
      setIsPlaying(false)
      setIsLoaded(false)
      setHasError(false)
      video.src = currentVideo.src
      video.load()
    }
  }, [currentVideoIndex, videos, currentVideo])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video || hasError) return

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        // If play() is rejected, ensure state is correct
        setIsPlaying(false)
        setHasError(true)
      })
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const handleNext = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
  }

  const handlePrevious = () => {
    setCurrentVideoIndex(
      (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
    )
  }

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
              // The src is now managed by the useEffect hook
            />

            {/* Error Screen */}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]">
                <div className="text-center font-mono text-xs text-red-500">
                  <p>VIDEO FAILED TO LOAD</p>
                  <p className="mt-1 text-[10px] text-red-500/70">Source may be invalid or offline.</p>
                </div>
              </div>
            )}

            {/* Loading Screen */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]">
                <div className="font-mono text-xs text-[var(--accent)] animate-pulse">
                  LOADING...
                </div>
              </div>
            )}
            
            {/* Video Title Overlay (on hover while playing) */}
            <div
              className={`pointer-events-none absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent p-2 text-white transition-opacity duration-300 ${
                isHovered && isPlaying ? "opacity-100" : "opacity-0"
              }`}
            >
            </div>

            {/* Center Play Button */}
            {!isPlaying && isLoaded && !hasError && (
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
                  disabled={videos.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  onClick={togglePlay}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full border border-[var(--accent)]/50 bg-[var(--background)]/70 text-[var(--accent)] hover:bg-[var(--background)]/90 hover:text-[var(--primary)] p-0"
                  disabled={!isLoaded || hasError}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  onClick={handleNext}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full border border-[var(--accent)]/50 bg-[var(--background)]/70 text-[var(--accent)] hover:bg-[var(--background)]/90 hover:text-[var(--primary)] p-0"
                  disabled={videos.length <= 1}
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
"use client"

import { useState, useEffect, useCallback } from "react"
import YouTube from "react-youtube"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAtom } from "jotai"
import {
  AudioLines,
  BookText,
  Clock,
  Focus,
  SquareCheckBig,
  Video,
  ChevronLeft,
  Shuffle,
  ChevronRight,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ThemeDropdown } from "@/components/theme-toggle"
import { Journal } from "@/components/journal"
import { AudioManager } from "@/components/beats"
import { Todo } from "@/components/todo"
import { Stopwatch } from "@/components/stopwatch"
import { openAmbientDrawerAtom, openJournalAtom } from "@/context/data"
import { ImmersiveLogo } from "@/components/ImmersiveLogo"
import { wallpaperData, allWallpapers, type Wallpaper } from "@/lib/wallpaper-data"

// YouTube Player API types as interfaces
export interface YouTubePlayer {
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  getIframe(): HTMLIFrameElement
  // Add other methods as needed
}

export interface YouTubePlayerOptions {
  height?: string
  width?: string
  videoId?: string
  playerVars?: YouTubePlayerVars
  events?: YouTubePlayerEvents
}

export interface YouTubePlayerVars {
  autoplay?: 0 | 1
  controls?: 0 | 1
  disablekb?: 0 | 1
  enablejsapi?: 0 | 1
  fs?: 0 | 1
  iv_load_policy?: 1 | 3
  loop?: 0 | 1
  modestbranding?: 0 | 1
  playsinline?: 0 | 1
  rel?: 0 | 1
  showinfo?: 0 | 1
  [key: string]: string | number | undefined
}

export interface YouTubePlayerEvents {
  onReady?: (event: { target: YouTubePlayer }) => void
  onStateChange?: (event: { data: number; target: YouTubePlayer }) => void
  onError?: (event: { data: number; target: YouTubePlayer }) => void
}

// For global window.YT type
declare global {
  interface Window {
    YT: {
      Player: new (containerId: string, options: YouTubePlayerOptions) => YouTubePlayer
    }
    onYouTubeIframeAPIReady: () => void
  }
}

// --- Helper Functions ---
const extractYouTubeId = (url: string): string => {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : url;
};

// --- Helper Icon Components ---
const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
  </svg>
)
const PixabayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.417 16.949c-.325.325-1.042.325-1.367 0-.325-.325-.325-1.042 0-1.367l1.367-1.367c.325-.325 1.042-.325 1.367 0 .325.325.325 1.042 0 1.367l-1.367 1.367zm.683-10.282c-.512 0-.927.415-.927.927v5.563c0 .512.415.927.927.927s.927-.415.927-.927v-5.563c0-.512-.415-.927-.927-.927zm3.467 6.833c-.512 0-.927.415-.927.927v2.099c0 .512.415.927.927.927s.927-.415.927-.927v-2.099c0-.512-.415-.927-.927-.927zm0-6.833c-.512 0-.927.415-.927.927v2.099c0 .512.415.927.927.927s.927-.415.927-.927v-2.099c0-.512-.415-.927-.927-.927zm3.467 3.416c-.512 0-.927.415-.927.927v5.563c0 .512.415.927.927.927s.927-.415.927-.927v-5.563c0-.512-.415-.927-.927-.927z"></path>
  </svg>
)

const MySelectionIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)

// --- Clock Component ---
function ClockDisplay() {
  const [time, setTime] = useState("")

  const updateTime = useCallback(() => {
    setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }, [])

  useEffect(() => {
    const interval = setInterval(updateTime, 1000)
    updateTime() // Initial call
    return () => clearInterval(interval)
  }, [updateTime])

  return (
    <div
      style={{
        position: "absolute",
        top: "1.25rem",
        right: "1.25rem",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
        color: "white",
        fontSize: "1.5rem",
        fontWeight: "bold",
        backdropFilter: "blur(4px)",
        zIndex: 10,
      }}
    >
      {time}
    </div>
  )
}

// --- Wallpaper Selection Modal Component ---
function WallpaperSelectionModal({
  isOpen,
  onClose,
  onWallpaperSelect,
}: {
  isOpen: boolean
  onClose: () => void
  onWallpaperSelect: (wallpaper: Wallpaper) => void
}) {
  const [pixabayIndex, setPixabayIndex] = useState(0)
  const [youtubeIndex, setYoutubeIndex] = useState(0)
  const [mySelectionPage, setMySelectionPage] = useState(0)
  const [pixabayPage, setPixabayPage] = useState(0)
  const [youtubePage, setYoutubePage] = useState(0)

  const MY_SELECTIONS_PER_PAGE = 6
  const YOUTUBE_VIDEOS_PER_PAGE = 8
  const PIXABAY_VIDEOS_PER_PAGE = 8

  const mySelectionPages = Math.ceil(wallpaperData.mySelections.length / MY_SELECTIONS_PER_PAGE)
  const youtubePages = Math.ceil(wallpaperData.youtube[youtubeIndex]?.wallpapers.length / YOUTUBE_VIDEOS_PER_PAGE)
  const pixabayPages = Math.ceil(wallpaperData.pixabay[pixabayIndex]?.wallpapers.length / PIXABAY_VIDEOS_PER_PAGE)

  const nextPixabay = () => {
    setPixabayIndex((prev) => (prev + 1) % wallpaperData.pixabay.length)
    setPixabayPage(0) // Reset page index when category changes
  }

  const prevPixabay = () => {
    setPixabayIndex((prev) => (prev - 1 + wallpaperData.pixabay.length) % wallpaperData.pixabay.length)
    setPixabayPage(0) // Reset page index when category changes
  }

  const nextYoutube = () => {
    setYoutubeIndex((prev) => (prev + 1) % wallpaperData.youtube.length)
    setYoutubePage(0) // Reset page index when category changes
  }

  const prevYoutube = () => {
    setYoutubeIndex((prev) => (prev - 1 + wallpaperData.youtube.length) % wallpaperData.youtube.length)
    setYoutubePage(0) // Reset page index when category changes
  }

  // Helper for My Selection pagination
  const prevMySelectionPage = () => {
    setMySelectionPage((prev) => (prev - 1 + mySelectionPages) % mySelectionPages)
  }
  const nextMySelectionPage = () => {
    setMySelectionPage((prev) => (prev + 1) % mySelectionPages)
  }
  const getCurrentMySelections = () => {
    const start = mySelectionPage * MY_SELECTIONS_PER_PAGE
    const end = start + MY_SELECTIONS_PER_PAGE
    return wallpaperData.mySelections.slice(start, end)
  }

  // Pagination for Pixabay
  const prevPixabayPage = () => setPixabayPage((prev) => (prev - 1 + pixabayPages) % pixabayPages)
  const nextPixabayPage = () => setPixabayPage((prev) => (prev + 1) % pixabayPages)
  const getCurrentPixabayWallpapers = () => {
    const wallpapers = wallpaperData.pixabay[pixabayIndex]?.wallpapers || []
    const start = pixabayPage * PIXABAY_VIDEOS_PER_PAGE
    const end = start + PIXABAY_VIDEOS_PER_PAGE
    return wallpapers.slice(start, end)
  }

  // Pagination for YouTube
  const prevYoutubePage = () => setYoutubePage((prev) => (prev - 1 + youtubePages) % youtubePages)
  const nextYoutubePage = () => setYoutubePage((prev) => (prev + 1) % youtubePages)
  const getCurrentYoutubeWallpapers = () => {
    const wallpapers = wallpaperData.youtube[youtubeIndex]?.wallpapers || []
    const start = youtubePage * YOUTUBE_VIDEOS_PER_PAGE
    const end = start + YOUTUBE_VIDEOS_PER_PAGE
    return wallpapers.slice(start, end)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl mx-4 bg-black/60 backdrop-blur-xl rounded-3xl border border-white/30 p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:bg-white/20 rounded-full z-10"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Change Wallpaper</h2>
          <p className="text-white/70 text-lg">Choose from different categories</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pixabay Category */}
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <PixabayIcon />
              <h3 className="text-white font-semibold text-lg">Pixabay</h3>
            </div>
            <p className="text-white/70 text-sm text-center mb-6">Live wallpaper without sound</p>

            {/* Category Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevPixabay}
                className="text-white hover:bg-white/20 rounded-full"
                disabled={wallpaperData.pixabay.length <= 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                  {(() => {
                    const IconComponent = wallpaperData.pixabay[pixabayIndex]?.icon
                    return IconComponent ? <IconComponent className="h-6 w-6 text-white" /> : null
                  })()}
                </div>
                <span className="text-white text-sm font-medium">{wallpaperData.pixabay[pixabayIndex]?.name}</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextPixabay}
                className="text-white hover:bg-white/20 rounded-full"
                disabled={wallpaperData.pixabay.length <= 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Wallpapers Grid */}
            <div className="grid grid-cols-2 gap-2 min-h-[10rem] max-h-48 overflow-y-auto">
              {getCurrentPixabayWallpapers().map((wallpaper, idx) => (
                <Button
                  key={wallpaper.id + '-' + idx}
                  variant="outline"
                  className="text-white border-white/30 bg-black/30 hover:bg-white/20 rounded-lg p-3 h-auto text-xs transition-all duration-200"
                  onClick={() => {
                    onWallpaperSelect(wallpaper)
                    onClose()
                  }}
                  title={wallpaper.name}
                >
                  <span className="truncate">{wallpaper.name}</span>
                </Button>
              ))}
            </div>
            {/* Pagination for Pixabay Wallpapers */}
            <div className="flex items-center justify-center mt-4">
              <Button variant="ghost" size="icon" onClick={prevPixabayPage} disabled={pixabayPages <= 1} className="text-white hover:bg-white/20 rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-white text-sm mx-4">Page {pixabayPage + 1} of {pixabayPages}</span>
              <Button variant="ghost" size="icon" onClick={nextPixabayPage} disabled={pixabayPages <= 1} className="text-white hover:bg-white/20 rounded-full">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* My Selection Category */}
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MySelectionIcon />
              <h3 className="text-white font-semibold text-lg">My Favorites</h3>
            </div>
            <p className="text-white/70 text-sm text-center mb-6">Live wallpaper with sound</p>

            {/* Page Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevMySelectionPage}
                className="text-white hover:bg-white/20 rounded-full"
                disabled={mySelectionPages <= 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                  <MySelectionIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-sm font-medium">
                  Page {mySelectionPage + 1} of {mySelectionPages}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextMySelectionPage}
                className="text-white hover:bg-white/20 rounded-full"
                disabled={mySelectionPages <= 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Wallpapers Grid */}
            <div className="grid grid-cols-2 gap-2 min-h-[10rem] max-h-48 overflow-y-auto">
              {getCurrentMySelections().map((wallpaper, idx) => (
                <Button
                  key={wallpaper.id + '-' + idx}
                  variant="outline"
                  className="text-white border-white/30 bg-black/30 hover:bg-white/20 rounded-lg p-3 h-auto text-xs transition-all duration-200"
                  onClick={() => {
                    onWallpaperSelect(wallpaper)
                    onClose()
                  }}
                  title={wallpaper.name}
                >
                  <span className="truncate">{wallpaper.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* YouTube Category */}
          <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <YouTubeIcon />
              <h3 className="text-white font-semibold text-lg">YouTube</h3>
            </div>
            <p className="text-white/70 text-sm text-center mb-6">Live wallpaper with sound</p>

            {/* Category Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevYoutube}
                className="text-white hover:bg-white/20 rounded-full"
                disabled={wallpaperData.youtube.length <= 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                  {(() => {
                    const IconComponent = wallpaperData.youtube[youtubeIndex]?.icon
                    return IconComponent ? <IconComponent className="h-6 w-6 text-white" /> : null
                  })()}
                </div>
                <span className="text-white text-sm font-medium">{wallpaperData.youtube[youtubeIndex]?.name}</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextYoutube}
                className="text-white hover:bg-white/20 rounded-full"
                disabled={wallpaperData.youtube.length <= 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Wallpapers Grid */}
            <div className="grid grid-cols-2 gap-2 min-h-[10rem] max-h-48 overflow-y-auto">
              {getCurrentYoutubeWallpapers().map((wallpaper, idx) => (
                <Button
                  key={wallpaper.id + '-' + idx}
                  variant="outline"
                  className="text-white border-white/30 bg-black/30 hover:bg-white/20 rounded-lg p-3 h-auto text-xs transition-all duration-200"
                  onClick={() => {
                    onWallpaperSelect(wallpaper)
                    onClose()
                  }}
                  title={wallpaper.name}
                >
                  <span className="truncate">{wallpaper.name}</span>
                </Button>
              ))}
            </div>
            {/* Pagination for YouTube Wallpapers */}
            <div className="flex items-center justify-center mt-4">
              <Button variant="ghost" size="icon" onClick={prevYoutubePage} disabled={youtubePages <= 1} className="text-white hover:bg-white/20 rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-white text-sm mx-4">Page {youtubePage + 1} of {youtubePages}</span>
              <Button variant="ghost" size="icon" onClick={nextYoutubePage} disabled={youtubePages <= 1} className="text-white hover:bg-white/20 rounded-full">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Main Page Component ---
export default function ImmersivePage() {
  const router = useRouter()
  // --- State Management ---
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper | undefined>(
    wallpaperData.mySelections.length > 0 ? wallpaperData.mySelections[0] : undefined
  )
  const [isToolbarOpen, setIsToolbarOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isJournalOpen, setJournalOpen] = useAtom(openJournalAtom)
  const [isAmbientDrawerOpen, setAmbientDrawerOpen] = useAtom(openAmbientDrawerAtom)
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false)
  const [youTubePlayer, setYouTubePlayer] = useState<YouTubePlayer | null>(null)
  const [isApiReady, setIsApiReady] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("authToken")) {
      router.push("/auth")
    }
  }, [router])

  useEffect(() => {
    setIsClient(true)
    // Load YouTube API
    if (window.YT && window.YT.Player) {
      setIsApiReady(true)
    } else {
      const scriptTag = document.createElement("script")
      scriptTag.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(scriptTag)
      ;(window as any).onYouTubeIframeAPIReady = () => {
        setIsApiReady(true)
      }
    }
  }, [])

  // Debug current wallpaper changes
  useEffect(() => {
    if (!currentWallpaper) return
    console.log("Current Wallpaper changed:", currentWallpaper)

    if (currentWallpaper.type === "youtube") {
      console.log("YouTube video ID:", currentWallpaper.id)
      console.log("YouTube API loaded:", typeof window !== "undefined" && (window as any).YT)
    }
  }, [currentWallpaper])

  // --- Event Handlers ---
  const handleRandomWallpaper = () => {
    // Only select wallpapers with valid id and type
    if (!currentWallpaper) return
    const filteredWallpapers = allWallpapers.filter(
      (w) => w.id !== currentWallpaper.id && (w.type === "youtube" || w.type === "pixabay") && w.id
    )
    if (filteredWallpapers.length === 0) return
    const randomIndex = Math.floor(Math.random() * filteredWallpapers.length)
    setCurrentWallpaper(filteredWallpapers[randomIndex])
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  const handleWallpaperSelect = (wallpaper: Wallpaper) => {
    setCurrentWallpaper(wallpaper)
  }

  if (!isClient || !currentWallpaper) {
    return <div className="w-screen h-screen bg-black" /> // Or a loading spinner
  }

  const handleYouTubeReady = (event: { target: YouTubePlayer }) => {
    console.log("YouTube player ready:", event.target)
    const player = event.target
    setYouTubePlayer(player)
    try {
      player.playVideo()
      // Unmute after a short delay to ensure autoplay works
      setTimeout(() => {
              // @ts-expect-error - unMute exists on the player but not in the type definitions
        player.unMute && player.unMute()
      }, 1000)
    } catch (error) {
      console.error("Error playing video:", error)
    }
  }

  const handleYouTubeStateChange = (event: { data: number; target: YouTubePlayer }) => {
    console.log("YouTube state change:", event.data)
    // If video ends, replay it (0 = ended state)
    if (event.data === 0) {
      event.target.playVideo()
    }
  }

  const handleYouTubeError = (event: { data: number }) => {
    console.error("YouTube player error:", event.data)
  }

  return (
    <>
      <style jsx global>{`
        body, html { margin: 0; padding: 0; overflow: hidden; background-color: #000; }
        .video-background { 
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
          z-index: -1; 
        }
        .video-background iframe, .video-background video {
          width: 100vw !important; 
          height: 56.25vw !important; 
          min-height: 100vh !important; 
          min-width: 177.77vh !important;
          position: absolute !important; 
          top: 50% !important; 
          left: 50% !important; 
          transform: translate(-50%, -50%) !important;
          pointer-events: none;
          border: none !important;
        }
      `}</style>

      <ClockDisplay />

      <div className="video-background">
        {isClient && isApiReady && currentWallpaper?.type === "youtube" && (
          <YouTube
            key={`youtube-${currentWallpaper.id}`}
            videoId={extractYouTubeId(currentWallpaper.id)}
            opts={{
              height: "100%",
              width: "100%",
              playerVars: {
                autoplay: 1,
                controls: 0,
                loop: 1,
                playlist: extractYouTubeId(currentWallpaper.id), // Required for loop
                mute: 1,
                origin: typeof window !== 'undefined' ? window.location.origin : '',
                end: 0,
                disablekb: 1,
                playsinline: 1,
              },
            }}
            onReady={handleYouTubeReady}
            onStateChange={handleYouTubeStateChange}
            onError={handleYouTubeError}
            className="video-background"
            style={{
              pointerEvents: 'none',
              width: '100%',
              height: '100%'
            }}
          />
        )}
        {currentWallpaper?.type === "pixabay" && (
          <video
            key={currentWallpaper.id}
            src={currentWallpaper.id}
            autoPlay
            loop
            muted
            playsInline
            className="video-background"
          />
        )}
      </div>

      <main>
        <motion.div
          className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm"
          animate={{ width: isToolbarOpen ? "auto" : 56 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsToolbarOpen(!isToolbarOpen)}
            className="h-10 w-10 flex-shrink-0 rounded-full hover:bg-white/20"
          >
            <ImmersiveLogo className="h-6 w-6" />
          </Button>

          <AnimatePresence>
            {isToolbarOpen && (
              <motion.div
                className="flex items-center gap-1 overflow-hidden"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/dashboard")}
                    className="rounded-full hover:bg-white/20"
                    title="Exit Immersive Mode"
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullScreen}
                    className="rounded-full hover:bg-white/20"
                    title="Toggle Fullscreen"
                  >
                    <Focus />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAmbientDrawerOpen(!isAmbientDrawerOpen)}
                    className="rounded-full hover:bg-white/20"
                    title="Ambient Sounds"
                  >
                    <AudioLines />
                  </Button>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ThemeDropdown />
                  </div>
                </div>

                {/* --- TOOLBAR WIDGETS --- */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20" title="Tasks">
                      <SquareCheckBig />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[var(--popover)] p-0">
                    <DialogHeader className="p-4 pb-0">
                      <DialogTitle>Your Tasks</DialogTitle>
                    </DialogHeader>
                    <div className="h-[60vh] p-4 pt-2">
                      <Todo />
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setJournalOpen(true)}
                  className="rounded-full hover:bg-white/20"
                  title="Journal"
                >
                  <BookText />
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20" title="Focus Timer">
                      <Clock />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[var(--popover)] p-4">
                    <DialogHeader>
                      <DialogTitle>Focus Timer</DialogTitle>
                    </DialogHeader>
                    <Stopwatch />
                  </DialogContent>
                </Dialog>

                {/* --- WALLPAPER CONTROLS --- */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRandomWallpaper}
                  className="rounded-full hover:bg-white/20"
                  title="Random Wallpaper"
                >
                  <Shuffle />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsWallpaperModalOpen(true)}
                  className="rounded-full hover:bg-white/20"
                  title="Change Wallpaper"
                >
                  <Video />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Wallpaper Selection Modal */}
      <WallpaperSelectionModal
        isOpen={isWallpaperModalOpen}
        onClose={() => setIsWallpaperModalOpen(false)}
        onWallpaperSelect={handleWallpaperSelect}
      />

      <Journal />
      <div className="hidden">
        <AudioManager />
      </div>
    </>
  )
}
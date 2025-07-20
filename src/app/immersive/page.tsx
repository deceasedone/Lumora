"use client"

import { default as ReactPlayerType } from "react-player"
import { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { openAmbientDrawerAtom, openJournalAtom, timerAtom } from "@/context/data"
import { useAtomValue, useSetAtom } from "jotai"
import {
  AudioLines,
  BookText,
  BrainCircuit,
  ChevronLeft,
  Clock,
  SquareCheckBig,
  Video,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { ImmersiveLogo } from "@/components/ImmersiveLogo"
import { AudioManager } from "@/components/beats"
import { Journal } from "@/components/journal"
import { MotivationButton, SurpriseMeButton } from "@/components/popups"
import { Stopwatch } from "@/components/stopwatch"
import { ThemeDropdown } from "@/components/theme-toggle"
import { Todo } from "@/components/todo"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatTimeMain } from "@/lib/utils"

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
}) as unknown as typeof ReactPlayerType

const WALLPAPERS = [
  { name: "Cosmic Ocean", url: "https://www.youtube.com/watch?v=F1xJ_zS3o-Y" },
  { name: "Kyoto Streets", url: "https://www.youtube.com/watch?v=F-brc2D5a2g" },
  { name: "Fantasy World", url: "https://www.youtube.com/watch?v=iB6-1E2243I" },
]

function LiveWallpaperPlayer({ url }: { url: string }) {
  return (
    <ReactPlayer
      url={url}
      playing
      loop
      muted
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        objectFit: "cover",
        zIndex: -1,
      }}
    />
  )
}

function ClockDisplay() {
  const [time, setTime] = useState("")
  const timerValue = useAtomValue(timerAtom)

  const updateTime = useCallback(() => {
    setTime(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    )
  }, [])

  useEffect(() => {
    if (timerValue > 0) return
    const interval = setInterval(updateTime, 1000)
    updateTime()
    return () => clearInterval(interval)
  }, [timerValue, updateTime])

  const displayTime = timerValue > 0 ? formatTimeMain(timerValue) : time

  return (
    <div className="absolute top-5 right-5 rounded-lg bg-black/30 px-4 py-2 text-2xl font-bold text-white backdrop-blur-sm">
      {displayTime}
    </div>
  )
}

export default function ImmersivePage() {
  const router = useRouter()
  const [isToolbarOpen, setIsToolbarOpen] = useState(false)
  const [currentWallpaper, setCurrentWallpaper] = useState(WALLPAPERS[0].url)
  const setJournalOpen = useSetAtom(openJournalAtom)
  const setAmbientDrawerOpen = useSetAtom(openAmbientDrawerAtom)

  return (
    <>
      <Journal />
      {/* THE FIX: Render the AudioManager but keep its trigger UI hidden */}
      <div className="hidden">
        <AudioManager />
      </div>

      <div className="relative h-screen w-screen overflow-hidden bg-black">
        <LiveWallpaperPlayer url={currentWallpaper} />

        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute top-5 left-5 flex gap-2">
          <div className="rounded-full bg-black/30 p-1 backdrop-blur-sm">
            <MotivationButton />
            <SurpriseMeButton />
          </div>
        </div>

        <ClockDisplay />

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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/dashboard")}
                  className="rounded-full hover:bg-white/20"
                >
                  <ChevronLeft />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAmbientDrawerOpen(true)}
                  className="rounded-full hover:bg-white/20"
                >
                  <AudioLines />
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-white/20"
                    >
                      <Video />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[var(--popover)]">
                    <DialogHeader>
                      <DialogTitle className="text-[var(--popover-foreground)]">
                        Select a Wallpaper
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-2">
                      {WALLPAPERS.map((w) => (
                        <Button
                          key={w.name}
                          variant="outline"
                          onClick={() => setCurrentWallpaper(w.url)}
                          className="w-full justify-start"
                        >
                          {w.name}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <ThemeDropdown />

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-white/20"
                    >
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
                >
                  <BookText />
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-white/20"
                    >
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}
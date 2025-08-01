"use client"

import React, { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { AnimatePresence, motion, Easing } from "framer-motion"
import {
  AudioLines,
  BookText,
  ListMusicIcon,
  MenuIcon,
  PlayIcon,
  PlusIcon,
  SettingsIcon,
  TargetIcon,
  Trash2Icon,
  User,
  VideoIcon,
  XIcon,
  YoutubeIcon,
  LogOutIcon,
  MinusIcon,
} from "lucide-react"

import { cn, formatTimeMain } from "@/lib/utils"
import {
  AllVideosListAtom,
  CurrentlyPlayingMediaAtom,
  dailyGoalAtom,
  isPomodoroBreakAtom,
  openAmbientDrawerAtom,
  openJournalAtom,
  showAbsoluteFocusAtom,
  timerAtom,
} from "@/context/data"
import { BREAK_ACTIVITIES, BREAK_QUOTES } from "@/data/lofi"
import {
  clearStoreByName,
  deleteVideoFromList,
  IDB_STORES,
  setDailyGoalIDB,
  updateVideoList,
} from "@/utils/idb.util"

import { Button } from "@/components/ui/button"
import { SheetTitle } from "@/components/ui/sheet"
import Link from "next/link"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ScrollArea } from "./ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet"
import { ThemeDropdown } from "./theme-toggle"
import { ProfilePopup } from "./profile-popup"

const ONE_HOUR = 60 * 60 * 1000
const MAX_FOCUS_TIME = 12 * ONE_HOUR
const CLOCK_UPDATE_INTERVAL = 1000

const EASING: Easing = [0.4, 0, 0.2, 1]

interface TimeDisplayProps {
  displayValues: {
    time: string
    period: string | null
  }
}

function formatCurrentTime(useLocalTime = false): {
  time: string
  period: string | null
} {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  const timeString = now.toLocaleTimeString([], options);
  const [time, period] = timeString.split(' ');

  return { time, period: period || null };
}

function TimeDisplay({ displayValues }: TimeDisplayProps) {
  const timeParts = displayValues.time.split(":")

  return (
    <div className="relative flex items-center justify-center font-mono text-[20vw] font-bold text-primary sm:text-[18vw] md:text-[15vw] lg:text-[12vw] xl:text-[10vw] 2xl:text-[8vw]">
      <span className="absolute w-full text-center text-primary/10">
      </span>
      <div className="relative flex tabular-nums">
        {timeParts.map((part, index) => (
          <React.Fragment key={index}>
            <div className="flex">
              {part.split("").map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASING }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
            {index < timeParts.length - 1 && <span>:</span>}
          </React.Fragment>
        ))}
      </div>
      {displayValues.period && (
        <span className="font-mono text-[9vw] font-medium text-[var(--accent)] opacity-80 [text-shadow:1px_1px_0_var(--primary),-1px_-1px_0_var(--primary),1px_-1px_0_var(--primary),-1px_1px_0_var(--primary)] sm:text-[8vw] md:text-[7vw] lg:text-[6vw] xl:text-[5vw] 2xl:text-[4vw]">
          {displayValues.period}
        </span>
      )}
    </div>
  )
}

export function DailyGoalDrawerTrigger() {
  const [goal, setGoal] = useAtom(dailyGoalAtom)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(
      z.object({
        goal: z
          .number()
          .min(1)
          .max(MAX_FOCUS_TIME / ONE_HOUR),
      }),
    ),
    defaultValues: { goal: goal / ONE_HOUR },
  })

  const onSubmit = (data: { goal: number }) => {
    setGoal(data.goal * ONE_HOUR)
    setDailyGoalIDB(data.goal * ONE_HOUR)
    setIsOpen(false)
    toast.success("Daily goal updated!")
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="group relative h-16 w-16 rounded-full p-0 transition-colors hover:bg-muted/50 bg-transparent"
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full border-2 border-border/50 transition-colors group-hover:border-primary">
            <span className="text-2xl font-bold text-primary">{goal > 0 ? goal / ONE_HOUR : "-"}</span>
            <span className="text-xs font-medium uppercase text-muted-foreground">Goal</span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-6">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl">Set Your Daily Goal</DrawerTitle>
            <DrawerDescription className="mt-2">
              How many hours of focused work do you want to achieve today?
            </DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-r-none bg-transparent"
                          onClick={() => {
                            const currentValue = field.value || 0
                            const newValue = Math.max(1, currentValue - 1)
                            field.onChange(newValue)
                            form.trigger("goal") // Trigger validation
                          }}
                          disabled={field.value <= 1}
                        >
                          <MinusIcon className="h-6 w-6" />
                        </Button>
                        <Input
                          type="number"
                          className="h-12 w-24 text-center text-xl font-bold tabular-nums rounded-none border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value)
                            field.onChange(isNaN(value) ? "" : value) // Handle empty input
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-l-none bg-transparent"
                          onClick={() => {
                            const currentValue = field.value || 0
                            const newValue = Math.min(MAX_FOCUS_TIME / ONE_HOUR, currentValue + 1)
                            field.onChange(newValue)
                            form.trigger("goal") // Trigger validation
                          }}
                          disabled={field.value >= MAX_FOCUS_TIME / ONE_HOUR}
                        >
                          <PlusIcon className="h-6 w-6" />
                        </Button>
                        <span className="ml-3 text-xl text-muted-foreground">hours</span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
              <DrawerFooter className="flex-row gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Save Goal
                </Button>
                <DrawerClose asChild className="flex-1">
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function UserSettingNavButton({
  className,
  label,
}: {
  className?: string
  label?: string
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const storeClearHandler = async (name: IDB_STORES) => {
    try {
      await clearStoreByName(name)
      toast.success(`${name} data has been cleared`)
    } catch (e) {
      toast.error(`Failed to clear ${name} data`)
    }
  }

  return (
    <>
      <ProfilePopup
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn("flex items-center gap-2", className)}
          >
            <SettingsIcon className="h-4 w-4" />
            {label && <span className="text-xs">{label}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              localStorage.removeItem("authToken")
              window.location.href = "/auth"
            }}
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export function AbsoluteFocusButton({
  className,
  label,
}: {
  className?: string
  label?: string
}) {
  const [isFocusMode, setIsFocusMode] = useAtom(showAbsoluteFocusAtom)
  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode)
  }
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFocusMode}
      className={cn(
        "transition-colors",
        isFocusMode ? "text-primary-foreground" : "",
        className
      )}
      aria-label={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
    >
      <TargetIcon className="h-4 w-4" />
      {label?.trim() ? <p className="text-muted-foreground">{label}</p> : null}
    </Button>
  )
}

export function AbsoluteFocusOverlay(): JSX.Element | null {
  const [isFocusMode, setIsFocusMode] = useAtom(showAbsoluteFocusAtom)
  const [currentTime, setCurrentTime] = useState(formatCurrentTime(true))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatCurrentTime(true))
    }, CLOCK_UPDATE_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  const toggleFocusMode = () => setIsFocusMode((prev) => !prev)

  const displayValues = useMemo(
    () => ({
      time: currentTime.time,
      period: currentTime.period,
    }),
    [currentTime]
  )

  const shouldShowFocusMode = isFocusMode

  useEffect(() => {
    if (!shouldShowFocusMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFocusMode(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [shouldShowFocusMode, setIsFocusMode])

  return (
    <AnimatePresence>
      {shouldShowFocusMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <div className="absolute inset-0" onClick={toggleFocusMode} />
          <div className="relative z-10">
            <TimeDisplay displayValues={displayValues} />
          </div>
          <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 transform">
            <p className="text-sm text-muted-foreground">
              Press Esc to exit focus mode
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function AllVideoPanel() {
  const [videos, setVideos] = useAtom(AllVideosListAtom)
  const setCurrentlyPlaying = useSetAtom(CurrentlyPlayingMediaAtom)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSelectVideo = (url: string) => {
    setCurrentlyPlaying({ type: "video", src: url })
    toast.info("Now playing selected video")
  }

  const handleDeleteVideo = async (url: string) => {
    try {
      await deleteVideoFromList(url)
      setVideos((prev) => prev.filter((v) => v.url !== url))
      toast.success("Video removed from playlist")
    } catch (error) {
      toast.error("Failed to remove video")
    }
  }

  const handleClearAll = async () => {
    try {
      await clearStoreByName("video")
      setVideos([])
      toast.success("Playlist cleared")
    } catch (error) {
      toast.error("Failed to clear playlist")
    }
  }

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function AddVideoForm() {
    const [isOpen, setIsOpen] = useState(false)
    const form = useForm({
      resolver: zodResolver(z.object({ url: z.string().url() })),
      defaultValues: { url: "" },
    })

    const onSubmit = async (data: { url: string }) => {
      try {
        if (!data.url.includes("youtube.com") && !data.url.includes("youtu.be")) {
          toast.error("Please enter a valid YouTube URL.")
          return
        }

        const response = await fetch(
          `https://www.youtube.com/oembed?url=${data.url}&format=json`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch video details")
        }
        const details = await response.json()

        const newVideo = {
          id: crypto.randomUUID(),
          url: data.url,
          title: details.title || "YouTube Video",
          author: details.author_name || "YouTube",
        }
        await updateVideoList(newVideo)
        setVideos((prev) => [...prev, newVideo])
        toast.success("Video added successfully!")
        form.reset()
        setIsOpen(false)
      } catch (error) {
        console.error(error)
        toast.error("Failed to add video. Please check the URL and try again.")
      }
    }

    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="p-0 text-center">
              <DrawerTitle>Add a new video</DrawerTitle>
              <DrawerDescription>
                Enter the URL of the YouTube video you want to add.
              </DrawerDescription>
            </DrawerHeader>
            <div className="py-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <Label>YouTube URL</Label>
                        <FormControl>
                          <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                    <Button type="submit">Add</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <ListMusicIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 !max-w-md p-0">
        {/* Accessibility: SheetTitle for screen readers and visible heading */}
        <SheetTitle className="mt-2 ml-4">Video Library</SheetTitle>
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <VideoIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="flex flex-col gap-4 px-4">
          <p className="text-sm text-muted-foreground">
            Manage and play your saved YouTube videos
          </p>
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <AddVideoForm />
            <Button variant="outline" onClick={handleClearAll} disabled={videos.length === 0}>
              <Trash2Icon className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4 min-h-0 overflow-auto">
          <div className="flex flex-col gap-2 pb-4">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <div
                  key={video.id + '-' + video.url}
                  className="flex items-center justify-between gap-2 rounded-lg border p-2"
                >
                  <div
                    className="flex flex-1 cursor-pointer items-center gap-4 p-1"
                    onClick={() => handleSelectVideo(video.url)}
                  >
                    <PlayIcon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium leading-tight">{video.title}</p>
                      <div className="flex items-center gap-1.5">
                        <YoutubeIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          YouTube
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteVideo(video.url)
                    }}
                  >
                    <Trash2Icon className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                <VideoIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Videos Found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add a video to get started.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export function MobileNavbar() {
  const isAbsFocusMode = useAtomValue(showAbsoluteFocusAtom)
  const setOpenAmbientDrawer = useSetAtom(openAmbientDrawerAtom)
  const setOpenJournal = useSetAtom(openJournalAtom)
  const [open, setIsOpen] = useState(false)

  useEffect(() => {
    if (isAbsFocusMode && open) setIsOpen(false)
  }, [isAbsFocusMode, open])

  return (
    <div className="flex lg:hidden">
      <Drawer open={!isAbsFocusMode && open} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <MenuIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="min-h-1/3">
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <div className="mb-4 grid grid-cols-3 gap-4 px-4">
            <AbsoluteFocusButton
              className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)]"
              label="Focus"
            />
            <Button
              variant="outline"
              className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)]"
              onClick={() => {
                setOpenAmbientDrawer(true)
                setIsOpen(false)
              }}
            >
              <AudioLines className="h-4 w-4" />
              <p className="text-xs text-muted-foreground">Ambient</p>
            </Button>
            <Button
              variant="outline"
              className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)]"
              onClick={() => {
                setOpenJournal(true)
                setIsOpen(false)
              }}
            >
              <BookText className="h-4 w-4" />
              <p className="text-xs text-muted-foreground">Journal</p>
            </Button>
            <UserSettingNavButton
              className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)]"
              label="Settings"
            />
            <ThemeDropdown />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export function BottomHeader() {
  const isAbsFocusMode = useAtomValue(showAbsoluteFocusAtom)

  if (isAbsFocusMode) {
    return null
  }

  return (
    <div
      className={cn(
        "hidden w-full items-center justify-between lg:flex",
        isAbsFocusMode && "!hidden"
      )}
    >
      <div className="flex items-center gap-2">
        <ThemeDropdown />
        <DailyGoalDrawerTrigger />
      </div>
      <div className="flex items-center gap-2">
        <AbsoluteFocusButton />
        <UserSettingNavButton />
        <Link href="/lobby">
          <Button variant="outline">Lobby</Button>
        </Link>
      </div>
    </div>
  )
}
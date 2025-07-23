"use client"

import { useRouter } from "next/navigation"
import { useSetAtom } from "jotai"
import { BookText } from "lucide-react"

// Import application components
import { AudioManager } from "@/components/beats"
import { BottomHeader } from "@/components/bottom-header" // This now includes the player and breathing widget
import { Journal } from "@/components/journal"
import {
  AbsoluteFocusButton,
  AbsoluteFocusOverlay,
  MobileNavbar,
  PomoBreakOverlay,
  UserSettingNavButton,
} from "@/components/overlay"
import { Player } from "@/components/player"
import { MotivationButton, SurpriseMeButton } from "@/components/popups"
import { Stopwatch } from "@/components/stopwatch" // <-- Re-import the Stopwatch timer
import { ThemeDropdown } from "@/components/theme-toggle"
import { Todo } from "@/components/todo"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LumoraLogo } from "@/components/lumora"
import { openJournalAtom } from "@/context/data"

import "@/styles/themes.css"

// Helper component for the nav button
function JournalNavButton() {
  const setJournalOpen = useSetAtom(openJournalAtom)
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setJournalOpen(true)}
      aria-label="Open Journal"
    >
      <BookText className="h-4 w-4" />
    </Button>
  )
}

// Helper component for the immersive switch
function ImmersiveModeSwitch() {
  const router = useRouter()
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="immersive-mode"
        onCheckedChange={(checked) => {
          if (checked) {
            router.push("/immersive")
          }
        }}
      />
      <Label htmlFor="immersive-mode" className="text-sm font-medium">
        Immersive
      </Label>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-[family-name:var(--font-geist-sans)]">
      <PomoBreakOverlay />
      <AbsoluteFocusOverlay />
      <Journal />

      <div className="flex h-screen flex-col overflow-hidden lg:overflow-hidden">
        <nav className="flex h-16 shrink-0 items-center border-b border-[var(--border)] bg-[var(--card)] px-6">
          <LumoraLogo />
          <h1 className="grow text-xl font-semibold text-[var(--card-foreground)]">
            LUMORA
          </h1>
          <div className="ml-auto hidden items-center gap-x-4 lg:flex">
            <MotivationButton />
            <SurpriseMeButton />
            <ImmersiveModeSwitch />
            <AbsoluteFocusButton />
            <AudioManager />
            <JournalNavButton />
            <UserSettingNavButton />
            <ThemeDropdown />
          </div>
          <MobileNavbar />
        </nav>

        {/* Main Content Grid */}
        <main className="grid flex-1 grid-cols-12 gap-4 overflow-y-auto bg-[var(--background)] p-4 lg:min-h-0 lg:overflow-hidden">
          <div className="col-span-12 flex flex-col gap-4 lg:col-span-8 lg:min-h-0">
            <div className="h-96 shrink-0 overflow-hidden rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] bg-[var(--card)] p-4 lg:h-auto lg:min-h-0 lg:flex-1">
              <div className="h-full overflow-hidden">
                <Player />
              </div>
            </div>
            <div className="shrink-0 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] bg-[var(--card)] p-4">
              <BottomHeader />
            </div>
          </div>
          <div className="col-span-12 flex flex-col gap-4 lg:col-span-4 lg:overflow-hidden">
            <div className="min-h-96 shrink-0 overflow-hidden rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] bg-[var(--card)] p-4 lg:min-h-0 lg:flex-1">
              <div className="h-full overflow-hidden px-2">
                <Todo />
              </div>
            </div>
            {/* THE FIX: The timer component is now back in its original place. */}
            <div className="shrink-0 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] bg-[var(--card)] p-2">
              <div className="overflow-hidden">
                <Stopwatch />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
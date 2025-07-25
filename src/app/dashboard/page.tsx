"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react" // <-- Import useCallback for focus mode logic
import { useAtom, useSetAtom } from "jotai"
import { useTheme } from "next-themes"
import { BookText, Zap, Shuffle, Focus, Volume2, Settings, Palette, User } from "lucide-react"

// Import UI components for popups and dropdowns
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog" // <-- For Surprise Me button

// Import application components and atoms
import { AudioManager } from "@/components/beats" // <-- We need to render this component for it to work
import { Journal } from "@/components/journal"
import { AbsoluteFocusOverlay, MobileNavbar, PomoBreakOverlay } from "@/components/overlay" // <-- Assuming UserSettings can be a standalone content component
import { Player } from "@/components/player"
import { Stopwatch } from "@/components/stopwatch"
import { Todo } from "@/components/todo"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LumoraLogo } from "@/components/lumora"
import { GradientNavButton} from "@/components/ui/gradient-nav-button"
import { GradientNavWrapper } from "@/components/ui/gradient-nav-wrapper"

// Import all necessary Jotai atomsf
import { 
  openJournalAtom, 
  showAbsoluteFocusAtom,
  openAmbientDrawerAtom,
} from "@/context/data"
import { BottomHeader } from "@/components/bottom-header"

// Import IDB utilities for settings dropdown
import { clearStoreByName, IDB_STORES, STORES } from "@/utils/idb.util"

import "@/styles/themes.css"


// --- HELPER COMPONENTS WITH GRADIENT STYLE AND CORRECT LOGIC ---

// Motivation Button (shows a toast)


// Absolute Focus Button (replicates logic from overlay.tsx)
function GradientAbsoluteFocusButton() {
  const [isFocusMode, setIsFocusMode] = useAtom(showAbsoluteFocusAtom)

  const handleFullscreenToggle = useCallback(async (enter: boolean) => {
    try {
      if (enter && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (!enter && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen API error:", error)
    }
  }, []);
  
  const toggleFocusMode = useCallback(async () => {
    const newFocusMode = !isFocusMode;
    await handleFullscreenToggle(newFocusMode);
    setIsFocusMode(newFocusMode);
  }, [isFocusMode, handleFullscreenToggle, setIsFocusMode]);

  return (
    <GradientNavButton title="Focus" gradientFrom="#80FF72" gradientTo="#7EE8FA" onClick={toggleFocusMode}>
      <Focus className="h-4 w-4" />
    </GradientNavButton>
  )
}

// Audio Manager Button (controlled by a global atom)
function GradientAudioManagerButton() {
  const setDrawerOpen = useSetAtom(openAmbientDrawerAtom)
  return (
    <GradientNavButton title="Audio" gradientFrom="#ffa9c6" gradientTo="#f434e2" onClick={() => setDrawerOpen(true)}>
      <Volume2 className="h-4 w-4" />
    </GradientNavButton>
  )
}

// Journal Button (You already did this one perfectly!)
function JournalNavButton() {
  const setJournalOpen = useSetAtom(openJournalAtom)
  return (
    <GradientNavButton title="Journal" gradientFrom="#FF9966" gradientTo="#FF5E62" onClick={() => setJournalOpen(true)}>
      <BookText className="h-4 w-4" />
    </GradientNavButton>
  )
}

// User Settings Button (replicates the DropdownMenu from overlay.tsx)
function GradientUserSettingNavButton() {
  const storeClearHandler = async (name: IDB_STORES) => {
    try {
      await clearStoreByName(name)
    } catch {
      console.error("COULD NOT CLEAR DATA")
    }
  }

  const handleClearEverything = async () => {
    STORES.map(async (store) => storeClearHandler(store))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <GradientNavButton title="Settings" gradientFrom="#FFD700" gradientTo="#FFA500">
          <Settings className="h-4 w-4" />
        </GradientNavButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <a href="/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => storeClearHandler("session")}>
          Clear Stats
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => storeClearHandler("todo")}>
          Clear Todos
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => storeClearHandler("video")}>
          Clear Video List
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500"
          onClick={handleClearEverything}
        >
          Clear Everything
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Theme Dropdown (uses a DropdownMenu)
function GradientThemeDropdown() {
  const { setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <GradientNavButton title="Theme" gradientFrom="#9333EA" gradientTo="#C084FC">
          <Palette className="h-4 w-4" />
        </GradientNavButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dracula")}>Dracula</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("onepiece")}>One Piece</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("naruto")}>Naruto</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("doom-64")}>Doom 64</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("monokai")}>Monokai</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("nord")}>Nord</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("vscode")}>VS Code</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("noctis")}>Noctis</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("cyberpunk")}>Cyberpunk</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("retro")}>Retro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("lumora")}>Lumora</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("midnight")}>Midnight</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("espresso")}>Espresso</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("forest")}>Forest</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("ocean")}>Ocean</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("sunset")}>Sunset</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("gray")}>Gray</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("lavender")}>Lavender</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("barbie")}>Barbie</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("brutalism")}>Brutalism</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("claymorphism")}>Claymorphism</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("clean slate")}>Clean Slate</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("caffeine")}>Caffeine</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("nature")}>Nature</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("desert-oasis")}>Desert Oasis</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("paper")}>Paper</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("9009")}>9009</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("stealth")}>Stealth</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("tangerine")}>Tangerine</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("q-rose")}>Q Rose</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("amber light")}>Amber Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("amber dark")}>Amber Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("bold tech")}>Bold Tech</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Import the MinimalToggle component at the top of the file with other imports
import { MinimalToggle } from "@/components/ui/toggle"
import { showMotivationToast, showFactToast } from "@/components/popups"

// Immersive Mode Switch with MinimalToggle
function ImmersiveModeSwitch() {
  const router = useRouter()
  return (
    <div className="flex items-center gap-2">
      <MinimalToggle
        id="immersive-mode"
        className="scale-75"
        onChange={(e) => {
          if (e.target.checked) {
            router.push("/immersive")
          }
        }}
      />
      <Label htmlFor="immersive-mode" className="text-sm font-medium underline decoration-orange-500 decoration-2 underline-offset-4">
        Immersive
      </Label>
    </div>
  )
}


// --- MAIN DASHBOARD PAGE ---
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-[family-name:var(--font-geist-sans)]">
      {/* These components are controlled by atoms and can be placed at the top level */}
      <PomoBreakOverlay />
      <AbsoluteFocusOverlay />
      <Journal />
      <AudioManager />

      <div className="flex h-screen flex-col overflow-hidden lg:overflow-hidden">
        <nav className="flex h-16 shrink-0 items-center border-b border-[var(--border)] bg-[var(--card)] px-6">
          <LumoraLogo />
          <h1 className="grow text-xl font-semibold text-[var(--card-foreground)]">LUMORA</h1>

          <div className="ml-auto hidden items-center gap-x-4 lg:flex">
            <GradientNavWrapper>
              {/* Use all the new, functional gradient components */}
              <ImmersiveModeSwitch />
              <GradientAbsoluteFocusButton />
              <GradientAudioManagerButton />
              <JournalNavButton />
              <GradientUserSettingNavButton />
              <GradientThemeDropdown />
            </GradientNavWrapper>
          </div>

          <MobileNavbar />
        </nav>

        {/* Main Content Grid (No changes here) */}
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
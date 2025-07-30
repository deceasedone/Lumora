import { LOFI_CHANNELS, VideoItem } from "@/data/lofi"
import { atom } from "jotai"

import { SessionData } from "@/components/stopwatch"

interface PomodoroDurationType {
  focus: number
  break: number
}

export interface TodosInfo {
  completed: number
  total: number
}

const ONE_HOUR = 60 * 60 * 1000

export const playerVolumeAtom = atom<number[]>([50])

export const isMediaPlayingAtom = atom<boolean>(false)

export const MediaProgressAtom = atom<number>(0)

export const AllVideosListAtom = atom<VideoItem[]>(LOFI_CHANNELS)

export const CurrentlyPlayingMediaAtom = atom<{
  type: "lofi" | "video"
  src: string
} | null>({ type: "lofi", src: LOFI_CHANNELS[0].url })

export const dailyGoalAtom = atom<number>(2 * ONE_HOUR)

export const timerAtom = atom<number>(0)

export const isPomodoroBreakAtom = atom<boolean>(false)

export const PomodoroDurationsAtom = atom<PomodoroDurationType>({
  focus: 25 * 60 * 1000,
  break: 5 * 60 * 1000,
})

export const allSessionSavedDataAtom = atom<SessionData[]>([])

export const showAbsoluteFocusAtom = atom<boolean>(false)

export const openAmbientDrawerAtom = atom<boolean>(false)

export const openJournalAtom = atom<boolean>(false)

export const motivationModalOpenAtom = atom<boolean>(false)

export const factModalOpenAtom = atom<boolean>(false)

const defaultTodosInfo: TodosInfo = { completed: 0, total: 0 }

export const todoInfoAtom = atom<TodosInfo>(defaultTodosInfo)


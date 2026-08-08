"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import {
  CurrentlyPlayingMediaAtom,
  isMediaPlayingAtom,
  MediaDurationAtom,
  MediaProgressAtom,
  playerVolumeAtom,
} from "@/context/data"
import { useAtom, useAtomValue, useSetAtom } from "jotai"

import { cn } from "@/lib/utils"

import { PlayerControls } from "./controls"

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
})

export function Player({ hidden = false }: { hidden?: boolean }) {
  const currentChannel = useAtomValue(CurrentlyPlayingMediaAtom)
  const volume = useAtomValue(playerVolumeAtom)
  const setVideoProgress = useSetAtom(MediaProgressAtom)
  const setMediaDuration = useSetAtom(MediaDurationAtom)
  const [isMediaPlaying, setIsMediaPlaying] = useAtom(isMediaPlayingAtom)
  const playerRef = useRef<any>(null)

  if (!currentChannel) {
    return null
  }
  return (
    <>
      <div className="flex h-full min-h-0 flex-col gap-2 md:gap-3">
        <div className="relative min-h-0 flex-1">
          <div
            className={cn(
              "relative h-full w-full overflow-hidden rounded-lg border-4 border-gray-300 shadow-md",
              hidden ? "hidden" : ""
            )}
          >
            <ReactPlayer
              ref={playerRef}
              loop
              style={{ borderRadius: "var(--radius)", overflow: "hidden" }}
              src={currentChannel.src}
              width="100%"
              height="100%"
              controls={false}
              playsInline
              wrapper={undefined}
              onPlay={() => setIsMediaPlaying(true)}
              onPause={() => setIsMediaPlaying(false)}
              onError={(error) => {
                console.error("Player error, stream may be unavailable:", error)
                setIsMediaPlaying(false)
              }}
              playing={isMediaPlaying}
              volume={volume[0] / 100}
              onTimeUpdate={(event) => {
                const target = event.target as HTMLMediaElement

                const duration = target.duration
                const currentTime = target.currentTime

                if (!duration || isNaN(duration)) {
                  console.warn("Video duration is not ready yet")
                  setMediaDuration(0)
                  return
                }
                setMediaDuration(duration)
                const percentage = currentTime / duration
                setVideoProgress(percentage)
              }}
              config={{
                youtube: {
                  // @ts-expect-error - The YouTube playerVars type is not fully compatible with the react-player types
                  // This error is expected because the YouTube playerVars type is not fully compatible with the react-player types.
                  // The react-player library does not provide a comprehensive type definition for YouTube playerVars.
                  playerVars: {
                    disablekb: 0,
                    rel: 0,
                    fs: 1,
                    iv_load_policy: 3,
                    host: 'https://www.youtube-nocookie.com',
                  },
                },
              }}
            />
          </div>
        </div>
        <PlayerControls playerRef={playerRef} />
      </div>
    </>
  )
}
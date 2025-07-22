"use client"

import dynamic from "next/dynamic"
// MODIFIED: Import the Wallpaper type from our new central data file.
import type { Wallpaper } from "@/data/wallpapers"

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
})

export function LiveWallpaperPlayer({
  wallpaper,
  hasInteracted,
}: {
  wallpaper: Wallpaper | null
  hasInteracted: boolean
}) {
  if (!wallpaper) return null

  const origin = typeof window !== "undefined" ? window.location.origin : ""

  // MODIFIED: Updated the muting logic to include 'pixabay'
  // A video is muted if it has a separate audioUrl (custom) OR if it's a silent Pixabay video.
  const isVideoMuted = !!wallpaper.audioUrl || wallpaper.type === "pixabay"

  return (
    <>
      {/* Video Player */}
      <ReactPlayer
        url={wallpaper.videoUrl}
        playing={hasInteracted}
        loop
        muted={isVideoMuted}
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          objectFit: "cover",
          zIndex: -1,
        }}
        config={{
          youtube: {
            // @ts-expect-error: playerVars is supported by react-player at runtime
            playerVars: {
              controls: 0,
              origin: origin,
            },
          },
          file: {
            attributes: {
              style: { objectFit: "cover" },
            },
          },
        }}
      />
      {/* Audio Player (for custom selections) */}
      {wallpaper.type === "custom" && wallpaper.audioUrl && (
        <ReactPlayer
          url={wallpaper.audioUrl}
          playing={hasInteracted}
          loop
          volume={0.5}
          width="0"
          height="0"
          style={{ display: "none" }}
          config={{
            youtube: {
              // @ts-expect-error: playerVars is supported by react-player at runtime
              playerVars: {
                origin: origin,
              },
            },
          }}
        />
      )}
    </>
  )
}
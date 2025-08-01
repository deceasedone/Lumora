"use client"

import { GridLayout, ControlBar, TrackLoop, ParticipantTile, useRoomContext } from "@livekit/components-react"
import { useTracks } from "@livekit/components-react"
import { Track } from "livekit-client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import SharedYoutubePlayer from "./SharedYoutubePlayer"
import Timer from "./Timer"
import "../lobby.css"

export default function LeftPanel() {
  const room = useRoomContext()
  const router = useRouter()
  const [isLeaving, setIsLeaving] = useState(false)
  const screenShareTracks = useTracks([Track.Source.ScreenShare])
  const isScreenSharing = screenShareTracks.length > 0

  const handleLeave = async () => {
    if (isLeaving) return

    setIsLeaving(true)
    try {
      await room.disconnect()
      router.push("/lobby")
    } catch (error) {
      console.error("Error leaving room:", error)
      // Force navigation even if disconnect fails
      router.push("/lobby")
    } finally {
      setIsLeaving(false)
    }
  }

  const handleStopSharing = async () => {
    try {
      await room.localParticipant.setScreenShareEnabled(false)
    } catch (error) {
      console.error("Error stopping screen share:", error)
    }
  }

  return (
    <div className="left-panel-container">
      {isScreenSharing ? (
        <div className="screen-share-container">
          <GridLayout tracks={screenShareTracks} style={{ height: "100%" }}>
            <TrackLoop tracks={screenShareTracks}>
              <ParticipantTile />
            </TrackLoop>
          </GridLayout>
          <button className="stop-sharing-button" onClick={handleStopSharing} aria-label="Stop screen sharing">
            🛑 Stop Sharing
          </button>
        </div>
      ) : (
        <div className="main-content-area">
          <div className="horizontal-content-layout">
            <div className="video-section">
              <SharedYoutubePlayer />
            </div>
            <div className="timer-section">
              <Timer />
            </div>
          </div>
        </div>
      )}

      <div className="control-bar-container">
        <ControlBar
          controls={{
            microphone: true,
            screenShare: true,
            camera: false,
            chat: false,
            leave: false,
          }}
        />
        <button
          className="lk-button lk-leave-button"
          onClick={handleLeave}
          disabled={isLeaving}
          aria-label="Leave lobby"
        >
          {isLeaving ? "⏳ Leaving..." : "🚪 Leave Lobby"}
        </button>
      </div>
    </div>
  )
}

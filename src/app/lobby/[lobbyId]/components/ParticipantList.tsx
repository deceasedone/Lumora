"use client"

import { useParticipants } from "@livekit/components-react"
import { useState, useEffect } from "react"

export default function ParticipantList() {
  const participants = useParticipants()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="participant-list-loading">
        <div className="loading-spinner small"></div>
        <span>Loading participants...</span>
      </div>
    )
  }

  if (participants.length === 0) {
    return (
      <div className="participant-list-empty">
        <p>👤 No participants yet</p>
      </div>
    )
  }

  return (
    <div className="participant-list-container">
      {participants.map((participant, index) => {
        const isHost = index === 0
        const displayName = participant.name || participant.identity

        return (
          <div
            key={participant.identity}
            className={`participant-item ${participant.isSpeaking ? "participant-speaking" : ""}`}
          >
            <div className="participant-info">
              <div
                className="speaking-indicator"
                style={{
                  backgroundColor: participant.isSpeaking ? "#10b981" : "transparent",
                  border: participant.isSpeaking ? "none" : "2px solid var(--border)",
                }}
                aria-label={participant.isSpeaking ? "Speaking" : "Not speaking"}
              />
              <span className="participant-name">
                {displayName}
                {isHost && <span className="host-badge">👑 Host</span>}
              </span>
            </div>
            <div className="participant-status">
              {participant.isSpeaking && (
                <span className="speaking-text" aria-live="polite">
                  🎤 Speaking
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

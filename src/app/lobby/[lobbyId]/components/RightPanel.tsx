"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ParticipantList from "./ParticipantList"
import Chat from "./Chat"
import { useTheme } from "next-themes"
import { ThemeSwitcher } from "./ThemeSwitcher"
import "../lobby.css"

export default function RightPanel() {
  const { theme } = useTheme()
  const params = useParams()
  const lobbyId = params.lobbyId as string
  const [copyButtonText, setCopyButtonText] = useState("📋 Copy Code")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(lobbyId)
      setCopyButtonText("✅ Copied!")
      setTimeout(() => setCopyButtonText("📋 Copy Code"), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = lobbyId
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        setCopyButtonText("✅ Copied!")
        setTimeout(() => setCopyButtonText("📋 Copy Code"), 2000)
      } catch (fallbackError) {
        setCopyButtonText("❌ Copy failed")
        setTimeout(() => setCopyButtonText("📋 Copy Code"), 2000)
      }
      document.body.removeChild(textArea)
    }
  }

  if (!mounted) {
    return (
      <div className="right-panel-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="right-panel-container">
      <div className="invite-code-section">
        <p className="invite-label">🔗 Invite others with this code:</p>
        <div className="lobby-code-display">
          <strong className="lobby-code">{lobbyId}</strong>
        </div>
        <button onClick={handleCopyCode} className="copy-button" aria-label={`Copy lobby code ${lobbyId}`}>
          {copyButtonText}
        </button>
      </div>

      <div className="participant-section">
        <h2 className="section-title">👥 Participants</h2>
        <ParticipantList />
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <h3 className="section-title">💬 Chat</h3>
        </div>
        <Chat />
      </div>

      <div className="theme-switcher-section">
        <div className="theme-switcher-container">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useDataChannel, useLocalParticipant, useConnectionState } from "@livekit/components-react"
import { ConnectionState } from "livekit-client"
import { useState, useEffect, useRef } from "react"
import { DataTopic, type ChatMessage } from "@/lib/types"

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatScrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const connectionState = useConnectionState()
  const { message, send } = useDataChannel(DataTopic.Chat)
  const { localParticipant } = useLocalParticipant()

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (message) {
      const decoder = new TextDecoder()
      try {
        const receivedMessage = JSON.parse(decoder.decode(message.payload)) as ChatMessage
        setMessages((prev) => {
          // Prevent duplicate messages
          const isDuplicate = prev.some(
            (msg) =>
              msg.timestamp === receivedMessage.timestamp &&
              msg.sender === receivedMessage.sender &&
              msg.message === receivedMessage.message,
          )
          if (isDuplicate) return prev
          return [...prev, receivedMessage]
        })
      } catch (e) {
        console.error("Failed to parse chat message", e)
      }
    }
  }, [message])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || connectionState !== ConnectionState.Connected) return

    const chatMessage: ChatMessage = {
      sender: localParticipant.name || localParticipant.identity,
      message: inputValue.trim(),
      timestamp: Date.now(),
    }

    try {
      const encoder = new TextEncoder()
      send(encoder.encode(JSON.stringify(chatMessage)), {})

      // Add to local messages immediately for better UX
      setMessages((prev) => [...prev, chatMessage])
      setInputValue("")
      inputRef.current?.focus()
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsTyping(e.target.value.length > 0)
  }

  const isConnected = connectionState === ConnectionState.Connected
  const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp)

  return (
    <div className="chat-messages-container">
      <div ref={chatScrollAreaRef} className="chat-scroll-area">
        {sortedMessages.length === 0 ? (
          <div className="chat-empty-state">
            <p>💬 No messages yet. Start the conversation!</p>
          </div>
        ) : (
          sortedMessages.map((msg, index) => {
            const isLocal = msg.sender === (localParticipant.name || localParticipant.identity)
            const showSender = index === 0 || sortedMessages[index - 1].sender !== msg.sender

            return (
              <div
                key={`${msg.timestamp}-${msg.sender}-${index}`}
                className={`chat-message ${isLocal ? "local" : "remote"}`}
              >
                {showSender && !isLocal && <div className="message-sender">{msg.sender}</div>}
                <div className="message-content">{msg.message}</div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            )
          })
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-form">
        <div className="chat-input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            className="chat-input"
            disabled={!isConnected}
            maxLength={500}
          />
          <button
            type="submit"
            className="chat-send-button"
            disabled={!isConnected || !inputValue.trim()}
            aria-label="Send message"
          >
            {isConnected ? "📤" : "⏳"}
          </button>
        </div>
        {!isConnected && (
          <div className="connection-status">
            <span className="status-indicator disconnected"></span>
            Connecting to chat...
          </div>
        )}
      </form>
    </div>
  )
}

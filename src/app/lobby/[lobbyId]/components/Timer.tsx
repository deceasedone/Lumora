"use client"

import { useState, useEffect, useCallback } from "react"
import { useDataChannel, useLocalParticipant, useParticipants } from "@livekit/components-react"
import { DataTopic, type TimerState, type PomodoroModeState, type CountdownModeState } from "@/lib/types"

const WORK_DURATION = 25 * 60
const BREAK_DURATION = 5 * 60

export default function Timer() {
  const [state, setState] = useState<TimerState>({
    mode: "pomodoro",
    phase: "work",
    timeRemaining: WORK_DURATION,
    isRunning: false,
  } as PomodoroModeState)

  const [countdownMinutes, setCountdownMinutes] = useState(10)

  const { message, send } = useDataChannel(DataTopic.Timer)
  const { localParticipant } = useLocalParticipant()
  const participants = useParticipants()

  const isHost = participants.length > 0 && localParticipant.identity === participants[0].identity

  const broadcastState = useCallback(
    (newState: TimerState) => {
      if (!isHost) return
      try {
        const encoder = new TextEncoder()
        send(encoder.encode(JSON.stringify(newState)), {})
      } catch (error) {
        console.error("Failed to broadcast timer state:", error)
      }
    },
    [send, isHost],
  )

  // Listen for updates from host
  useEffect(() => {
    if (message && !isHost) {
      const decoder = new TextDecoder()
      try {
        const receivedState = JSON.parse(decoder.decode(message.payload)) as TimerState
        setState(receivedState)
      } catch (e) {
        console.error("Failed to parse timer state", e)
      }
    }
  }, [message, isHost])

  // Timer countdown logic
  useEffect(() => {
    if (!isHost || !state.isRunning) return

    const interval = setInterval(() => {
      setState((prevState) => {
        let newState: TimerState

        if (prevState.timeRemaining > 0) {
          // Decrement time
          newState = { ...prevState, timeRemaining: prevState.timeRemaining - 1 }
        } else {
          // Time is up
          if (prevState.mode === "pomodoro") {
            // Switch between work and break phases
            const newPhase = prevState.phase === "work" ? "break" : "work"
            const newTime = newPhase === "work" ? WORK_DURATION : BREAK_DURATION
            newState = {
              ...prevState,
              phase: newPhase,
              timeRemaining: newTime,
            } as PomodoroModeState
          } else {
            // Countdown mode - stop at 0
            newState = { ...prevState, isRunning: false, timeRemaining: 0 }
          }
        }

        broadcastState(newState)
        return newState
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isHost, state.isRunning, broadcastState])

  const handleModeSwitch = (newMode: "pomodoro" | "countdown") => {
    if (!isHost) return

    let newState: TimerState
    if (newMode === "pomodoro") {
      newState = {
        mode: "pomodoro",
        phase: "work",
        timeRemaining: WORK_DURATION,
        isRunning: false,
      } as PomodoroModeState
    } else {
      const duration = countdownMinutes * 60
      newState = {
        mode: "countdown",
        duration,
        timeRemaining: duration,
        isRunning: false,
      } as CountdownModeState
    }

    setState(newState)
    broadcastState(newState)
  }

  const handleToggleTimer = () => {
    if (!isHost) return
    const newState = { ...state, isRunning: !state.isRunning }
    setState(newState)
    broadcastState(newState)
  }

  const handleResetTimer = () => {
    if (!isHost) return

    let newState: TimerState
    if (state.mode === "pomodoro") {
      newState = {
        mode: "pomodoro",
        phase: "work",
        timeRemaining: WORK_DURATION,
        isRunning: false,
      } as PomodoroModeState
    } else {
      const duration = (state as CountdownModeState).duration
      newState = {
        mode: "countdown",
        duration,
        timeRemaining: duration,
        isRunning: false,
      } as CountdownModeState
    }

    setState(newState)
    broadcastState(newState)
  }

  const handleSetCountdown = () => {
    if (!isHost || state.mode !== "countdown") return

    const duration = countdownMinutes * 60
    const newState: CountdownModeState = {
      mode: "countdown",
      duration,
      timeRemaining: duration,
      isRunning: false,
    }

    setState(newState)
    broadcastState(newState)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  const getTimerTitle = () => {
    if (state.mode === "pomodoro") {
      return state.phase === "work" ? "🍅 Focus Time" : "☕ Break Time"
    }
    return "⏱️ Countdown Timer"
  }

  const canStart = state.timeRemaining > 0 || (state.mode === "pomodoro" && state.timeRemaining === 0)

  return (
    <div className="pomodoro-timer-container">
      {isHost && (
        <div className="timer-mode-switcher">
          <button onClick={() => handleModeSwitch("pomodoro")} disabled={state.mode === "pomodoro"}>
            Pomodoro
          </button>
          <button onClick={() => handleModeSwitch("countdown")} disabled={state.mode === "countdown"}>
            Countdown
          </button>
        </div>
      )}

      <h2 className="timer-phase-label">{getTimerTitle()}</h2>

      {state.mode === "countdown" && isHost && !state.isRunning && (
        <div className="countdown-setup">
          <input
            type="number"
            min="1"
            max="120"
            value={countdownMinutes}
            onChange={(e) => setCountdownMinutes(Number.parseInt(e.target.value) || 1)}
            className="countdown-input"
            aria-label="Countdown duration in minutes"
          />
          <span>minutes</span>
          <button onClick={handleSetCountdown} className="countdown-set-btn">
            Set
          </button>
        </div>
      )}

      <div className="pomodoro-timer-display" aria-live="polite">
        {formatTime(state.timeRemaining)}
      </div>

      {isHost && (
        <div className="pomodoro-timer-controls">
          <button
            onClick={handleToggleTimer}
            disabled={!canStart}
            className="timer-control-btn primary"
            aria-label={state.isRunning ? "Pause timer" : "Start timer"}
          >
            {state.isRunning ? "⏸️ Pause" : "▶️ Start"}
          </button>
          <button onClick={handleResetTimer} className="timer-control-btn secondary" aria-label="Reset timer">
            🔄 Reset
          </button>
        </div>
      )}

      {!isHost && <p className="timer-participant-note">Timer is controlled by the host</p>}
    </div>
  )
}

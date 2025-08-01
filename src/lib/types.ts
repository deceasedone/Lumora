// src/lib/types.ts
export enum DataTopic {
    Chat = "chat",
    Youtube = "youtube",
    Timer = "timer",
  }
  
  export type ChatMessage = {
    sender: string;
    message: string;
    timestamp: number;
  };
  
  export type YoutubeState = {
    action: "play" | "pause" | "seek" | "new_video";
    videoId?: string;
    currentTime?: number;
  };
  
  export type PomodoroModeState = {
    mode: 'pomodoro';
    phase: 'work' | 'break';
    timeRemaining: number;
    isRunning: boolean;
  };

  export type CountdownModeState = {
    mode: 'countdown';
    duration: number; 
    timeRemaining: number;
    isRunning: boolean;
  };

  export type TimerState = PomodoroModeState | CountdownModeState;
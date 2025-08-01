// src/app/lobby/[lobbyId]/components/SharedYoutubePlayer.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import YouTube from 'react-youtube';
import type { YouTubePlayer } from 'react-youtube';
// FIX: Import useConnectionState hook and ConnectionState enum
import { useDataChannel, useLocalParticipant, useParticipants, useConnectionState } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { DataTopic, type YoutubeState } from '@/lib/types';

const YOUTUBE_VIDEO_ID_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([\w-]{11})(?:\S+)?/;

export default function SharedYoutubePlayer() {
  const [videoId, setVideoId] = useState('jfKfPfyJRdk');
  const [inputValue, setInputValue] = useState('');
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const isSyncing = useRef(false);

  // FIX: Get the current connection state
  const connectionState = useConnectionState();
  
  const { message, send } = useDataChannel(DataTopic.Youtube);
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const isHost = participants.length > 0 && localParticipant.identity === participants[0].identity;

  const broadcastState = useCallback((state: YoutubeState) => {
    // FIX: Add a guard to ensure we only send data when connected.
    if (connectionState !== ConnectionState.Connected) {
      console.warn('Cannot broadcast state: not connected.');
      return;
    }
    const encoder = new TextEncoder();
    send(encoder.encode(JSON.stringify(state)), {});
  }, [send, connectionState]); // <-- Add connectionState to dependency array

  // This useEffect for receiving messages is correct (from our previous fix)
  useEffect(() => {
    if (message) {
      const decoder = new TextDecoder();
      const state = JSON.parse(decoder.decode(message.payload)) as YoutubeState;
      const player = playerRef.current;
      // FIX: Also check if the player is fully ready before proceeding.
      if (!player || !isPlayerReady) return;

      isSyncing.current = true;

      switch (state.action) {
        case 'new_video':
          if (state.videoId) setVideoId(state.videoId);
          break;
        case 'play':
          player.playVideo();
          break;
        case 'pause':
          player.pauseVideo();
          break;
        case 'seek':
          if (state.currentTime !== undefined) player.seekTo(state.currentTime, true);
          break;
      }
      
      setTimeout(() => { isSyncing.current = false; }, 200);
    }
  }, [message]);


  const handleStateChange = (event: { data: number }) => {
    // FIX: Add the same connection guard here. This is the most critical one.
    if (isSyncing.current || !playerRef.current || connectionState !== ConnectionState.Connected) {
      return;
    }

    switch (event.data) {
      case 1: // Playing
        broadcastState({ action: 'play', currentTime: playerRef.current.getCurrentTime() });
        break;
      case 2: // Paused
        broadcastState({ action: 'pause', currentTime: playerRef.current.getCurrentTime() });
        break;
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // FIX: Add a guard to ensure we don't try to send before the connection is ready.
    if (connectionState !== ConnectionState.Connected) {
      alert('Not connected to the lobby yet. Please try again in a moment.');
      return;
    }

    const match = inputValue.match(YOUTUBE_VIDEO_ID_REGEX);
    if (match && match[1]) {
      const newVideoId = match[1];
      setVideoId(newVideoId);
      broadcastState({ action: 'new_video', videoId: newVideoId });
      setInputValue('');
    } else {
      alert('Invalid YouTube URL or ID');
    }
  };

   return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <div style={{ position: 'relative', paddingTop: '56.25%' }}>
        <YouTube
          videoId={videoId}
          onReady={(e) => {
            playerRef.current = e.target;
            // FIX: Set the player as ready.
            setIsPlayerReady(true);
          }}
          onStateChange={handleStateChange}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              // We can keep autoplay, the guard will prevent errors
              autoplay: 1,
              // Only the host should have controls to prevent conflicting actions
              controls: isHost ? 1 : 0,
              origin: typeof window !== 'undefined' ? window.location.origin : '',
            },
          }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </div>
      {/* Only show the share form to the host */}
      {isHost && (
        <form onSubmit={handleSearch} style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Paste YouTube URL to share"
            style={{ flexGrow: 1, padding: '8px' }}
          />
          <button type="submit" style={{ padding: '8px 16px' }}>Share</button>
        </form>
      )}
    </div>
  );
}
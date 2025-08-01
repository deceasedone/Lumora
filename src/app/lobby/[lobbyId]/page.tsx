// src/app/lobby/[lobbyId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';
import '@/styles/themes.css';


import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

export default function LobbyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const roomName = params.lobbyId as string;
  const userName = searchParams.get('username') || 'user-' + Math.floor(Math.random() * 1000);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!roomName) return;

    (async () => {
      try {
        const resp = await fetch(`/api/get-livekit-token?room=${roomName}&username=${userName}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error("Failed to fetch LiveKit token:", e);
      }
    })();
  }, [roomName, userName]);

  if (token === '') {
    return <div>Loading Lobby...</div>;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      audio={true}
      video={false}
      connect={true}
      className="lobby-layout"
    >
      {/* LeftPanel is the first grid item */}
      <LeftPanel />
      
      {/* RightPanel is the second grid item */}
      <RightPanel />
      
      {/* This component is required for audio but has no visual layout */}
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
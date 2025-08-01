// src/app/lobby/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import './join-lobby.css';
import '@/styles/themes.css';

export default function JoinLobbyPage() {
  const [lobbyCode, setLobbyCode] = useState('');
  const [userName, setUserName] = useState('');
  const router = useRouter();

  const handleJoinLobby = (e: React.FormEvent) => {
    e.preventDefault();
    if (lobbyCode && userName) {
      router.push(`/lobby/${lobbyCode}?username=${encodeURIComponent(userName)}`);
    }
  };

  const handleCreateLobby = () => {
    if (!userName) {
      alert('Please enter your name first!');
      return;
    }
    const newLobbyCode = nanoid(8);
    router.push(`/lobby/${newLobbyCode}?username=${encodeURIComponent(userName)}`);
  };

  return (
    <div className="join-lobby-container">
      <div className="join-lobby-card">
        <h1>Productivity Lobby</h1>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="join-lobby-input"
        />
        <form onSubmit={handleJoinLobby} className="join-form">
          <input
            type="text"
            value={lobbyCode}
            onChange={(e) => setLobbyCode(e.target.value)}
            placeholder="Enter lobby code"
            className="join-lobby-input"
          />
          <button type="submit" disabled={!userName || !lobbyCode} className="join-lobby-button primary">
            Join
          </button>
        </form>
        <p className="separator">or</p>
        <button onClick={handleCreateLobby} disabled={!userName} className="join-lobby-button secondary">
          Create a New Lobby
        </button>
      </div>
    </div>
  );
}
// app/test/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import YouTube from 'react-youtube';
import type { YouTubeProps } from 'react-youtube';
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from 'motion/react';
import { useAtom } from 'jotai';
import {
  AudioLines,
  BookText,
  Clock,
  Focus,
  SquareCheckBig,
  Video,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ThemeDropdown } from '@/components/theme-toggle';
import { Journal } from '@/components/journal';
import { AudioManager } from '@/components/beats';
import { Todo } from '@/components/todo';
import { Stopwatch } from '@/components/stopwatch';
import { openAmbientDrawerAtom, openJournalAtom } from '@/context/data';
import { ImmersiveLogo } from '@/components/ImmersiveLogo';

// --- Clock Component ---
function ClockDisplay() {
  const [time, setTime] = useState('');

  const updateTime = useCallback(() => {
    setTime(
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    updateTime(); // Initial call
    return () => clearInterval(interval);
  }, [updateTime]);

  return (
    <div style={{
      position: 'absolute',
      top: '1.25rem', 
      right: '1.25rem',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      backdropFilter: 'blur(4px)',
    }}>
      {time}
    </div>
  );
}

// --- Icon Components ---
// const SettingsIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
// );
const NextVideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
);
const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
);
// NEW: Pixabay Icon, replacing the Pexels one
const PixabayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.417 16.949c-.325.325-1.042.325-1.367 0-.325-.325-.325-1.042 0-1.367l1.367-1.367c.325-.325 1.042-.325 1.367 0 .325.325.325 1.042 0 1.367l-1.367 1.367zm.683-10.282c-.512 0-.927.415-.927.927v5.563c0 .512.415.927.927.927s.927-.415.927-.927v-5.563c0-.512-.415-.927-.927-.927zm3.467 6.833c-.512 0-.927.415-.927.927v2.099c0 .512.415.927.927.927s.927-.415.927-.927v-2.099c0-.512-.415-.927-.927-.927zm0-6.833c-.512 0-.927.415-.927.927v2.099c0 .512.415.927.927.927s.927-.415.927-.927v-2.099c0-.512-.415-.927-.927-.927zm3.467 3.416c-.512 0-.927.415-.927.927v5.563c0 .512.415.927.927.927s.927-.415.927-.927v-5.563c0-.512-.415-.927-.927-.927z"></path></svg>
);

// --- Main Page Component ---

export default function ImmersivePage() {
  const router = useRouter()

  // --- Manual Video Sources ---
  const youtubeVideoIds = ['B3y6xns0aq8', 'B9VRvOKKwfs', 'NoF-C-XQsiU'];
  // MODIFIED: Replaced Pexels URLs with Pixabay URLs
  const pixabayVideoUrls = [
    'https://cdn.pixabay.com/video/2025/06/17/286278_large.mp4', // Verba
    'https://cdn.pixabay.com/video/2025/05/04/276624_large.mp4', // Waves
  ];

  // --- State Management ---
  // MODIFIED: Updated player type to 'pixabay'
  const [activePlayer, setActivePlayer] = useState<'youtube' | 'pixabay' | 'custom'>('youtube');
  const [currentYoutubeIndex, setCurrentYoutubeIndex] = useState(0);
  // MODIFIED: Renamed state for clarity
  const [currentPixabayIndex, setCurrentPixabayIndex] = useState(0); 
  
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isJournalOpen, setJournalOpen] = useAtom(openJournalAtom);
  const [isAmbientDrawerOpen, setAmbientDrawerOpen] = useAtom(openAmbientDrawerAtom);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- Event Handlers ---
  const handleNextInPlaylist = () => {
    if (activePlayer === 'youtube') {
      setCurrentYoutubeIndex((prevIndex) => (prevIndex + 1) % youtubeVideoIds.length);
    } else if (activePlayer === 'pixabay') { // MODIFIED: Check for 'pixabay'
      setCurrentPixabayIndex((prevIndex) => (prevIndex + 1) % pixabayVideoUrls.length);
    }
  };

  const switchPlayer = (player: 'youtube' | 'pixabay' | 'custom') => { // MODIFIED: Update type
    setActivePlayer(player);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };


  return (
    <>
      <style jsx global>{`
        body, html { margin: 0; padding: 0; overflow: hidden; background-color: #000; }
        .video-background { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; }
        .video-background iframe, .video-background video {
          width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh;
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          pointer-events: none;
        }
      `}</style>

      <ClockDisplay />

      <div style={{
        position: 'fixed', top: '1.25rem', left: '1.25rem',
        display: 'flex', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.3)',
        padding: '0.5rem 1rem', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(4px)',
      }}>
        <button
          onClick={() => switchPlayer('youtube')}
          style={{
            background: 'none', border: 'none', color: 'white', padding: '0.5rem', cursor: 'pointer',
            opacity: activePlayer === 'youtube' ? 1 : 0.6,
          }}
          title="Switch to YouTube Playlist"
        >
          <YouTubeIcon />
        </button>
        <button
          onClick={() => switchPlayer('pixabay')}
          style={{
            background: 'none', border: 'none', color: 'white', padding: '0.5rem', cursor: 'pointer',
            opacity: activePlayer === 'pixabay' ? 1 : 0.6,
          }}
          title="Switch to Pixabay Playlist"
        >
          <PixabayIcon />
        </button>
      </div>

      <div className="video-background">
        {isClient && activePlayer === 'youtube' && (
          <YouTube
            key={youtubeVideoIds[currentYoutubeIndex]}
            videoId={youtubeVideoIds[currentYoutubeIndex]}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 1,
                controls: 0,
                rel: 0,
                showinfo: 0,
                modestbranding: 1,
                loop: 1,
                fs: 0,
                cc_load_policy: 0,
                iv_load_policy: 3,
                autohide: 0,
                mute: 1,
                playlist: youtubeVideoIds[currentYoutubeIndex],
                vq: 'hd1080',
                origin: window.location.origin,
                enablejsapi: 1,
                widget_referrer: window.location.href,
              },
            }}
          />
        )}
        {/* MODIFIED: Render based on 'pixabay' player and use its state/data */}
        {activePlayer === 'pixabay' && (
          <video
            key={pixabayVideoUrls[currentPixabayIndex]}
            src={pixabayVideoUrls[currentPixabayIndex]}
            autoPlay loop muted playsInline
          />
        )}
      </div>

      <main>

        <button
          onClick={handleNextInPlaylist}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem',
            background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%', width: '50px', height: '50px', display: 'flex',
            justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: 'white'
          }}
          aria-label="Next in Playlist"
          title="Next in Playlist"
        >
          <NextVideoIcon />
        </button>

        <motion.div
          className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm"
          animate={{ width: isToolbarOpen ? 'auto' : 56 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsToolbarOpen(!isToolbarOpen)}
            className="h-10 w-10 flex-shrink-0 rounded-full hover:bg-white/20"
          >
            <ImmersiveLogo className="h-6 w-6" />
          </Button>

          <AnimatePresence>
            {isToolbarOpen && (
              <motion.div
                className="flex items-center gap-1 overflow-hidden"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="rounded-full hover:bg-white/20" title="Exit Immersive Mode">
                  <ChevronLeft />
                </Button>
                  <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="rounded-full hover:bg-white/20" title="Toggle Fullscreen">
                    <Focus />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setAmbientDrawerOpen(!isAmbientDrawerOpen)} className="rounded-full hover:bg-white/20" title="Ambient Sounds">
                    <AudioLines />
                  </Button>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ThemeDropdown />
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20" title="Tasks">
                      <SquareCheckBig />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[var(--popover)] p-0">
                    <DialogHeader className="p-4 pb-0">
                      <DialogTitle>Your Tasks</DialogTitle>
                    </DialogHeader>
                    <div className="h-[60vh] p-4 pt-2">
                      <Todo />
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" onClick={() => setJournalOpen(true)} className="rounded-full hover:bg-white/20" title="Journal">
                  <BookText />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20" title="Focus Timer">
                      <Clock />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[var(--popover)] p-4">
                    <DialogHeader>
                      <DialogTitle>Focus Timer</DialogTitle>
                    </DialogHeader>
                    <Stopwatch />
                  </DialogContent>
                </Dialog>

                {/* Placeholder Buttons */}
                <Button variant="ghost" size="icon" onClick={() => alert('My Selections clicked')} className="rounded-full hover:bg-white/20" title="My Selections">
                  <Sparkles />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => alert('Change Wallpaper clicked')} className="rounded-full hover:bg-white/20" title="Change Wallpaper">
                  <Video />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      
      <Journal />
      <div className="hidden">
        <AudioManager />
      </div>
     
    </>
  );
}
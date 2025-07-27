"use client";

import React, { useState, useEffect, useCallback } from 'react';
import YouTube from 'react-youtube';
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from 'framer-motion';
import { useAtom } from 'jotai';
import {
  AudioLines,
  BookText,
  Clock,
  Focus,
  SquareCheckBig,
  Video,
  Sparkles,
  ChevronLeft,
  Shuffle,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ThemeDropdown } from '@/components/theme-toggle';
import { Journal } from '@/components/journal';
import { AudioManager } from '@/components/beats';
import { Todo } from '@/components/todo';
import { Stopwatch } from '@/components/stopwatch';
import { openAmbientDrawerAtom, openJournalAtom } from '@/context/data';
import { ImmersiveLogo } from '@/components/ImmersiveLogo';
import { wallpaperData, allWallpapers, Wallpaper } from '@/lib/wallpaper-data'; // Ensure this path is correct

// --- Helper Icon Components ---
const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
);
const PixabayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.417 16.949c-.325.325-1.042.325-1.367 0-.325-.325-.325-1.042 0-1.367l1.367-1.367c.325-.325 1.042-.325 1.367 0 .325.325.325 1.042 0 1.367l-1.367 1.367zm.683-10.282c-.512 0-.927.415-.927.927v5.563c0 .512.415.927.927.927s.927-.415.927-.927v-5.563c0-.512-.415-.927-.927-.927zm3.467 6.833c-.512 0-.927.415-.927.927v2.099c0 .512.415.927.927.927s.927-.415.927-.927v-2.099c0-.512-.415-.927-.927-.927zm0-6.833c-.512 0-.927.415-.927.927v2.099c0 .512.415.927.927.927s.927-.415.927-.927v-2.099c0-.512-.415-.927-.927-.927zm3.467 3.416c-.512 0-.927.415-.927.927v5.563c0 .512.415.927.927.927s.927-.415.927-.927v-5.563c0-.512-.415-.927-.927-.927z"></path></svg>
);


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


// --- Main Page Component ---
export default function ImmersivePage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("authToken")) {
      router.push("/auth");
    }
  }, [router]);

  // --- State Management ---
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(wallpaperData.mySelections[0]);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isJournalOpen, setJournalOpen] = useAtom(openJournalAtom);
  const [isAmbientDrawerOpen, setAmbientDrawerOpen] = useAtom(openAmbientDrawerAtom);
  
  // State for the "Change Wallpaper" popover navigation
  const [changeSource, setChangeSource] = useState<'youtube' | 'pixabay' | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- Event Handlers ---
  const handleRandomWallpaper = () => {
    const filteredWallpapers = allWallpapers.filter(w => w.id !== currentWallpaper.id);
    const randomIndex = Math.floor(Math.random() * filteredWallpapers.length);
    setCurrentWallpaper(filteredWallpapers[randomIndex]);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
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
      
      <div className="video-background">
        {isClient && currentWallpaper.type === 'youtube' && (
          <YouTube
            key={currentWallpaper.id}
            videoId={currentWallpaper.id}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 1, controls: 0, rel: 0, showinfo: 0, modestbranding: 1,
                loop: 1, fs: 0, cc_load_policy: 0, iv_load_policy: 3, autohide: 0,
                mute: 1, playlist: currentWallpaper.id, vq: 'hd1080',
                origin: typeof window !== 'undefined' ? window.location.origin : '',
                enablejsapi: 1, widget_referrer: typeof window !== 'undefined' ? window.location.href : '',
              },
            }}
            className="video-background"
          />
        )}
        {currentWallpaper.type === 'pixabay' && (
          <video
            key={currentWallpaper.id}
            src={currentWallpaper.id}
            autoPlay loop muted playsInline
            className="video-background"
          />
        )}
      </div>

      <main>
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

                {/* --- TOOLBAR WIDGETS --- */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20" title="Tasks">
                      <SquareCheckBig />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[var(--popover)] p-0">
                    <DialogHeader className="p-4 pb-0"><DialogTitle>Your Tasks</DialogTitle></DialogHeader>
                    <div className="h-[60vh] p-4 pt-2"><Todo /></div>
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
                    <DialogHeader><DialogTitle>Focus Timer</DialogTitle></DialogHeader>
                    <Stopwatch />
                  </DialogContent>
                </Dialog>

                {/* --- NEW WALLPAPER CONTROLS --- */}
                <Button variant="ghost" size="icon" onClick={handleRandomWallpaper} className="rounded-full hover:bg-white/20" title="Random Wallpaper">
                    <Shuffle />
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20" title="My Selections">
                      <Sparkles />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="space-y-1">
                      <h4 className="px-2 py-1.5 text-sm font-semibold">My Selections</h4>
                      {wallpaperData.mySelections.map((wallpaper) => (
                        <Button key={wallpaper.id} variant="ghost" className="w-full justify-start" onClick={() => setCurrentWallpaper(wallpaper)}>
                          {wallpaper.name}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover onOpenChange={() => setChangeSource(null)}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20" title="Change Wallpaper">
                      <Video />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    {!changeSource ? (
                      <div className="space-y-1">
                         <h4 className="px-2 py-1.5 text-sm font-semibold">Choose Source</h4>
                         <Button variant="ghost" className="w-full justify-start" onClick={() => setChangeSource('youtube')}><YouTubeIcon /> <span className="ml-2">YouTube</span></Button>
                         <Button variant="ghost" className="w-full justify-start" onClick={() => setChangeSource('pixabay')}><PixabayIcon /> <span className="ml-2">Pixabay</span></Button>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-2 flex items-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setChangeSource(null)}><ArrowLeft className="h-4 w-4" /></Button>
                          <h4 className="ml-2 text-sm font-semibold capitalize">{changeSource} Categories</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {(changeSource === 'youtube' ? wallpaperData.youtube : wallpaperData.pixabay).map((category) => (
                            <Button key={category.name} variant="outline" className="flex h-16 flex-col items-center justify-center gap-1 p-1" onClick={() => setCurrentWallpaper(category.wallpapers[0])}>
                              <category.icon className="h-5 w-5" />
                              <span className="text-xs text-center">{category.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

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
// This interface defines the shape for all our video wallpapers.
// It's now in one central place.
export interface Wallpaper {
    id: string | number;
    name: string;
    type: "youtube" | "pixabay" | "custom"; // Added 'pixabay'
    videoUrl: string;
    audioUrl?: string;
  }
  
  // Your original YouTube videos
  export const YOUTUBE_WALLPAPERS: Wallpaper[] = [
    {
      id: "yt-cosmic-ocean",
      name: "Cosmic Ocean",
      type: "youtube",
      videoUrl: "https://www.youtube.com/watch?v=bn9F19Hi1Lk",
    },
    {
      id: "yt-kyoto-streets",
      name: "Kyoto Streets",
      type: "youtube",
      videoUrl: "https://www.youtube.com/watch?v=AMNyQds2ABQ",
    },
    {
      id: "yt-fantasy-world",
      name: "Fantasy World",
      type: "youtube",
      videoUrl: "https://www.youtube.com/watch?v=9vBNMocy46E",
    },
  ];
  
  // The new Pixabay videos you provided
  export const PIXABAY_WALLPAPERS: Wallpaper[] = [
      {
          id: 'pixa-verba-branch',
          name: 'Verba Branch',
          type: 'pixabay',
          videoUrl: 'https://cdn.pixabay.com/video/2025/06/17/286278_large.mp4'
      },
      {
          id: 'pixa-ocean-waves',
          name: 'Ocean Waves',
          type: 'pixabay',
          videoUrl: 'https://pixabay.com/videos/download/video-276624_large.mp4'
      }
  ];
  
  // Your custom video+audio selections
  export const CUSTOM_WALLPAPERS: Wallpaper[] = [
    {
      id: "custom-rainy-knight",
      name: "Rainy Knight",
      type: "custom",
      videoUrl: "https://www.youtube.com/watch?v=B3y6xns0aq8",
      audioUrl: "https://www.youtube.com/watch?v=B3y6xns0aq8",
    },
    {
      id: "custom-space-odyssey",
      name: "Space Odyssey",
      type: "custom",
      videoUrl: "https://www.youtube.com/watch?v=B9VRvOKKwfs",
      audioUrl: "https://www.youtube.com/watch?v=B9VRvOKKwfs",
    },
  ];
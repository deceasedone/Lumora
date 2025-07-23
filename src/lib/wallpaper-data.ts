import { Mountain, Building2, Rocket, Star, type LucideIcon } from 'lucide-react';

export interface Wallpaper {
  id: string; // YouTube ID or Pixabay URL
  type: 'youtube' | 'pixabay';
  name: string;
}

export interface Category {
  name:string;
  icon: LucideIcon;
  wallpapers: Wallpaper[];
}

// Handpick your wallpapers here
export const wallpaperData: {
  mySelections: Wallpaper[];
  youtube: Category[];
  pixabay: Category[];
} = {
  mySelections: [
    { id: '4xDzrQps5uI', type: 'youtube', name: 'Lofi Girl' },
    { id: 'https://cdn.pixabay.com/video/2023/08/24/175612-856942422_large.mp4', type: 'pixabay', name: 'Anime Cafe' },
    { id: 'jfKfPfyJRdk', type: 'youtube', name: 'Synthwave Boy' },
  ],
  youtube: [
    {
      name: 'Anime & Lofi',
      icon: Star,
      wallpapers: [
        { id: '4xDzrQps5uI', type: 'youtube', name: 'Lofi Girl' },
        { id: 'jfKfPfyJRdk', type: 'youtube', name: 'Synthwave Boy' },
        { id: 'B3y6xns0aq8', type: 'youtube', name: 'Cozy Room' },
      ],
    },
    {
      name: 'Nature',
      icon: Mountain,
      wallpapers: [
        { id: 'B9VRvOKKwfs', type: 'youtube', name: 'Forest Stream' },
        { id: 'NoF-C-XQsiU', type: 'youtube', name: 'Ocean Waves' },
      ],
    },
  ],
  pixabay: [
    {
      name: 'Nature',
      icon: Mountain,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2025/06/17/286278_large.mp4', type: 'pixabay', name: 'Verba' },
        { id: 'https://cdn.pixabay.com/video/2025/05/04/276624_large.mp4', type: 'pixabay', name: 'Waves' },
        { id: 'https://cdn.pixabay.com/video/2024/04/12/207001-931962916_large.mp4', type: 'pixabay', name: 'Mountain River' },
      ],
    },
    {
      name: 'City',
      icon: Building2,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2024/04/24/207899-934832560_large.mp4', type: 'pixabay', name: 'Night City' },
        { id: 'https://cdn.pixabay.com/video/2019/04/23/23018-334327211_large.mp4', type: 'pixabay', name: 'Hong Kong' },
      ],
    },
    {
      name: 'Space',
      icon: Rocket,
      wallpapers: [
        { id: 'https://cdn.pixabay.com/video/2020/04/05/34821-410939022_large.mp4', type: 'pixabay', name: 'Galaxy' },
        { id: 'https://cdn.pixabay.com/video/2021/09/20/89047-619982498_large.mp4', type: 'pixabay', name: 'Earth' },
      ],
    },
  ],
};

export const allWallpapers: Wallpaper[] = [
  ...wallpaperData.mySelections,
  ...wallpaperData.youtube.flatMap(cat => cat.wallpapers),
  ...wallpaperData.pixabay.flatMap(cat => cat.wallpapers),
].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i); // Remove duplicates
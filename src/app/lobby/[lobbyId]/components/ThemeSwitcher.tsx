'use client';

import { useTheme } from 'next-themes';
import { themes } from '@/styles/themes';
import { Palette } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const { setTheme, theme: currentTheme } = useTheme();

  return (
    <div className="theme-switcher-container">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Change Theme">
            <Palette className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-60 max-h-[50vh] overflow-y-auto p-2"
          sideOffset={8}
        >
          <div className="grid grid-cols-2 gap-1">
            {themes.map(theme => (
              <DropdownMenuItem
                key={theme}
                onClick={() => setTheme(theme)}
                className={`
                  relative flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium
                  transition-all duration-200 hover:bg-accent hover:text-accent-foreground
                  ${currentTheme === theme ? 'bg-accent text-accent-foreground ring-2 ring-primary' : 'text-muted-foreground'}
                  focus:bg-accent focus:text-accent-foreground
                  group cursor-pointer
                `}
              >
                <span className="truncate">
                  {theme.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
                {currentTheme === theme && (
                  <div className="absolute right-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

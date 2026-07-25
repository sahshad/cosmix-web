'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuthThemeToggleProps {
  side?: 'left' | 'right';
}

export function AuthThemeToggle({ side = 'right' }: AuthThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'absolute top-6 lg:top-8 rounded-full z-50 text-muted-foreground hover:bg-secondary transition-colors',
        side === 'left' ? 'left-6 lg:left-10' : 'right-6 lg:right-10'
      )}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

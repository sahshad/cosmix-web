'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, Bell } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function MobileHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 10) {
      setIsVisible(true);
      return;
    }

    if (currentScrollY > lastScrollY.current + 5) {
      setIsVisible(false);
    } else if (currentScrollY < lastScrollY.current - 5) {
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={`flex h-14 shrink-0 items-center justify-between gap-2 transition-all duration-500 ease-in-out lg:hidden border-b border-border/5 px-4 bg-background/80 backdrop-blur-xl sticky top-0 z-50 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9 bg-secondary/50 rounded-lg text-vivid-blue" />
        <span className="text-sm font-black tracking-widest text-vivid-blue">COSMIX</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
          <Search className="h-5 w-5 text-muted-foreground" />
        </button>
        <Link
          href="/notifications"
          className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors relative"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <div className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-vivid-red rounded-full ring-2 ring-background" />
        </Link>
      </div>
    </header>
  );
}

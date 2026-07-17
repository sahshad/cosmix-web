'use client';

import Link from 'next/link';
import { Compass, MoveLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden px-6 selection:bg-vivid-blue/30">
      {/* Background Decorative Blur */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vivid-blue/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#8b5cf6]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Cosmos Icon Wrapper */}
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-vivid-blue to-vivid-blue-dark rounded-[2rem] flex items-center justify-center shadow-2xl shadow-vivid-blue/20 rotate-12 hover:rotate-0 transition-transform duration-500">
          <Compass className="h-12 w-12 text-white animate-[spin_60s_linear_infinite]" />
        </div>

        <div className="space-y-3">
          <h1 className="text-7xl font-black tracking-tighter text-vivid-blue">
            404
          </h1>
          <h2 className="text-2xl font-bold tracking-tight">
            Lost in the Cosmos
          </h2>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed">
            The page you are looking for has drifted into deep space or never existed. Let&apos;s get you back to the home orbit.
          </p>
        </div>

        <div className="pt-2">
          <Button
            asChild
            className="rounded-full bg-vivid-blue hover:bg-vivid-blue-hover text-white px-8 h-12 font-bold transition-all shadow-lg shadow-vivid-blue/20 hover:scale-105 active:scale-95 text-sm"
          >
            <Link href="/">
              <MoveLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/30 text-[10px] font-black tracking-widest uppercase pointer-events-none">
        Cosmix Orbit Control
      </div>
    </main>
  );
}

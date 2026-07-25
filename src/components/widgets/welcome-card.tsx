'use client';

import { Sparkles } from 'lucide-react';

interface WelcomeCardProps {
  name?: string;
  subtitle?: string;
}

export function WelcomeCard({
  name = 'there',
  subtitle = 'Ready to see what the cosmos is up to?',
}: WelcomeCardProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="bg-linear-to-br from-vivid-blue to-vivid-blue-dark rounded-md p-8 text-white shadow-2xl shadow-vivid-blue/20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 blur-[60px] rounded-full group-hover:scale-110 transition-transform duration-700" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 tracking-tight">
            {greeting}, {name}!
          </h1>
          <p className="text-white/80 font-medium text-sm">{subtitle}</p>
        </div>
        <div className="hidden sm:flex h-12 w-12 bg-white/10 rounded-2xl items-center justify-center backdrop-blur-xl border border-white/20 rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-lg">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

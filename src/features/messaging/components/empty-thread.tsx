'use client';

import { MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyThreadProps {
  onNewConversation: () => void;
}

export function EmptyThread({ onNewConversation }: EmptyThreadProps) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden rounded-md border border-dashed border-border bg-card/50 px-8 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-vivid-blue/8 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-vivid-green/8 blur-3xl" />
      </div>

      <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-vivid-blue to-vivid-blue-dark text-white shadow-xl shadow-vivid-blue/20">
        <MessageCircle className="h-7 w-7" />
        <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-vivid-yellow" />
      </div>

      <div className="relative max-w-sm">
        <h2 className="text-base font-black tracking-tight text-foreground">Your messages</h2>
        <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-muted-foreground">
          Select a conversation from the list, or start a new one with someone you follow.
        </p>
      </div>

      <Button
        type="button"
        onClick={onNewConversation}
        className="relative rounded-full bg-vivid-blue px-5 text-white shadow-md shadow-vivid-blue/20 hover:bg-vivid-blue/90"
      >
        <MessageCircle className="h-4 w-4" />
        New message
      </Button>
    </div>
  );
}

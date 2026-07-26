"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Audience = "Public" | "Followers" | "Private";

const OPTIONS: { value: Audience; description: string }[] = [
  { value: "Public", description: "Anyone can see it" },
  { value: "Followers", description: "Only people who follow you" },
  { value: "Private", description: "Only you can see it" },
];

interface AudienceMenuProps {
  value: Audience;
  onChange: (value: Audience) => void;
}

/**
 * Client-side only — there's no visibility field on the backend yet, so this
 * changes the displayed label but doesn't actually restrict who can see the post.
 */
export function AudienceMenu({ value, onChange }: AudienceMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="mt-0.5 inline-flex items-center gap-1 bg-transparent border-0 p-0 cursor-pointer text-[12.5px] text-muted-foreground hover:text-foreground transition-colors"
        >
          to <u className="underline decoration-dotted decoration-border underline-offset-2">{value}</u>
          <ChevronDown className="h-2.5 w-2.5" strokeWidth={3} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="rounded-[10px] shadow-lg border-border/60 z-50 p-1.5 min-w-56">
        {OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="rounded-lg cursor-pointer gap-2 items-start py-2 px-2.5 hover:bg-secondary"
          >
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">{opt.value}</p>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">{opt.description}</p>
            </div>
            {value === opt.value && <Check className="h-3.5 w-3.5 text-vivid-blue mt-0.5 shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { actionButtonClass } from "./styles";

interface ShareButtonProps {
  onClick?: () => void;
}

export function ShareButton({ onClick }: ShareButtonProps) {
  return (
    <Button
      variant="ghost"
      className={actionButtonClass}
      onClick={onClick}
      aria-label="Share post"
    >
      <Share2 className="h-4.5 w-4.5 shrink-0" />
      <span className="hidden sm:inline truncate">Share</span>
    </Button>
  );
}

"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { actionButtonClass } from "./styles";

interface BookmarkButtonProps {
  onClick?: () => void;
}

export function BookmarkButton({ onClick }: BookmarkButtonProps) {
  return (
    <Button
      variant="ghost"
      className={actionButtonClass}
      onClick={onClick}
      aria-label="Bookmark post"
    >
      <Bookmark className="h-4.5 w-4.5" />
      Save
    </Button>
  );
}

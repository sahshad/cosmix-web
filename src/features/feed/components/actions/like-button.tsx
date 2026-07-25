"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { actionButtonClass } from "./styles";

interface LikeButtonProps {
  isLiked: boolean;
  onLike: () => void;
}

export function LikeButton({ isLiked, onLike }: LikeButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(actionButtonClass, isLiked && "text-vivid-red hover:text-vivid-red")}
      onClick={onLike}
      aria-label={isLiked ? "Unlike post" : "Like post"}
    >
      <Heart className={cn("h-4.5 w-4.5", isLiked && "fill-current")} />
      Like
    </Button>
  );
}

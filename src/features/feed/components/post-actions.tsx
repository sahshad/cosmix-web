"use client";

import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  isLiked: boolean;
  onLike: () => void;
  onCommentClick?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

const actionButtonClass =
  "flex-1 h-11 gap-2 font-medium text-[13.5px] text-muted-foreground cursor-pointer hover:bg-transparent dark:hover:bg-transparent hover:text-foreground";

export function PostActions({
  isLiked,
  onLike,
  onCommentClick,
  onShare,
  onBookmark,
}: PostActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        className={cn(
          actionButtonClass,
          isLiked && "text-vivid-red hover:text-vivid-red"
        )}
        onClick={onLike}
        aria-label={isLiked ? "Unlike post" : "Like post"}
      >
        <Heart className={cn("h-4.5 w-4.5", isLiked && "fill-current")} />
        Like
      </Button>

      <Button
        variant="ghost"
        className={actionButtonClass}
        onClick={onCommentClick}
        aria-label="Focus comment input"
      >
        <MessageCircle className="h-4.5 w-4.5" />
        Comment
      </Button>

      <Button
        variant="ghost"
        className={actionButtonClass}
        onClick={onShare}
        aria-label="Share post"
      >
        <Share2 className="h-4.5 w-4.5" />
        Share
      </Button>

      <Button
        variant="ghost"
        className={actionButtonClass}
        onClick={onBookmark}
        aria-label="Bookmark post"
      >
        <Bookmark className="h-4.5 w-4.5" />
        Save
      </Button>
    </div>
  );
}

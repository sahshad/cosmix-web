"use client";

import { Heart, MessageCircle, Share2, Bookmark, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isCommenting: boolean;
  onLike: () => void;
  onCommentToggle: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onSend?: () => void;
}

export function PostActions({
  likesCount,
  commentsCount,
  isLiked,
  isCommenting,
  onLike,
  onCommentToggle,
  onShare,
  onBookmark,
  onSend,
}: PostActionsProps) {
  return (
    <div className="mx-6 sm:mx-8 my-1">
      <div className="bg-secondary/30 border border-border/50 rounded-full px-3 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div className="flex items-center gap-1">
          {/* Like Button */}
          <Button
            variant="ghost"
            className="h-10 rounded-full px-4 gap-2 text-muted-foreground hover:bg-transparent dark:hover:bg-transparent hover:text-vivid-red transition-all font-bold"
            onClick={onLike}
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            <Heart
              className={`h-[18px] w-[18px] transition-transform ${
                isLiked ? "fill-current text-vivid-red scale-110" : ""
              }`}
            />
            <span className={isLiked ? "text-vivid-red" : ""}>{likesCount}</span>
          </Button>

          {/* Comment Toggle Button */}
          <Button
            variant="ghost"
            className={`h-10 rounded-full px-4 gap-2 transition-all font-bold ${
              isCommenting
                ? "bg-vivid-blue/10 text-vivid-blue dark:hover:bg-vivid-blue/20"
                : "text-muted-foreground hover:bg-transparent dark:hover:bg-transparent hover:text-vivid-blue"
            }`}
            onClick={onCommentToggle}
            aria-label="Toggle comment section"
          >
            <MessageCircle className="h-[18px] w-[18px]" />
            <span>{commentsCount}</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {/* Share Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-muted-foreground hover:bg-transparent dark:hover:bg-transparent hover:text-vivid-green transition-all"
            onClick={onShare}
            aria-label="Share post"
          >
            <Share2 className="h-[18px] w-[18px]" />
          </Button>

          {/* Bookmark Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-muted-foreground hover:bg-transparent dark:hover:bg-transparent hover:text-vivid-blue transition-all"
            onClick={onBookmark}
            aria-label="Bookmark post"
          >
            <Bookmark className="h-[18px] w-[18px]" />
          </Button>

          {/* Send Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-muted-foreground hover:bg-transparent dark:hover:bg-transparent hover:text-foreground transition-all"
            onClick={onSend}
            aria-label="Send direct message"
          >
            <Send className="h-[18px] w-[18px]" />
          </Button>
        </div>
      </div>
    </div>
  );
}

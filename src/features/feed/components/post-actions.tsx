"use client";

import { LikeButton, CommentButton, ShareButton, BookmarkButton } from "./actions";

interface PostActionsProps {
  isLiked: boolean;
  onLike: () => void;
  onCommentClick?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export function PostActions({
  isLiked,
  onLike,
  onCommentClick,
  onShare,
  onBookmark,
}: PostActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <LikeButton isLiked={isLiked} onLike={onLike} />
      <CommentButton onClick={onCommentClick} />
      <ShareButton onClick={onShare} />
      <BookmarkButton onClick={onBookmark} />
    </div>
  );
}

"use client";

import { BadgeCheck, Pencil, Trash2 } from "lucide-react";
import { OptionsMenu, UserAvatar } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { cn, formatRelativeTime, getAvatarPalette, getInitials } from "@/lib/utils";
import { PostResponse as PostData } from "@/types/post";
export type { PostResponse } from "@/types/post";
export type { PostData };
export type { User } from "@/types/user";
import { PostActions } from "./post-actions";
import { PostCommentSection } from "./post-comment-section";
import { PostComposerDialog } from "./post-composer-dialog";
import { useDeletePost } from "@/hooks/useFeed";

interface PostCardProps {
  post: PostData;
  onLike?: (postId: number | string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const shouldFocusOnOpenRef = useRef(false);
  const [showComments, setShowComments] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  useEffect(() => {
    if (showComments && shouldFocusOnOpenRef.current) {
      composerRef.current?.focus();
      shouldFocusOnOpenRef.current = false;
    }
  }, [showComments]);

  const handleCommentClick = () => {
    if (!showComments) {
      shouldFocusOnOpenRef.current = true;
      setShowComments(true);
    } else {
      composerRef.current?.focus();
    }
  };

  const authorPalette = getAvatarPalette(post.user?.username || post.user?.displayName);

  return (
    <Card className="border border-border shadow-none rounded-[14px] bg-card overflow-hidden gap-0 py-5">
      {/* Header */}
      <div className="px-5 sm:px-6 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 cursor-pointer group/author">
          <UserAvatar
            src={post.user?.avatarUrl}
            alt={post.user.displayName}
            fallback={getInitials(post.user?.displayName)}
            className="h-10 w-10 flex-shrink-0"
            fallbackClassName={cn(authorPalette.bg, authorPalette.text, "font-semibold")}
          />
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1 leading-none">
              <span className="font-semibold text-[14px] text-foreground group-hover/author:underline truncate">
                {post.user?.displayName}
              </span>
              {post.user.isVerified && (
                <BadgeCheck className="h-3.5 w-3.5 text-vivid-blue fill-vivid-blue/10 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1 leading-none">
              <p className="text-muted-foreground text-[12.5px] truncate">
                @{post.user.username}
              </p>
              <span className="text-muted-foreground/50 text-[4px] self-center">●</span>
              <p className="text-muted-foreground text-[12.5px] flex-shrink-0">
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <OptionsMenu
          triggerClassName="-mt-1"
          items={
            post.isOwner
              ? [
                  { icon: Pencil, label: "Edit post", onClick: () => setIsEditOpen(true) },
                  {
                    icon: Trash2,
                    label: "Delete post",
                    onClick: () => deletePost(post.id),
                    disabled: isDeleting,
                    destructive: true,
                  },
                ]
              : [
                  { label: `Unfollow ${post.user.username}` },
                  { label: `Mute ${post.user.username}` },
                  { label: "Report post", destructive: true, separatorBefore: true },
                ]
          }
        />
      </div>

      {/* Content */}
      <div className="px-5 sm:px-6 mt-3">
        <p className="text-foreground leading-relaxed text-[14.5px] break-words">
          {post.content}
        </p>
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="mt-4 mx-5 sm:mx-6 rounded-[8px] overflow-hidden border border-border relative group/media cursor-pointer aspect-[16/10] min-h-[220px] max-h-[480px]">
          <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/5 transition-colors z-10" />
          <img
            src={post.media[0].url}
            alt="Post attachment"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      {/* Stats summary */}
      <div className="mt-4 px-5 sm:px-6 flex items-center justify-between text-[13px] text-muted-foreground">
        <span>{post.likesCount.toLocaleString()} likes</span>
        <span>
          {post.commentsCount.toLocaleString()} comments ·{" "}
          {(post.sharesCount ?? 0).toLocaleString()} shares
        </span>
      </div>

      <Separator className="mt-3 bg-border/70" />

      {/* Actions */}
      <div className="px-3 sm:px-4 pt-1">
        <PostActions
          isLiked={post.isLiked}
          onLike={() => onLike?.(post.id)}
          onCommentClick={handleCommentClick}
        />
      </div>

      {/* Comments */}
      {showComments && (
        <PostCommentSection
          postId={post.id}
          composerRef={composerRef}
          onClose={() => setShowComments(false)}
        />
      )}

      <PostComposerDialog
        mode="edit"
        postId={post.id}
        initialContent={post.content}
        initialMedia={post.media}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </Card>
  );
}

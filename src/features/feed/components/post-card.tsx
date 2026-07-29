"use client";

import Link from "next/link";
import { BadgeCheck, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog, OptionsMenu, UserAvatar } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { cn, formatRelativeTime, getAvatarPalette, getInitials } from "@/lib/utils";
import { PostResponse as PostData } from "../types";
export type { PostResponse } from "../types";
export type { PostData };
export type { User } from "@/types/user";
import { PostActions } from "./post-actions";
import { PostCommentSection } from "./comments/post-comment-section";
import { PostComposerDialog } from "./post-composer-dialog";
import { MediaCarousel } from "./media-carousel";
import { useDeletePost } from "../hooks/useFeed";

interface PostCardProps {
  post: PostData;
  onLike?: (postId: number | string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const shouldFocusOnOpenRef = useRef(false);
  const [showComments, setShowComments] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
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
    <Card
      data-post-id={post.id}
      className="scroll-mt-20 border border-border shadow-none rounded-md bg-card overflow-hidden gap-0 py-4 sm:py-5 transition-shadow"
    >
      {/* Header */}
      <div className="px-4 sm:px-6 flex items-start justify-between gap-3">
        <Link
          href={`/profile/${post.user.username}`}
          className="flex items-center gap-3 min-w-0 cursor-pointer group/author"
        >
          <UserAvatar
            src={post.user?.avatarUrl}
            alt={post.user.displayName}
            fallback={getInitials(post.user?.displayName)}
            className="h-10 w-10 shrink-0"
            fallbackClassName={cn(authorPalette.bg, authorPalette.text, "font-semibold")}
          />
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1 leading-none">
              <span className="font-semibold text-[14px] text-foreground group-hover/author:underline truncate">
                {post.user?.displayName}
              </span>
              {post.user.isVerified && (
                <BadgeCheck className="h-3.5 w-3.5 text-vivid-blue fill-vivid-blue/10 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1 leading-none">
              <p className="text-muted-foreground text-[12.5px] truncate">
                @{post.user.username}
              </p>
              <span className="text-muted-foreground/50 text-[4px] self-center">●</span>
              <p className="text-muted-foreground text-[12.5px] shrink-0">
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>
        </Link>
        <OptionsMenu
          triggerClassName="-mt-1"
          items={
            post.isOwner
              ? [
                  { icon: Pencil, label: "Edit post", onClick: () => setIsEditOpen(true) },
                  {
                    icon: Trash2,
                    label: "Delete post",
                    onClick: () => setIsDeleteConfirmOpen(true),
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
      <div className="px-4 sm:px-6 mt-3">
        <p className="text-foreground leading-relaxed text-[14.5px] wrap-break-word">
          {post.content}
        </p>
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && <MediaCarousel items={post.media} />}

      {/* Stats summary */}
      <div className="mt-4 px-4 sm:px-6 flex items-center justify-between text-[13px] text-muted-foreground">
        <span>{post.likesCount.toLocaleString()} likes</span>
        <span>
          {post.commentsCount.toLocaleString()} comments ·{" "}
          {(post.sharesCount ?? 0).toLocaleString()} shares
        </span>
      </div>

      <Separator className="mt-3 bg-border/70" />

      {/* Actions */}
      <div className="px-3 sm:px-4 pt-1 min-w-0">
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

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete post?"
        description="This can't be undone. The post will be permanently removed."
        confirmLabel="Delete"
        destructive
        isConfirming={isDeleting}
        onConfirm={() =>
          deletePost(post.id, { onSuccess: () => setIsDeleteConfirmOpen(false) })
        }
      />
    </Card>
  );
}

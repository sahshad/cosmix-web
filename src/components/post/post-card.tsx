"use client";

import { BadgeCheck, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { cn, formatRelativeTime, getAvatarPalette, getInitials } from "@/lib/utils";
import { PostResponse as PostData } from "@/types/post";
export type { PostResponse } from "@/types/post";
export type { PostData };
export type { User } from "@/types/user";
import { PostActions } from "./post-actions";
import { PostCommentSection } from "./post-comment-section";
import { useDeletePost, useUpdatePost } from "@/hooks/useFeed";

interface PostCardProps {
  post: any;
  onLike?: (postId: number | string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const shouldFocusOnOpenRef = useRef(false);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

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

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;
    updatePost(
      { id: post.id, content: editContent.trim() },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setIsEditing(false);
  };

  const authorPalette = getAvatarPalette(post.user?.username || post.user?.displayName);

  return (
    <Card className="border border-border shadow-none rounded-[14px] bg-card overflow-hidden gap-0 py-5">
      {/* Header */}
      <div className="px-5 sm:px-6 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 cursor-pointer group/author">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage
              src={post.user?.avatarUrl}
              alt={post.user.displayName}
            />
            <AvatarFallback className={cn(authorPalette.bg, authorPalette.text, "font-semibold")}>
              {getInitials(post.user?.displayName)}
            </AvatarFallback>
          </Avatar>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground flex-shrink-0 -mt-1"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-[10px] shadow-lg border-border/60 min-w-[190px] z-50 p-1.5"
          >
            {post.isOwner ? (
              <>
                <DropdownMenuItem
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg py-2 px-3 cursor-pointer gap-2 font-medium text-[13px] hover:bg-secondary"
                >
                  <Pencil className="h-4 w-4" />
                  Edit post
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isDeleting}
                  onClick={() => deletePost(post.id)}
                  className="rounded-lg py-2 px-3 cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 font-medium text-[13px]"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete post
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem className="rounded-lg py-2 px-3 cursor-pointer font-medium text-[13px] hover:bg-secondary">
                  Unfollow {post.user.username}
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg py-2 px-3 cursor-pointer font-medium text-[13px] hover:bg-secondary">
                  Mute {post.user.username}
                </DropdownMenuItem>
                <Separator className="my-1 bg-border/50" />
                <DropdownMenuItem className="rounded-lg py-2 px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 font-medium text-[13px]">
                  Report post
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="px-5 sm:px-6 mt-3">
        {isEditing ? (
          <div>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              autoFocus
              disabled={isUpdating}
              className="w-full resize-none rounded-[8px] border border-border bg-background p-3 text-[14.5px] leading-relaxed focus-visible:ring-0"
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveEdit}
                disabled={isUpdating || !editContent.trim()}
                className="bg-vivid-blue hover:bg-vivid-blue-hover text-white cursor-pointer"
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-foreground leading-relaxed text-[14.5px] break-words">
            {post.content}
          </p>
        )}
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
    </Card>
  );
}

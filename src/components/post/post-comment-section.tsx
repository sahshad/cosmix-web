"use client";

import { RefObject, useState } from "react";
import { QueryKey } from "@tanstack/react-query";
import { ArrowUp, Heart, Loader2, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { CommentResponse } from "@/types/post";
import { cn, formatRelativeTime, getAvatarPalette, getInitials } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useAuth";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useReplies,
  useToggleCommentLike,
  useUpdateComment,
} from "@/hooks/useComments";
import { User } from "@/types";

// interface ComposerUser {
//   displayName: string;
//   username: string;
//   avatarUrl?: string;
// }

interface CommentComposerProps {
  avatarUser: Partial<User>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  isSubmitting?: boolean;
  compact?: boolean;
  autoFocus?: boolean;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
}

function CommentComposer({
  avatarUser,
  value,
  onChange,
  onSubmit,
  placeholder,
  isSubmitting,
  compact,
  autoFocus,
  inputRef,
}: CommentComposerProps) {
  const palette = getAvatarPalette(avatarUser.username);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <Avatar className={cn("flex-shrink-0", compact ? "h-6 w-6" : "h-8 w-8")}>
        <AvatarImage src={avatarUser.avatarUrl} />
        <AvatarFallback
          className={cn(palette.bg, palette.text, "font-semibold", compact && "text-[10px]")}
        >
          {getInitials(avatarUser.displayName)}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex-1 min-w-0 flex items-center rounded-[8px] border border-border focus-within:border-foreground/35 transition-colors",
          compact ? "px-2.5 py-1.5" : "px-3 py-2"
        )}
      >
        <Textarea
          ref={inputRef}
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isSubmitting}
          className={cn(
            "min-h-0 resize-none rounded-none border-0 bg-transparent dark:bg-transparent shadow-none p-0 leading-relaxed focus-visible:ring-0 placeholder:text-muted-foreground",
            "text-[13.5px] leading-[20px] placeholder:text-[12px] placeholder:leading-[20px]",
            compact ? "text-[12.5px]" : "text-[13.5px]"
          )}
        />
      </div>
      <Button
        type="button"
        size="icon"
        onClick={onSubmit}
        disabled={!value.trim() || isSubmitting}
        className={cn(
          "flex-shrink-0 rounded-[6px] bg-vivid-blue text-white hover:bg-vivid-blue-hover disabled:bg-muted disabled:text-muted-foreground",
          compact ? "h-6 w-6" : "h-7 w-7"
        )}
        aria-label="Send"
      >
        {isSubmitting ? (
          <Loader2 className={cn("animate-spin", compact ? "h-3 w-3" : "h-3.5 w-3.5")} />
        ) : (
          <ArrowUp className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
        )}
      </Button>
    </div>
  );
}

interface CommentNodeProps {
  comment: CommentResponse;
  depth: number;
  postId: number | string;
  ownerQueryKey: QueryKey;
  composerUser: Partial<User>;
}

function CommentNode({ comment, depth, postId, ownerQueryKey, composerUser }: CommentNodeProps) {
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [replyBoxOpen, setReplyBoxOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const palette = getAvatarPalette(comment.user?.username || comment.user?.displayName);

  const { mutate: toggleLike } = useToggleCommentLike(ownerQueryKey);
  const { mutate: submitReply, isPending: isSubmittingReply } = useCreateComment(postId);
  const { data: replies = [], isLoading: isLoadingReplies } = useReplies(comment.id, repliesOpen);
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(ownerQueryKey);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(ownerQueryKey);

  const avatarSize =
    depth === 0 ? "h-9 w-9" : depth === 1 ? "h-[30px] w-[30px]" : "h-[26px] w-[26px]";
  const bubblePad = depth >= 2 ? "px-3 py-1.5" : "px-3.5 py-2";
  const nameSize = depth >= 2 ? "text-[12px]" : "text-[13px]";
  const handleSize = depth >= 2 ? "text-[11px]" : "text-[12px]";
  const textSize = depth >= 2 ? "text-[12.5px]" : "text-[13.5px]";

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    submitReply(
      { content: replyText.trim(), parentCommentId: comment.id },
      {
        onSuccess: () => {
          setReplyText("");
          setReplyBoxOpen(false);
          setRepliesOpen(true);
        },
        onError: () => toast.error("Failed to add reply."),
      }
    );
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;
    updateComment(
      { id: comment.id, content: editContent.trim() },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className={depth > 0 ? "mt-3 ml-4 pl-3.5 border-l border-border" : ""}>
      <div className="flex items-start gap-2.5">
        <Avatar className={cn(avatarSize, "flex-shrink-0 mt-0.5")}>
          <AvatarImage src={comment.user?.avatarUrl} />
          <AvatarFallback className={cn(palette.bg, palette.text, "font-semibold")}>
            {getInitials(comment.user?.displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className={cn("rounded-[12px] bg-secondary/50", bubblePad)}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={cn("font-semibold text-foreground truncate", nameSize)}>
                  {comment.user?.displayName}
                </span>
                <span className={cn("text-muted-foreground flex-shrink-0", handleSize)}>
                  @{comment.user?.username}
                </span>
              </div>
              {comment.isOwner && !isEditing && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="Comment options"
                      className="flex-shrink-0 text-muted-foreground hover:text-foreground cursor-pointer transition-colors -mt-0.5 -mr-1 p-0.5"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-[10px] shadow-lg border-border/60 min-w-[150px] z-50 p-1.5"
                  >
                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      className="rounded-lg py-1.5 px-2.5 cursor-pointer gap-2 font-medium text-[12.5px] hover:bg-secondary"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteComment(comment.id)}
                      disabled={isDeleting}
                      className="rounded-lg py-1.5 px-2.5 cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 font-medium text-[12.5px]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {isEditing ? (
              <div className="mt-1.5">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={2}
                  autoFocus
                  disabled={isUpdating}
                  className={cn(
                    "w-full resize-none rounded-none border-0 bg-transparent p-0 leading-relaxed focus-visible:ring-0",
                    textSize
                  )}
                />
                <div className="flex items-center justify-end gap-3 mt-1">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="text-[11.5px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isUpdating || !editContent.trim()}
                    className="text-[11.5px] font-semibold text-vivid-blue hover:underline cursor-pointer disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className={cn("text-foreground leading-relaxed break-words mt-0.5", textSize)}>
                {comment.content}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 ml-1">
            <span className="text-muted-foreground text-[11px]">
              {formatRelativeTime(comment.createdAt)}
            </span>
            <button
              type="button"
              onClick={() => toggleLike({ id: comment.id, isLiked: comment.isLiked })}
              className={cn(
                "flex items-center gap-1 text-[11.5px] font-medium cursor-pointer transition-colors",
                comment.isLiked ? "text-vivid-red" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart className={cn("h-3 w-3", comment.isLiked && "fill-current")} />
              {comment.likesCount}
            </button>
            {depth < 2 && (
              <button
                type="button"
                onClick={() => setReplyBoxOpen((v) => !v)}
                className="text-[11.5px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                Reply
              </button>
            )}
            {comment.repliesCount > 0 && (
              <button
                type="button"
                onClick={() => setRepliesOpen((v) => !v)}
                className="text-[11.5px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                {repliesOpen ? "Hide" : "View"} {comment.repliesCount}{" "}
                {comment.repliesCount === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {replyBoxOpen && (
            <div className="mt-2">
              <CommentComposer
                avatarUser={composerUser}
                value={replyText}
                onChange={setReplyText}
                onSubmit={handleReplySubmit}
                placeholder={`Reply to ${comment.user?.displayName?.split(" ")[0] ?? "them"}…`}
                isSubmitting={isSubmittingReply}
                compact
                autoFocus
              />
            </div>
          )}

          {repliesOpen && (
            <div className="mt-3">
              {isLoadingReplies ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                replies.map((reply) => (
                  <CommentNode
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    postId={postId}
                    ownerQueryKey={["replies", comment.id]}
                    composerUser={composerUser}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PostCommentSectionProps {
  postId: number | string;
  composerRef?: RefObject<HTMLTextAreaElement | null>;
  onClose?: () => void;
}

export function PostCommentSection({ postId, composerRef, onClose }: PostCommentSectionProps) {
  const [commentContent, setCommentContent] = useState("");
  const { data: currentUser } = useCurrentUser();

  const composerUser: Partial<User> = {
    displayName: currentUser?.displayName ?? "You",
    username: currentUser?.username ?? "you",
    avatarUrl: currentUser?.avatarUrl,
  };

  const {
    data,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(postId);

  const comments = data?.pages.flatMap((p) => p.comments) ?? [];

  const { mutate: submitComment, isPending: isSubmittingComment } = useCreateComment(postId);

  const handleCommentSubmit = () => {
    if (!commentContent.trim()) return;
    submitComment(
      { content: commentContent.trim() },
      {
        onSuccess: () => {
          toast.success("Comment added!");
          setCommentContent("");
        },
        onError: () => toast.error("Failed to add comment."),
      }
    );
  };

  return (
    <div className="border-t border-border/60">
      <div className="px-5 sm:px-6 pt-4 pb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
          Most relevant
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="px-5 sm:px-6 max-h-[380px] overflow-y-auto">
        {isLoadingComments ? (
          <div className="flex justify-center pb-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="pb-4 text-[13px] text-muted-foreground">
            No comments yet. Be the first to reply.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <CommentNode
                key={comment.id}
                comment={comment}
                depth={0}
                postId={postId}
                ownerQueryKey={["comments", postId]}
                composerUser={composerUser}
              />
            ))}
          </div>
        )}

        {hasNextPage && (
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-3 pb-4 text-[13px] font-medium text-vivid-blue hover:underline cursor-pointer disabled:opacity-60"
          >
            {isFetchingNextPage ? "Loading…" : "View more comments"}
          </button>
        )}
      </div>

      <div className="px-5 sm:px-6 py-3.5 border-t border-border/60">
        <CommentComposer
          avatarUser={composerUser}
          value={commentContent}
          onChange={setCommentContent}
          onSubmit={handleCommentSubmit}
          placeholder="Write a comment..."
          isSubmitting={isSubmittingComment}
          inputRef={composerRef}
        />
      </div>
    </div>
  );
}

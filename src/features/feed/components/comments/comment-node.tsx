"use client";

import { useState } from "react";
import { QueryKey } from "@tanstack/react-query";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { CenteredLoader, InlineEditField, OptionsMenu, UserAvatar } from "@/components/shared";
import { toast } from "sonner";
import { CommentResponse } from "../../types";
import { cn, formatRelativeTime, getAvatarPalette, getInitials } from "@/lib/utils";
import {
  useCreateComment,
  useDeleteComment,
  useReplies,
  useToggleCommentLike,
  useUpdateComment,
} from "../../hooks/useComments";
import { useInlineEdit } from "@/hooks/useInlineEdit";
import { User } from "@/types";
import { CommentComposer } from "./comment-composer";

interface CommentNodeProps {
  comment: CommentResponse;
  depth: number;
  postId: number | string;
  ownerQueryKey: QueryKey;
  composerUser: Partial<User>;
}

export function CommentNode({ comment, depth, postId, ownerQueryKey, composerUser }: CommentNodeProps) {
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [replyBoxOpen, setReplyBoxOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const palette = getAvatarPalette(comment.user?.username || comment.user?.displayName);

  const { mutate: toggleLike } = useToggleCommentLike(ownerQueryKey);
  const { mutate: submitReply, isPending: isSubmittingReply } = useCreateComment(postId);
  const { data: replies = [], isLoading: isLoadingReplies } = useReplies(comment.id, repliesOpen);
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(ownerQueryKey);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(ownerQueryKey);
  const {
    isEditing,
    content: editContent,
    setContent: setEditContent,
    startEdit,
    cancelEdit: handleCancelEdit,
    saveEdit: handleSaveEdit,
  } = useInlineEdit(comment.id, comment.content, updateComment);

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

  return (
    <div className={depth > 0 ? "mt-3 ml-4 pl-3.5 border-l border-border" : ""}>
      <div className="flex items-start gap-2.5">
        <UserAvatar
          src={comment.user?.avatarUrl}
          alt={comment.user?.displayName}
          fallback={getInitials(comment.user?.displayName)}
          className={cn(avatarSize, "flex-shrink-0 mt-0.5")}
          fallbackClassName={cn(palette.bg, palette.text, "font-semibold")}
        />
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
                <OptionsMenu
                  size="sm"
                  ariaLabel="Comment options"
                  triggerClassName="-mt-0.5 -mr-1"
                  items={[
                    { icon: Pencil, label: "Edit", onClick: startEdit },
                    {
                      icon: Trash2,
                      label: "Delete",
                      onClick: () => deleteComment(comment.id),
                      disabled: isDeleting,
                      destructive: true,
                    },
                  ]}
                />
              )}
            </div>
            {isEditing ? (
              <InlineEditField
                value={editContent}
                onChange={setEditContent}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                isSaving={isUpdating}
                rows={2}
                variant="link"
                className="mt-1.5"
                textareaClassName={cn("rounded-none border-0 bg-transparent p-0", textSize)}
              />
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
                <CenteredLoader className="py-2" size="sm" />
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

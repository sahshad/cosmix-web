"use client";

import { RefObject, useState } from "react";
import { X } from "lucide-react";
import { CenteredLoader, EmptyState } from "@/components/shared";
import { toast } from "sonner";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { useComments, useCreateComment } from "../../hooks/useComments";
import { User } from "@/types";
import { CommentComposer } from "./comment-composer";
import { CommentNode } from "./comment-node";

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
          <CenteredLoader className="pb-4" size="md" />
        ) : comments.length === 0 ? (
          <EmptyState message="No comments yet. Be the first to reply." variant="inline" className="pb-4" />
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

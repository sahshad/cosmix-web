"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { postService } from "@/services/post.service";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";

interface PostCommentSectionProps {
  postId: number | string;
  onSuccess?: () => void;
}

export function PostCommentSection({
  postId,
  onSuccess,
}: PostCommentSectionProps) {
  const [commentContent, setCommentContent] = useState("");
  const queryClient = useQueryClient();

  const { mutate: submitComment, isPending: isSubmittingComment } = useMutation(
    {
      mutationFn: async (content: string) => {
        await postService.createComment(postId, content);
      },
      onSuccess: () => {
        toast.success("Comment added!");
        setCommentContent("");
        onSuccess?.();
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.feed] });
      },
      onError: () => {
        toast.error("Failed to add comment.");
      },
    }
  );

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    submitComment(commentContent.trim());
  };

  return (
    <div className="px-6 sm:px-8 pb-6 animate-in slide-in-from-top-2 duration-200">
      <Separator className="mb-4 bg-border/50" />
      <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border border-border shadow-sm">
          <AvatarImage
            src={"https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser"}
          />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
        <Input
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Post your reply..."
          className="rounded-full bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-vivid-blue/50 h-10 px-4"
          disabled={isSubmittingComment}
        />
        <Button
          type="submit"
          disabled={!commentContent.trim() || isSubmittingComment}
          className="rounded-full h-10 px-6 font-bold bg-vivid-blue hover:bg-vivid-blue/90 text-white shadow-md shadow-vivid-blue/20 transition-all"
        >
          {isSubmittingComment ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Reply"
          )}
        </Button>
      </form>
    </div>
  );
}

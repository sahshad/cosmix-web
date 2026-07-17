"use client";

import { BadgeCheck, MoreHorizontal } from "lucide-react";
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
import { useState } from "react";
import { PostResponse as PostData } from "@/types/post";
export type { PostResponse } from "@/types/post";
export type { PostData };
export type { User } from "@/types/user";
import { PostActions } from "./post-actions";
import { PostCommentSection } from "./post-comment-section";

interface PostCardProps {
  post: any;
  onLike?: (postId: number | string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);

  return (
    <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.05)] rounded-[20px] bg-card overflow-hidden group">
      {/* Top Identification Pill */}
      <div className="px-6 pt-2 sm:px-8 flex items-center justify-between">
        <div className="inline-flex items-center gap-3 bg-secondary/40 hover:bg-secondary/60 transition-colors pr-5 p-1.5 rounded-full cursor-pointer">
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            <AvatarImage
              src={post.user?.avatarUrl || "/placeholder.svg"}
              alt={post.user.displayName}
            />
            <AvatarFallback>{post.user?.displayName}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-[15px] text-foreground">
                {post.user?.displayName}
              </span>
              {post.user.isVerified && (
                <BadgeCheck className="h-[14px] w-[14px] text-vivid-blue fill-vivid-blue/10" />
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 leading-none mt-[8px]">
              <p className="text-muted-foreground font-medium text-[11px]">
                {post.user.username}
              </p>
              <span className="text-muted-foreground/40 text-[8px]">●</span>
              <p className="text-muted-foreground font-medium text-[11px]">
                {post.createdAt.nanos}
              </p>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:bg-transparent dark:hover:bg-transparent hover:text-foreground flex-shrink-0"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-2xl shadow-xl border-border/40 min-w-[200px] z-50 p-2"
          >
            <DropdownMenuItem className="rounded-xl py-2.5 px-4 cursor-pointer font-bold hover:bg-secondary">
              Unfollow {post.user.username}
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl py-2.5 px-4 cursor-pointer font-bold hover:bg-secondary">
              Mute {post.user.username}
            </DropdownMenuItem>
            <Separator className="my-1 bg-border/50" />
            <DropdownMenuItem className="rounded-xl py-2.5 px-4 cursor-pointer text-vivid-red focus:text-vivid-red focus:bg-vivid-red/10 font-bold">
              Report Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Message Content */}
      <div className="px-6 sm:px-8 mt-4">
        <p
          className={`text-foreground leading-relaxed font-medium break-words ${post.content.length < 100
              ? "text-[17px] tracking-tight"
              : "text-[15px]"
            }`}
        >
          {post.content}
        </p>
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="mt-6 mx-4 sm:mx-6 rounded-[10px] overflow-hidden shadow-md max-h-[500px] flex items-center justify-center cursor-pointer relative group/media">
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/media:opacity-100 transition-opacity z-10 rounded-[2rem]" />
          <img
            src={post.media[0].url}
            alt="Post attachment"
            className="w-full h-full object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* Floating Action Dock */}
      <PostActions
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        isLiked={post.isLiked}
        isCommenting={isCommenting}
        onLike={() => onLike?.(post.id)}
        onCommentToggle={() => setIsCommenting(!isCommenting)}
      />

      {/* Comment Input Area */}
      {isCommenting && (
        <PostCommentSection
          postId={post.id}
          onSuccess={() => setIsCommenting(false)}
        />
      )}
    </Card>
  );
}

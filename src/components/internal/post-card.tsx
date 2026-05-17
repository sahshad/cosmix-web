"use client";

import { BadgeCheck, Bookmark, Heart, MessageCircle, MoreHorizontal, Send, Share2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/post.service";
import { toast } from "sonner";
import { Input } from "../ui/input";

// import React from 'react';
// import {
//     Heart,
//     MessageCircle,
//     Share2, 
//     MoreHorizontal,
//     BadgeCheck,
//     Bookmark,
//     Send,
// } from 'lucide-react';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

export interface user {
    display_name: string;
    username: string;
    avatar: string;
    verified: boolean;
}

export interface PostData {
    id: number | string;
    user: user;
    content: string;
    media: string | null;
    createdAt: string;
    updatedAt: string;
    likes: number;
    replies: number;
    reposts: number;
    views?: string;
    liked: boolean;
}

interface PostCardProps {
    post: PostData;
    onLike?: (postId: number | string) => void;
}

// export function PostCard({ post, onLike }: PostCardProps) {
//     return (
//         <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.05)] rounded-[2.5rem] bg-card overflow-hidden group">

//             {/* Top Pill - Identical to Home Feed */}
//             <div className="px-6 pt-6 sm:px-8 sm:pt-8 flex items-center justify-between">
//                 <div className="inline-flex items-center gap-3 bg-secondary/40 hover:bg-secondary/60 transition-colors pr-5 p-1.5 rounded-full cursor-pointer">
//                     <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
//                         <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
//                         <AvatarFallback>{post.author.name[0]}</AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-col justify-center">
//                          <div className="flex items-center gap-1.5 leading-none">
//                             <span className="font-bold text-[15px] text-foreground">
//                                 {post.author.name}
//                             </span>
//                             {post.author.verified && (
//                                 <BadgeCheck className="h-[14px] w-[14px] text-[#2d7af1] fill-[#2d7af1]/10" />
//                             )}
//                         </div>
//                         <div className="flex items-center gap-1.5 mt-0.5 leading-none">
//                             <p className="text-muted-foreground font-medium text-[12px]">
//                                 {post.author.handle}
//                             </p>
//                             <span className="text-muted-foreground/40 text-[8px]">●</span>
//                             <p className="text-muted-foreground font-medium text-[12px]">
//                                 {post.timestamp}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-10 w-10 rounded-full text-muted-foreground bg-secondary/30 hover:bg-secondary hover:text-foreground flex-shrink-0"
//                         >
//                             <MoreHorizontal className="h-5 w-5" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="rounded-2xl shadow-xl border-border/40 min-w-[200px] z-50 p-2">
//                         <DropdownMenuItem className="rounded-xl py-2.5 px-4 cursor-pointer font-bold hover:bg-secondary">Unfollow {post.author.handle}</DropdownMenuItem>
//                         <DropdownMenuItem className="rounded-xl py-2.5 px-4 cursor-pointer font-bold hover:bg-secondary">Mute {post.author.handle}</DropdownMenuItem>
//                         <Separator className="my-1 bg-border/50" />
//                         <DropdownMenuItem className="rounded-xl py-2.5 px-4 cursor-pointer text-[#f84b4b] focus:text-[#f84b4b] focus:bg-[#f84b4b]/10 font-bold">
//                             Report Post
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </div>

//             {/* Content (Mature Font Scale) */}
//             <div className="px-6 sm:px-8 mt-4">
//                 <p className={`text-foreground leading-relaxed font-medium break-words ${post.content.length < 100 ? 'text-[17px] tracking-tight' : 'text-[15px]'}`}>
//                     {post.content}
//                 </p>
//             </div>

//             {/* Media */}
//             {post.media && (
//                 <div className="mt-6 mx-4 sm:mx-6 rounded-[2rem] overflow-hidden shadow-md max-h-[500px] flex items-center justify-center cursor-pointer relative group/media">
//                     <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/media:opacity-100 transition-opacity z-10 rounded-[2rem]"></div>
//                     <img src={post.media} alt="Post media" className="w-full h-full object-cover max-h-[500px] group-hover/media:scale-[1.02] transition-transform duration-700" />
//                 </div>
//             )}

//             {/* Action Bar (Identical to Home feed dock) */}
//             <div className="mx-6 sm:mx-8 mt-6 mb-6">
//                 <div className="bg-secondary/30 border border-border/50 rounded-full py-2.5 px-3 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
//                     <div className="flex items-center gap-1">
//                         <Button
//                             variant="ghost"
//                             className="h-10 rounded-full px-4 gap-2 text-muted-foreground hover:bg-[#f84b4b]/10 hover:text-[#f84b4b] transition-all font-bold"
//                             onClick={() => onLike?.(post.id)}
//                         >
//                             <Heart className={`h-[18px] w-[18px] transition-transform ${post.liked ? 'fill-current text-[#f84b4b] scale-110' : ''}`} />
//                             <span className={`${post.liked ? 'text-[#f84b4b]' : ''}`}>{post.likes}</span>
//                         </Button>
//                         <Button
//                             variant="ghost"
//                             className="h-10 rounded-full px-4 gap-2 text-muted-foreground hover:bg-[#2d7af1]/10 hover:text-[#2d7af1] transition-all font-bold"
//                         >
//                             <MessageCircle className="h-[18px] w-[18px]" />
//                             <span>{post.replies}</span>
//                         </Button>
//                     </div>

//                     <div className="flex items-center gap-1">
//                         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:bg-[#11a657]/10 hover:text-[#11a657] transition-all">
//                             <Share2 className="h-[18px] w-[18px]" />
//                         </Button>
//                         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:bg-[#2d7af1]/10 hover:text-[#2d7af1] transition-all">
//                             <Bookmark className="h-[18px] w-[18px]" />
//                         </Button>
//                         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:bg-foreground hover:text-background transition-all">
//                             <Send className="h-[18px] w-[18px]" />
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//         </Card>
//     );
// }

// interface Post {
//     id: number;
//     author: {
//         name: string;
//         handle: string;
//         avatar: string;
//         verified: boolean;
//     };
//     content: string;
//     media: string | null;
//     timestamp: string;
//     likes: number;
//     replies: number;
//     reposts: number;
//     views: string;
//     liked: boolean;
// }

export function PostCard({ post, onLike }: PostCardProps) {
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const queryClient = useQueryClient();

    const { mutate: submitComment, isPending: isSubmittingComment } = useMutation({
        mutationFn: async (content: string) => {
            await postService.createComment(post.id, content);
        },
        onSuccess: () => {
            toast.success("Comment added!");
            setCommentContent("");
            setIsCommenting(false);
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
        onError: () => {
            toast.error("Failed to add comment.");
        }
    });

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim()) return;
        submitComment(commentContent.trim());
    };
    
    return (
        <Card key={post.id} className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.05)] rounded-[20px] bg-card overflow-hidden group">

            {/* Top Identificiation Pill */}
            <div className="px-6 pt-2 sm:px-8  flex items-center justify-between">
                <div className="inline-flex items-center gap-3 bg-secondary/40 hover:bg-secondary/60 transition-colors pr-5 p-1.5 rounded-full cursor-pointer">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage src={post.user?.avatar || "/placeholder.svg"} alt={post.user.display_name} />
                        <AvatarFallback>{post.user?.display_name}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-1.5 leading-none">
                            <span className="font-bold text-[15px] text-foreground">
                                {post.user?.display_name}
                            </span>
                            {post.user.verified && (
                                <BadgeCheck className="h-[14px] w-[14px] text-[#2d7af1] fill-[#2d7af1]/10" />
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 leading-none mt-[8px]">
                            <p className="text-muted-foreground font-medium text-[11px]">
                                {post.user.username}
                            </p>
                            <span className="text-muted-foreground/40 text-[8px]">●</span>
                            <p className="text-muted-foreground font-medium text-[11px]">
                                {post.createdAt}
                            </p>
                        </div>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full text-muted-foreground bg-secondary/30 hover:bg-secondary hover:text-foreground flex-shrink-0"
                        >
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl shadow-xl border-border/40 min-w-[200px] z-50 p-2">
                        <DropdownMenuItem className="rounded-xl py-2.5 px-4 cursor-pointer font-bold hover:bg-secondary">Unfollow {post.user.username}</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl py-2.5 px-4 cursor-pointer font-bold hover:bg-secondary">Mute {post.user.username}</DropdownMenuItem>
                        <Separator className="my-1 bg-border/50" />
                        <DropdownMenuItem className="rounded-xl py-2.5 px-4 cursor-pointer text-[#f84b4b] focus:text-[#f84b4b] focus:bg-[#f84b4b]/10 font-bold">
                            Report Post
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Message Content */}
            <div className="px-6 sm:px-8 mt-4">
                <p className={`text-foreground leading-relaxed font-medium break-words ${post.content.length < 100 ? 'text-[17px] tracking-tight' : 'text-[15px]'}`}>
                    {post.content}
                </p>
            </div>

            {post.media && (
                <div className="mt-6 mx-4 sm:mx-6 rounded-[10px] overflow-hidden shadow-md max-h-[500px] flex items-center justify-center cursor-pointer relative group/media">
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/media:opacity-100 transition-opacity z-10 rounded-[2rem]"></div>
                    <img
                        src={post.media}
                        alt="Post attachment"
                        className="w-full h-full object-cover max-h-[500px] "
                    />
                </div>
            )}

            {/* Floating Action Dock */}
            <div className="mx-6 sm:mx-8 my-1">
                <div className="bg-secondary/30 border border-border/50 rounded-full px-3 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            className="h-10 rounded-full px-4 gap-2 text-muted-foreground hover:bg-[#f84b4b]/10 hover:text-[#f84b4b] transition-all font-bold"
                            onClick={() => onLike?.(post.id)}
                        >
                            <Heart className={`h-[18px] w-[18px] transition-transform ${post.liked ? 'fill-current text-[#f84b4b] scale-110' : ''}`} />
                            <span className={`${post.liked ? 'text-[#f84b4b]' : ''}`}>{post.likes}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className={`h-10 rounded-full px-4 gap-2 transition-all font-bold ${isCommenting ? 'bg-[#2d7af1]/10 text-[#2d7af1]' : 'text-muted-foreground hover:bg-[#2d7af1]/10 hover:text-[#2d7af1]'}`}
                            onClick={() => setIsCommenting(!isCommenting)}
                        >
                            <MessageCircle className="h-[18px] w-[18px]" />
                            <span>{post.replies}</span>
                        </Button>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full text-muted-foreground hover:bg-[#11a657]/10 hover:text-[#11a657] transition-all"
                        >
                            <Share2 className="h-[18px] w-[18px]" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full text-muted-foreground hover:bg-[#2d7af1]/10 hover:text-[#2d7af1] transition-all"
                        >
                            <Bookmark className="h-[18px] w-[18px]" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full text-muted-foreground hover:bg-foreground hover:text-background transition-all"
                        >
                            <Send className="h-[18px] w-[18px]" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Comment Input Area */}
            {isCommenting && (
                <div className="px-6 sm:px-8 pb-6 animate-in slide-in-from-top-2 duration-200">
                    <Separator className="mb-4 bg-border/50" />
                    <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-border shadow-sm">
                            <AvatarImage src={"https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser"} />
                            <AvatarFallback>Me</AvatarFallback>
                        </Avatar>
                        <Input 
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="Post your reply..."
                            className="rounded-full bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-[#2d7af1]/50 h-10 px-4"
                            disabled={isSubmittingComment}
                        />
                        <Button 
                            type="submit" 
                            disabled={!commentContent.trim() || isSubmittingComment}
                            className="rounded-full h-10 px-6 font-bold bg-[#2d7af1] hover:bg-[#2d7af1]/90 text-white shadow-md shadow-[#2d7af1]/20 transition-all"
                        >
                            {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reply"}
                        </Button>
                    </form>
                </div>
            )}

        </Card>
    );
}
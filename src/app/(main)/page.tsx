'use client';

import React, { useState } from 'react';
import {
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    ImageIcon,
    MapPin,
    LinkIcon,
    Calendar,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

// Sample post data
const samplePosts = [
    {
        id: 1,
        author: {
            name: 'Alex Chen',
            handle: '@alexchen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        },
        content:
            'Just launched my new project! Excited to see what the community thinks about it. Check it out and let me know your thoughts! 🚀',
        timestamp: '2 hours ago',
        likes: 342,
        replies: 28,
        reposts: 45,
        liked: false,
    },
    {
        id: 2,
        author: {
            name: 'Emma Rodriguez',
            handle: '@emmarod',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
        },
        content:
            'Beautiful sunset from my morning walk. Nature never ceases to amaze me. Who else enjoys early morning hikes? 🌅',
        timestamp: '4 hours ago',
        likes: 521,
        replies: 67,
        reposts: 89,
        liked: true,
    },
    {
        id: 3,
        author: {
            name: 'Marcus Lee',
            handle: '@marcuslee',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
        },
        content:
            'Reading an amazing book on system design. The concepts are really clicking now. Highly recommend this resource to anyone learning backend architecture.',
        timestamp: '6 hours ago',
        likes: 289,
        replies: 45,
        reposts: 78,
        liked: false,
    },
];

interface Post {
    id: number;
    author: {
        name: string;
        handle: string;
        avatar: string;
    };
    content: string;
    timestamp: string;
    likes: number;
    replies: number;
    reposts: number;
    liked: boolean;
}

export default function DashboardPage() {
    const [posts, setPosts] = useState<Post[]>(samplePosts);
    const [postContent, setPostContent] = useState('');

    const handleLike = (postId: number) => {
        setPosts(
            posts.map((post) =>
                post.id === postId
                    ? {
                        ...post,
                        liked: !post.liked,
                        likes: post.liked ? post.likes - 1 : post.likes + 1,
                    }
                    : post
            )
        );
    };

    const handlePost = () => {
        if (postContent.trim()) {
            const newPost: Post = {
                id: posts.length + 1,
                author: {
                    name: 'Sarah Johnson',
                    handle: '@sarahjohnson',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix',
                },
                content: postContent,
                timestamp: 'now',
                likes: 0,
                replies: 0,
                reposts: 0,
                liked: false,
            };
            setPosts([newPost, ...posts]);
            setPostContent('');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
                {/* Create Post Card */}
                <Card className="p-6 border-border">
                    <div className="flex gap-4">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix"
                                alt="You"
                            />
                            <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Textarea
                                placeholder="What's on your mind?"
                                className="min-h-20 resize-none border-border bg-secondary/50 text-foreground placeholder-muted-foreground"
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            />
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <ImageIcon className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <MapPin className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <LinkIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                                <Button
                                    onClick={handlePost}
                                    disabled={!postContent.trim()}
                                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                <Separator className="bg-border" />

                {/* Posts Feed */}
                <div className="space-y-1">
                    {posts.map((post) => (
                        <Card key={post.id} className="border-border hover:bg-secondary/50 transition-colors">
                            <div className="p-6">
                                <div className="flex gap-4">
                                    <Avatar className="h-12 w-12 flex-shrink-0">
                                        <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-foreground">{post.author.name}</p>
                                                    <p className="text-muted-foreground">{post.author.handle}</p>
                                                    <span className="text-muted-foreground">·</span>
                                                    <p className="text-muted-foreground text-sm">{post.timestamp}</p>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-muted-foreground hover:text-foreground"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Report Post</DropdownMenuItem>
                                                    <DropdownMenuItem>Mute @{post.author.handle}</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">
                                                        Block User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <p className="mt-3 text-foreground leading-normal">{post.content}</p>

                                        {/* Post Stats */}
                                        <div className="mt-4 flex gap-4 text-sm text-muted-foreground border-t border-b border-border py-3">
                                            <span>{post.replies} replies</span>
                                            <span>{post.reposts} reposts</span>
                                            <span>{post.likes} likes</span>
                                        </div>

                                        {/* Post Actions */}
                                        <div className="mt-3 flex justify-between text-muted-foreground max-w-xs">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 hover:text-accent hover:bg-accent/10"
                                            >
                                                <MessageCircle className="h-4 w-4" />
                                                <span className="ml-2 text-xs">Reply</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 hover:text-green-500 hover:bg-green-500/10"
                                            >
                                                <Share2 className="h-4 w-4" />
                                                <span className="ml-2 text-xs">Repost</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleLike(post.id)}
                                                className={`flex-1 ${post.liked
                                                        ? 'text-red-500 bg-red-500/10'
                                                        : 'hover:text-red-500 hover:bg-red-500/10'
                                                    }`}
                                            >
                                                <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                                                <span className="ml-2 text-xs">{post.likes}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Right Sidebar - Trends & Suggestions */}
            <div className="space-y-6">
                {/* Search */}
                <div className="sticky top-6">
                    <div className="relative">
                        <Input
                            placeholder="Search Cosmix"
                            className="pl-10 border-border bg-secondary/50"
                        />
                        <svg
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* What's Trending */}
                <Card className="border-border p-6">
                    <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
                        What{"'"}s Trending
                    </h2>
                    <div className="space-y-4">
                        {[
                            { tag: '#ReactJS', posts: '284K posts' },
                            { tag: '#WebDevelopment', posts: '156K posts' },
                            { tag: '#TechNews', posts: '89K posts' },
                            { tag: '#StartupLife', posts: '45K posts' },
                        ].map((trend) => (
                            <button
                                key={trend.tag}
                                className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors"
                            >
                                <p className="font-semibold text-foreground text-sm">{trend.tag}</p>
                                <p className="text-xs text-muted-foreground">{trend.posts}</p>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Suggested Users */}
                <Card className="border-border p-6">
                    <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
                        Suggested for you
                    </h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Jane Smith', handle: '@janesmith', avatar: 'jane' },
                            { name: 'David Park', handle: '@davidpark', avatar: 'david' },
                            { name: 'Lisa Wang', handle: '@lisawang', avatar: 'lisa' },
                        ].map((user) => (
                            <div key={user.handle} className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                                            alt={user.name}
                                        />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.handle}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" className="border-border bg-transparent">
                                    Follow
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Footer */}
                <div className="text-xs text-muted-foreground space-y-2 px-2">
                    <p>
                        © 2024 Cosmix. All rights reserved. | <a href="#" className="hover:underline">Privacy</a> |{' '}
                        <a href="#" className="hover:underline">Terms</a> |{' '}
                        <a href="#" className="hover:underline">Cookies</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

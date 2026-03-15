'use client';

import React, { useState } from 'react';
import {
    Calendar,
    MapPin,
    Link as LinkIcon,
    Edit2,
    MessageCircle,
    Share,
    MoreHorizontal,
    Heart,
    Share2,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const userProfile = {
    name: 'Sarah Johnson',
    handle: '@sarahjohnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix',
    banner: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    bio: 'Product Designer & Digital Creative | Coffee enthusiast ☕ | Based in San Francisco',
    location: 'San Francisco, CA',
    website: 'sarahjohnson.design',
    joinDate: 'Joined March 2023',
    followers: 12543,
    following: 854,
    posts: 287,
    isFollowing: false,
    isMe: true // Assuming this is the logged-in user for now since it was under /profile
};

const userPosts = [
    {
        id: 1,
        content: 'Just finished redesigning my portfolio website. Excited to share it with everyone!',
        timestamp: '3 days ago',
        likes: 128,
        replies: 12,
        reposts: 23,
        liked: false,
    },
    {
        id: 2,
        content:
            'Design tip: Always test your color contrast with real users. Accessibility matters! 🎨',
        timestamp: '1 week ago',
        likes: 456,
        replies: 67,
        reposts: 145,
        liked: true,
    },
    {
        id: 3,
        content:
            'Working on a new design system. The component library is coming along nicely. Thread 🧵',
        timestamp: '2 weeks ago',
        likes: 234,
        replies: 28,
        reposts: 56,
        liked: false,
    },
];

export default function ProfilePage() {
    const [isFollowing, setIsFollowing] = useState(userProfile.isFollowing);
    const [followers, setFollowers] = useState(userProfile.followers);
    const [posts, setPosts] = useState(userPosts);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        setFollowers(isFollowing ? followers - 1 : followers + 1);
    };

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

    return (
        <div className="flex w-full">
            <div className="flex-1 bg-background">
                <div className="max-w-2xl mx-auto border-r border-border min-h-screen">
                    {/* Header */}
                    <div className="sticky top-0 backdrop-blur bg-background/80 border-b border-border z-10 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                                ←
                            </Button>
                            <div>
                                <h1 className="text-xl font-serif font-semibold text-foreground">
                                    {userProfile.name}
                                </h1>
                                <p className="text-sm text-muted-foreground">{userProfile.posts} posts</p>
                            </div>
                        </div>
                    </div>

                    {/* Banner */}
                    <div className="relative h-48 bg-secondary overflow-hidden">
                        <img
                            src={userProfile.banner || "/placeholder.svg"}
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Profile Info */}
                    <div className="px-6">
                        <div className="flex items-start justify-between -mt-12 mb-4">
                            <Avatar className="h-32 w-32 border-4 border-background">
                                <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                                <AvatarFallback>{userProfile.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="mt-4">
                                {userProfile.isMe ? (
                                    <Button variant="outline" className="rounded-full border-border bg-transparent">
                                        Edit Profile
                                    </Button>
                                ) : (
                                    !isFollowing ? (
                                        <Button
                                            onClick={handleFollow}
                                            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
                                        >
                                            Follow
                                        </Button>
                                    ) : (
                                        <Button variant="outline" onClick={handleFollow} className="rounded-full border-border bg-transparent">
                                            Following
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h1 className="text-2xl font-serif font-semibold text-foreground">
                                {userProfile.name}
                            </h1>
                            <p className="text-muted-foreground">{userProfile.handle}</p>
                        </div>

                        <p className="text-foreground mb-4 leading-relaxed">{userProfile.bio}</p>

                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {userProfile.location}
                            </div>
                            <a href="#" className="flex items-center gap-2 text-accent hover:underline">
                                <LinkIcon className="h-4 w-4" />
                                {userProfile.website}
                            </a>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {userProfile.joinDate}
                            </div>
                        </div>

                        <div className="flex gap-8 text-sm mb-6">
                            <button className="hover:text-foreground transition">
                                <span className="font-semibold text-foreground">{userProfile.following}</span>
                                <span className="text-muted-foreground"> Following</span>
                            </button>
                            <button className="hover:text-foreground transition">
                                <span className="font-semibold text-foreground">{followers}</span>
                                <span className="text-muted-foreground"> Followers</span>
                            </button>
                        </div>

                        <Separator className="bg-border" />
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="posts" className="w-full">
                        <TabsList className="w-full rounded-none border-b border-border bg-transparent p-0 h-auto">
                            <TabsTrigger
                                value="posts"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent px-4 py-4"
                            >
                                Posts
                            </TabsTrigger>
                            <TabsTrigger
                                value="replies"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent px-4 py-4"
                            >
                                Replies
                            </TabsTrigger>
                            <TabsTrigger
                                value="likes"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent px-4 py-4"
                            >
                                Likes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="posts" className="space-y-1 mt-0">
                            {posts.map((post) => (
                                <div key={post.id} className="border-b border-border hover:bg-secondary/50 transition-colors p-6 cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-foreground">{userProfile.name}</p>
                                            <p className="text-muted-foreground text-sm">{userProfile.handle} · {post.timestamp}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Share</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <p className="text-foreground mb-4 leading-normal">{post.content}</p>

                                    <div className="flex gap-4 text-sm text-muted-foreground border-t border-b border-border py-3 mb-3">
                                        <span>{post.replies} replies</span>
                                        <span>{post.reposts} reposts</span>
                                        <span>{post.likes} likes</span>
                                    </div>

                                    <div className="flex justify-between text-muted-foreground max-w-xs">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex-1 hover:text-accent hover:bg-accent/10"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex-1 hover:text-green-500 hover:bg-green-500/10"
                                        >
                                            <Share2 className="h-4 w-4" />
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
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="replies" className="p-6 text-center text-muted-foreground">
                            No replies yet
                        </TabsContent>

                        <TabsContent value="likes" className="p-6 text-center text-muted-foreground">
                            No liked posts
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import {
    Calendar,
    MapPin,
    Link as LinkIcon,
    Edit2,
    MoreHorizontal,
    ArrowLeft,
    CheckCircle2,
    Briefcase,
    TrendingUp,
    Users,
    Images,
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
import { PostCard, PostData } from '@/components/internal/post-card';
import Link from 'next/link';
import FollowButton from '@/components/internal/follow-button';

const userProfile = {
    name: 'Sarah Johnson',
    handle: '@sarahjohnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop',
    bio: 'Product Designer & Digital Creative. Building the future of social experiences at Cosmix 🌌. Coffee enthusiast ☕ | Explorer 🗺️',
    location: 'San Francisco, CA',
    website: 'sarah.design',
    joinDate: 'Joined March 2023',
    followers: 12543,
    following: 854,
    posts: 287,
    isFollowing: false,
    isMe: true,
    verified: true,
    occupation: 'Lead Designer'
};

const userPosts = [
    {
        id: 101,
        author: {
            name: 'Sarah Johnson',
            handle: '@sarahjohnson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix',
            verified: true,
        },
        content: 'Just finished redesigning the Cosmix profile experience. We wanted something that felt more professional, airy, and mature. What do you think about the new feed? ✨',
        media: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop',
        timestamp: '3h ago',
        likes: 1242,
        replies: 89,
        reposts: 156,
        liked: true,
    },
    {
        id: 102,
        author: {
            name: 'Sarah Johnson',
            handle: '@sarahjohnson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix',
            verified: true,
        },
        content: 'Architecture is not about space but about time. Every design we build at Cosmix is a commitment to the user\'s future. 🛠️',
        media: null,
        timestamp: '1d ago',
        likes: 856,
        replies: 42,
        reposts: 23,
        liked: false,
    },
    {
        id: 103,
        author: {
            name: 'Sarah Johnson',
            handle: '@sarahjohnson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix',
            verified: true,
        },
        content: 'Early morning creativity boost. Sometimes all you need is a fresh perspective and a good cup of coffee. 🪴',
        media: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
        timestamp: '2d ago',
        likes: 2103,
        replies: 156,
        reposts: 342,
        liked: true,
    },
];

export default function ProfilePage() {
    const [posts, setPosts] = useState<PostData[]>(userPosts as PostData[]);

    const handleLike = (postId: number | string) => {
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 p-6 max-w-[1250px] mx-auto animate-fade-in-up">

            {/* Left Column - Main Profile & Feed */}
            <div className="space-y-6">

                {/* Profile Header Card */}
                <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-card overflow-hidden">
                    {/* Banner */}
                    <div className="relative h-44 sm:h-56 bg-secondary overflow-hidden group">
                        <img
                            src={userProfile.banner}
                            alt="Profile Banner"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>

                    {/* Profile Meta Section */}
                    <div className="px-8 relative pb-8">
                        <div className="flex justify-between items-end -mt-14 sm:-mt-16 mb-6">
                            <div className="relative">
                                <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border-[6px] border-background shadow-2xl rounded-[2.5rem] overflow-hidden bg-background">
                                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} className="object-cover" />
                                    <AvatarFallback className="text-3xl">{userProfile.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-2 right-2 h-6 w-6 bg-[#11a657] border-4 border-background rounded-full shadow-[0_0_15px_rgba(17,166,87,0.3)]" />
                            </div>
                            <div className="pb-2">
                                {userProfile.isMe ? (
                                    <Button className="rounded-2xl border-border bg-foreground text-background hover:bg-foreground/90 font-bold px-6 h-11 transition-all shadow-lg active:scale-95 text-sm">
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <Button className="rounded-2xl bg-[#2d7af1] text-white hover:bg-[#1e5bba] font-bold px-8 h-11 transition-all shadow-lg active:scale-95 text-sm">
                                        Follow
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                                        {userProfile.name}
                                    </h2>
                                    {userProfile.verified && (
                                        <CheckCircle2 className="h-4 w-4 text-[#2d7af1] fill-[#2d7af1]/10" />
                                    )}
                                </div>
                                <p className="text-muted-foreground font-bold text-sm">{userProfile.handle}</p>
                            </div>

                            <p className="text-[14px] leading-relaxed text-foreground/80 max-w-xl font-medium">
                                {userProfile.bio}
                            </p>

                            <div className="flex flex-wrap gap-y-2 gap-x-5">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5 text-[#f84b4b]" />
                                    <span className="text-[12px] font-bold">{userProfile.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <LinkIcon className="h-3.5 w-3.5 text-[#11a657]" />
                                    <a href={`https://${userProfile.website}`} target="_blank" className="text-[12px] font-bold hover:underline text-[#11a657]">
                                        {userProfile.website}
                                    </a>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5 text-[#f8b301]" />
                                    <span className="text-[12px] font-bold">{userProfile.joinDate}</span>
                                </div>
                            </div>

                            <div className="flex gap-8 pt-2">
                                <button className="flex items-center gap-1.5 group">
                                    <span className="text-base font-bold text-foreground group-hover:underline">
                                        {userProfile.following.toLocaleString()}
                                    </span>
                                    <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Following</span>
                                </button>
                                <button className="flex items-center gap-1.5 group">
                                    <span className="text-base font-bold text-foreground group-hover:underline">
                                        {userProfile.followers.toLocaleString()}
                                    </span>
                                    <span className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Followers</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Tabs & Content Feed */}
                <div className="space-y-6">
                    <Tabs defaultValue="posts" className="w-full">
                        <TabsList className="w-full h-14 rounded-3xl border border-border/40 bg-card/50 backdrop-blur-sm flex justify-around p-1 shadow-sm">
                            <TabsTrigger
                                value="posts"
                                className="flex-1 h-full rounded-2xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-[#2d7af1] font-bold text-[13px] uppercase tracking-wider transition-all"
                            >
                                Posts
                            </TabsTrigger>
                            <TabsTrigger
                                value="replies"
                                className="flex-1 h-full rounded-2xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-[#2d7af1] font-bold text-[13px] uppercase tracking-wider transition-all"
                            >
                                Replies
                            </TabsTrigger>
                            <TabsTrigger
                                value="likes"
                                className="flex-1 h-full rounded-2xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-[#2d7af1] font-bold text-[13px] uppercase tracking-wider transition-all"
                            >
                                Likes
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="posts" className="space-y-6 mt-6">
                            {posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onLike={handleLike}
                                />
                            ))}
                        </TabsContent>
                        <TabsContent value="replies" className="p-12 text-center text-muted-foreground font-bold text-sm uppercase tracking-widest bg-card rounded-[2.5rem] shadow-sm">
                            No cosmic replies yet.
                        </TabsContent>
                        <TabsContent value="likes" className="p-12 text-center text-muted-foreground font-bold text-sm uppercase tracking-widest bg-card rounded-[2.5rem] shadow-sm">
                            No cosmic likes yet.
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Right Column - Utilizing Space */}
            <div className="space-y-8 hidden lg:block">

                {/* Photo Grid - Utilizing extra space */}
                <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] rounded-[2rem] bg-card p-6">
                    <h2 className="text-[11px] font-black text-muted-foreground mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
                        <div className="bg-[#11a657]/10 p-1.5 rounded-lg">
                            <Images className="h-4 w-4 text-[#11a657]" />
                        </div>
                        Glimpses of Cosmos
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                        {posts.filter(p => p.media).map(post => (
                            <div key={post.id} className="aspect-square rounded-xl overflow-hidden group cursor-pointer border border-border/20 shadow-sm relative">
                                <img src={post.media!} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery item" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </div>
                        ))}
                        {/* Placeholders for 3x3 grid */}
                        <div className="aspect-square rounded-xl bg-secondary/20 border border-border/10 flex items-center justify-center">
                            <div className="h-4 w-4 rounded-full bg-muted-foreground/10" />
                        </div>
                        <div className="aspect-square rounded-xl bg-secondary/20 border border-border/10 flex items-center justify-center">
                            <div className="h-4 w-4 rounded-full bg-muted-foreground/10" />
                        </div>
                    </div>
                </Card>

                {/* Suggested Users - Consistency with Home Page */}
                <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] rounded-[2rem] bg-card p-6">
                    <h2 className="text-[11px] font-black text-muted-foreground mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
                        <div className="bg-[#2d7af1]/10 p-1.5 rounded-lg">
                            <Users className="h-4 w-4 text-[#2d7af1]" />
                        </div>
                        Picks for You
                    </h2>
                    <div className="space-y-5">
                        {[
                            { name: 'Jane Smith', handle: 'janesmith', avatar: 'jane' },
                            { name: 'David Park', handle: 'davidpark', avatar: 'david' },
                        ].map((user) => (
                            <div key={user.handle} className="flex items-center justify-between gap-3 group">
                                <div className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer">
                                    <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-[#2d7af1]/30 transition-all shadow-sm">
                                        <AvatarImage
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                                            alt={user.name}
                                        />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-bold text-foreground group-hover:underline truncate">{user.name}</p>
                                        <p className="text-[11px] font-medium text-muted-foreground truncate">@{user.handle}</p>
                                    </div>
                                </div>
                                <FollowButton />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Trending - Consistency */}
                <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] rounded-[2rem] bg-card p-6">
                    <h2 className="text-[11px] font-black text-muted-foreground mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
                        <div className="bg-[#f8b301]/10 p-1.5 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-[#f8b301]" />
                        </div>
                        Trending in Cosmos
                    </h2>
                    <div className="space-y-4">
                        {[
                            { tag: 'CosmixDesign', posts: '12K' },
                            { tag: 'MatureWeb', posts: '8K' },
                        ].map((trend) => (
                            <div key={trend.tag} className="group cursor-pointer">
                                <p className="font-bold text-[13px] text-foreground group-hover:text-[#2d7af1] transition-colors">#{trend.tag}</p>
                                <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{trend.posts} posts</p>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </div>
    );
}

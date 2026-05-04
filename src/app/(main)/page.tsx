'use client';

import React, { useState } from 'react';
import {
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    ImageIcon,
    MapPin,
    Calendar,
    Sparkles,
    TrendingUp,
    Users,
    BadgeCheck,
    BarChart2,
    Bookmark,
    Share,
    Send,
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
import { PostCard, PostData } from '@/components/internal/post-card';
import FollowButton from '@/components/internal/follow-button';

// Sample post data
const samplePosts = [
    {
        id: 1,
        author: {
            name: 'Alex Chen',
            handle: '@alexchen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
            verified: true,
        },
        content:
            'Just launched my new project! Excited to see what the community thinks about it. Feedback is immensely appreciated. 🚀',
        media: null,
        timestamp: '2 hours ago',
        likes: 342,
        replies: 28,
        reposts: 45,
        views: '12K',
        liked: false,
    },
    {
        id: 2,
        author: {
            name: 'Emma Rodriguez',
            handle: '@emmarod',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
            verified: false,
        },
        content:
            'Beautiful sunset from my morning walk. Nature never ceases to amaze me. Who else enjoys early morning hikes? 🌅',
        media: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
        timestamp: '4 hours ago',
        likes: 521,
        replies: 67,
        reposts: 89,
        views: '45.2K',
        liked: true,
    },
    {
        id: 3,
        author: {
            name: 'Marcus Lee',
            handle: '@marcuslee',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
            verified: true,
        },
        content:
            'Reading an amazing book on system design. The concepts are really clicking now. I will post a detailed visual thread mapping out backend architectures tomorrow morning.',
        media: null,
        timestamp: '6 hours ago',
        likes: 289,
        replies: 45,
        reposts: 78,
        views: '8.4K',
        liked: false,
    },
];

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

export default function DashboardPage() {
    const [posts, setPosts] = useState<PostData[]>(samplePosts);
    const [postContent, setPostContent] = useState('');

    // const handleLike = (postId: number) => {
    //     setPosts(
    //         posts.map((post) =>
    //             post.id === postId
    //                 ? {
    //                     ...post,
    //                     liked: !post.liked,
    //                     likes: post.liked ? post.likes - 1 : post.likes + 1,
    //                 }
    //                 : post
    //         )
    //     );
    // };

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

    const handlePost = () => {
        if (postContent.trim()) {
            const newPost: PostData = {
                id: posts.length + 1,
                author: {
                    name: 'Sarah Johnson',
                    handle: '@sarahjohnson',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix',
                    verified: true,
                },
                content: postContent,
                media: null,
                timestamp: 'now',
                likes: 0,
                replies: 0,
                reposts: 0,
                views: '0',
                liked: false,
            };
            setPosts([newPost, ...posts]);
            setPostContent('');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 p-6 max-w-[1250px] mx-auto animate-fade-in-up">

            {/* Main Feed */}
            <div className="space-y-8">

                {/* Header Welcome Card */}
                <div className="bg-gradient-to-br from-[#2d7af1] to-[#1e5bba] rounded-[2rem] p-8 text-white shadow-2xl shadow-[#2d7af1]/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay"></div>
                    <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 blur-[60px] rounded-full group-hover:scale-110 transition-transform duration-700"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-1 tracking-tight">Good Morning, Sarah!</h1>
                            <p className="text-white/80 font-medium text-sm">Ready to see what the cosmos is up to?</p>
                        </div>
                        <div className="hidden sm:flex h-12 w-12 bg-white/10 rounded-2xl items-center justify-center backdrop-blur-xl border border-white/20 rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-lg">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Create Post Action Area */}
                <Card className="p-2 border-0 shadow-[0_12px_40px_rgb(0,0,0,0.06)] rounded-[3rem] bg-card flex flex-col focus-within:ring-4 ring-[#2d7af1]/10 transition-all duration-300">
                    <div className="flex px-6 pt-6 pb-4">
                        <Avatar className="h-12 w-12 flex-shrink-0 mr-4 mt-1 ring-2 ring-transparent">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix" alt="You" />
                            <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                        <Textarea
                            placeholder="What's sparking your imagination today?"
                            className="flex-1 min-h-[60px] resize-none border-0 bg-transparent focus-visible:ring-0 text-foreground placeholder-muted-foreground/60 text-[15px] font-medium"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between bg-secondary/40 rounded-[2.5rem] py-2 px-3 m-2">
                        <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-10 rounded-full text-[#2d7af1] font-bold hover:bg-[#2d7af1]/10 hover:text-[#2d7af1] ">
                                <ImageIcon className="h-[18px] w-[18px] sm:mr-2" />
                                <span className="hidden sm:block">Media</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-10 rounded-full text-[#11a657] font-bold hover:bg-[#11a657]/10 hover:text-[#11a657]">
                                <MapPin className="h-[18px] w-[18px] sm:mr-2" />
                                <span className="hidden sm:block">Location</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-10 rounded-full text-[#f8b301] font-bold hover:bg-[#f8b301]/10 hover:text-[#f8b301] hidden md:flex">
                                <Calendar className="h-[18px] w-[18px] mr-2" />
                                Event
                            </Button>
                        </div>
                        <Button
                            onClick={handlePost}
                            disabled={!postContent.trim()}
                            className="bg-[#2d7af1] hover:bg-[#2d7af1]/90 text-white rounded-full px-7 h-10 shadow-lg shadow-[#2d7af1]/30 font-bold transition-all hover:scale-105 active:scale-95"
                        >
                            Post
                        </Button>
                    </div>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-8">
                    {posts.map((post) => (
                        <PostCard key={post.id} onLike={handleLike} post={post} />
                    ))}
                </div>
            </div>

            {/* Right Sidebar - Trends & Suggestions */}
            <div className="space-y-8 hidden lg:block">
                {/* Search */}
                <div className="sticky top-8 z-10 w-full group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#2d7af1] to-[#1e5bba] rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur-md transition-opacity"></div>
                    <div className="relative">
                        <Input
                            placeholder="Explore Cosmix..."
                            className="pl-14 h-14 rounded-[2rem] border-0 bg-card/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-[#2d7af1]/30 transition-all font-bold text-[15px]"
                        />
                        <svg
                            className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#2d7af1]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* What's Trending */}
                <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] rounded-[2rem] bg-card p-6">
                    <h2 className="text-sm font-bold text-muted-foreground mb-6 flex items-center gap-3 uppercase tracking-wider">
                        <div className="bg-[#2d7af1]/10 p-1.5 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-[#2d7af1]" />
                        </div>
                        Trending Now
                    </h2>
                    <div className="space-y-4">
                        {[
                            { tag: 'ReactJS', posts: '284K', color: '#2d7af1', rank: '01' },
                            { tag: 'WebDev', posts: '156K', color: '#11a657', rank: '02' },
                            { tag: 'CosmixLaunch', posts: '89K', color: '#f8b301', rank: '03' },
                            { tag: 'DesignSys', posts: '45K', color: '#f84b4b', rank: '04' },
                        ].map((trend) => (
                            <button
                                key={trend.tag}
                                className="w-full text-left p-4 rounded-3xl bg-secondary/20 hover:bg-secondary/60 transition-colors flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-muted-foreground/40 text-lg group-hover:text-foreground transition-colors">{trend.rank}</span>
                                    <div>
                                        <p className="font-bold text-[14px] text-foreground group-hover:text-[#2d7af1] transition-colors font-sans">#{trend.tag}</p>
                                        <p className="text-[12px] font-medium text-muted-foreground mt-0.5">{trend.posts} posts</p>
                                    </div>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm translate-x-[-10px] group-hover:translate-x-0">
                                    <MoreHorizontal className="h-4 w-4 text-foreground" />
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Suggested Users */}
                <Card className="border-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] rounded-[2rem] bg-card p-6">
                    <h2 className="text-sm font-bold text-muted-foreground mb-6 flex items-center gap-3 uppercase tracking-wider">
                        <div className="bg-[#11a657]/10 p-1.5 rounded-lg">
                            <Users className="h-4 w-4 text-[#11a657]" />
                        </div>
                        Picks for You
                    </h2>
                    <div className="space-y-5">
                        {[
                            { name: 'Jane Smith', handle: 'janesmith', avatar: 'jane' },
                            { name: 'David Park', handle: 'davidpark', avatar: 'david' },
                            { name: 'Lisa Wang', handle: 'lisawang', avatar: 'lisa' },
                        ].map((user) => (
                            <div key={user.handle} className="flex items-center justify-between gap-3 group">
                                <div className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer">
                                    <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-[#11a657]/30 transition-all shadow-sm">
                                        <AvatarImage
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                                            alt={user.name}
                                        />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="text-[14px] font-bold text-foreground group-hover:underline truncate">{user.name}</p>
                                        <p className="text-[12px] font-medium text-muted-foreground truncate">@{user.handle}</p>
                                    </div>
                                </div>
                               <FollowButton/>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </div>
    );
}

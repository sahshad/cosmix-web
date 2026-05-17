import React from 'react';
import { Compass } from 'lucide-react';
import { PostCard, PostData } from '@/components/internal/post-card';

const discoverPosts: PostData[] = [
    {
        id: 101,
        author: {
            name: 'Tech Insider',
            handle: '@techinsider',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
            verified: true,
        },
        content: 'Breaking: The new framework just dropped and it completely changes how we build web apps. Thread below 👇',
        media: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
        timestamp: '1 hour ago',
        likes: 1245,
        replies: 156,
        reposts: 342,
        views: '105K',
        liked: false,
    },
    {
        id: 102,
        author: {
            name: 'Design Digest',
            handle: '@designdigest',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
            verified: false,
        },
        content: '10 UI patterns that will dominate 2024. A comprehensive guide for product designers.',
        media: null,
        timestamp: '3 hours ago',
        likes: 892,
        replies: 45,
        reposts: 120,
        views: '45K',
        liked: true,
    },
];

export function ExploreFeed() {
    return (
        <div>
            <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-foreground">
                <Compass className="h-5 w-5 text-[#f8b301]" />
                Explore Feed
            </h2>
            <div className="space-y-8">
                {discoverPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

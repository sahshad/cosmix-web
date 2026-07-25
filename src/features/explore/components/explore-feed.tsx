import React from 'react';
import { Compass } from 'lucide-react';
import { PostCard, PostData } from '@/features/feed/components';

// const discoverPosts: PostData[] = [
//     {
//         id: 101,
//         user: {
//             id: 'tech_insider',
//             displayName: 'Tech Insider',
//             username: '@techinsider',
//             avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
//             isVerified: true,
//             email: 'tech@cosmix.com',
//             isActive: true,
//             isEmailVerified: true,
//             lastLoginAt: '',
//             createdAt: '',
//             updatedAt: '',
//         },
//         content: 'Breaking: The new framework just dropped and it completely changes how we build web apps. Thread below 👇',
//         media: [
//             {
//                 public_id: 'media_101',
//                 url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
//                 type: 'image',
//             }
//         ],
//         createdAt: '1 hour ago',
//         updatedAt: '1 hour ago',
//         likesCount: 1245,
//         commentsCount: 156,
//         repostCount: 342,
//         isLiked: false,
//         isReposted: false,
//     },
//     {
//         id: 102,
//         user: {
//             id: 'design_digest',
//             displayName: 'Design Digest',
//             username: '@designdigest',
//             avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
//             isVerified: false,
//             email: 'design@cosmix.com',
//             isActive: true,
//             isEmailVerified: true,
//             lastLoginAt: '',
//             createdAt: '',
//             updatedAt: '',
//         },
//         content: '10 UI patterns that will dominate 2024. A comprehensive guide for product designers.',
//         media: undefined,
//         createdAt: '3 hours ago',
//         updatedAt: '3 hours ago',
//         likesCount: 892,
//         commentsCount: 45,
//         repostCount: 120,
//         isLiked: true,
//         isReposted: false,
//     },
// ];

export function ExploreFeed({posts}: { posts: PostData[]; }) {
    return (
        <div>
            <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2 text-foreground">
                <Compass className="h-5 w-5 text-vivid-yellow" />
                Explore Feed
            </h2>
            <div className="space-y-8">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

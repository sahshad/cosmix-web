'use client';

import { useState } from 'react';
import { ProfileHeader, ProfileData } from './_components/profile-header';
import { ProfileTabs } from './_components/profile-tabs';
import { ProfileGallery } from './_components/profile-gallery';
import { TrendingPanel } from '@/components/widgets/trending-panel';
import { SuggestedUsers } from '@/components/widgets/suggested-users';
import { PostData } from '@/components/post/post-card';

const userProfile: ProfileData = {
  name: 'Sarah Johnson',
  handle: '@sarahjohnson',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix',
  banner:
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop',
  bio: 'Product Designer & Digital Creative. Building the future of social experiences at Cosmix 🌌. Coffee enthusiast ☕ | Explorer 🗺️',
  location: 'San Francisco, CA',
  website: 'sarah.design',
  joinDate: 'Joined March 2023',
  followers: 12543,
  following: 854,
  isMe: true,
  verified: true,
};

const userPosts: PostData[] = [
  {
    id: 101,
    user: {
      id: 'sarahjohnson',
      displayName: 'Sarah Johnson',
      username: '@sarahjohnson',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix',
      isVerified: true,
      email: 'sarah@cosmix.com',
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: '',
      createdAt: '',
      updatedAt: '',
    },
    content:
      'Just finished redesigning the Cosmix profile experience. We wanted something that felt more professional, airy, and mature. What do you think about the new feed? ✨',
    media: [
      {
        public_id: 'media_101',
        url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
      },
    ],
    createdAt: '3h ago',
    updatedAt: '3h ago',
    likesCount: 1242,
    commentsCount: 89,
    repostCount: 156,
    isLiked: true,
    isReposted: false,
  },
  {
    id: 102,
    user: {
      id: 'sarahjohnson',
      displayName: 'Sarah Johnson',
      username: '@sarahjohnson',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix',
      isVerified: true,
      email: 'sarah@cosmix.com',
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: '',
      createdAt: '',
      updatedAt: '',
    },
    content:
      "Architecture is not about space but about time. Every design we build at Cosmix is a commitment to the user's future. 🛠️",
    media: undefined,
    createdAt: '1d ago',
    updatedAt: '1d ago',
    likesCount: 856,
    commentsCount: 42,
    repostCount: 23,
    isLiked: false,
    isReposted: false,
  },
  {
    id: 103,
    user: {
      id: 'sarahjohnson',
      displayName: 'Sarah Johnson',
      username: '@sarahjohnson',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix',
      isVerified: true,
      email: 'sarah@cosmix.com',
      isActive: true,
      isEmailVerified: true,
      lastLoginAt: '',
      createdAt: '',
      updatedAt: '',
    },
    content:
      'Early morning creativity boost. Sometimes all you need is a fresh perspective and a good cup of coffee. 🪴',
    media: [
      {
        public_id: 'media_103',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
        type: 'image',
      },
    ],
    createdAt: '2d ago',
    updatedAt: '2d ago',
    likesCount: 2103,
    commentsCount: 156,
    repostCount: 342,
    isLiked: true,
    isReposted: false,
  },
];

export default function ProfilePage() {
  const [posts, setPosts] = useState<PostData[]>(userPosts);

  const handleLike = (postId: number | string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
            }
          : post
      )
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 p-6 max-w-[1250px] mx-auto animate-fade-in-up">
      {/* Left Column */}
      <div className="space-y-6">
        <ProfileHeader profile={userProfile} />
        <ProfileTabs posts={posts} onLike={handleLike} />
      </div>

      {/* Right Column */}
      <div className="space-y-8 hidden lg:block">
        <ProfileGallery posts={posts} />
        <SuggestedUsers title="Picks for You" iconColor="var(--brand-primary)" />
        <TrendingPanel
          title="Trending in Cosmos"
          trends={[
            { tag: 'CosmixDesign', posts: '12K', rank: '01' },
            { tag: 'MatureWeb', posts: '8K', rank: '02' },
          ]}
        />
      </div>
    </div>
  );
}

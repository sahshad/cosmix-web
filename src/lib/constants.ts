import {
  Home,
  Compass,
  Bell,
  MessageCircle,
  Users,
  ShieldCheck,
  List,
  Bookmark,
  TrendingUp,
  User,
  Settings,
} from 'lucide-react';

// ─── Brand ────────────────────────────────────────────────────────────────────
export const BRAND_COLOR = 'var(--brand-primary)';
export const BRAND_COLOR_GREEN = '#11a657';
export const BRAND_COLOR_RED = '#f84b4b';
export const BRAND_COLOR_YELLOW = '#f8b301';
export const BRAND_COLOR_PURPLE = '#8b5cf6';

// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  matchAll?: string[];
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', icon: Home, href: '/', matchAll: ['/', '/dashboard'] },
  { label: 'Explore', icon: Compass, href: '/explore' },
  { label: 'Notifications', icon: Bell, href: '/notifications', badge: 3 },
  { label: 'Messages', icon: MessageCircle, href: '/messages', badge: 2 },
  { label: 'Communities', icon: Users, href: '/communities' },
  { label: 'Verified', icon: ShieldCheck, href: '/verified' },
  { label: 'Lists', icon: List, href: '/lists' },
  { label: 'Bookmarks', icon: Bookmark, href: '/bookmarks' },
  { label: 'Trending', icon: TrendingUp, href: '/trending' },
  { label: 'Following', icon: Users, href: '/following' },
  { label: 'Profile', icon: User, href: '/profile' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

// ─── React Query Keys ─────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  feed: 'feed',
  me: 'me',
  profile: (userId: string) => ['profile', userId],
  post: (postId: string | number) => ['post', postId],
} as const;

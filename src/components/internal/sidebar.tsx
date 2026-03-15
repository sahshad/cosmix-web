'use client';

import React from 'react';
import {
  Home,
  Compass,
  Heart,
  MessageCircle,
  Bookmark,
  Settings,
  LogOut,
  Search,
  MoreHorizontal,
  Users,
  TrendingUp,
  Bell,
  Share2,
  User,
  Moon,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navigationItems = [
  {
    label: 'Home',
    icon: Home,
    href: '/dashboard',
  },
  {
    label: 'Explore',
    icon: Compass,
    href: '/explore',
  },
  {
    label: 'Notifications',
    icon: Bell,
    href: '/notifications',
    badge: 3,
  },
  {
    label: 'Messages',
    icon: MessageCircle,
    href: '/messages',
    badge: 2,
  },
  {
    label: 'Bookmarks',
    icon: Bookmark,
    href: '/bookmarks',
  },
  {
    label: 'Trending',
    icon: TrendingUp,
    href: '/trending',
  },
  {
    label: 'Following',
    icon: Users,
    href: '/following',
  },
  {
    label: 'Profile',
    icon: User,
    href: '/profile',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isOpen = state === 'expanded';

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-accent-foreground">C</span>
            </div>
            {isOpen && <span className="font-serif text-lg font-semibold text-foreground">Cosmix</span>}
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  className="h-10 rounded-lg hover:bg-secondary transition-colors relative"
                  title={!isOpen ? item.label : undefined}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {isOpen && (
                      <>
                        <span className="text-base font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {!isOpen && item.badge && (
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {isOpen && (
          <div className="mt-6 px-2">
            <Button className="w-full h-10 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <Share2 className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between rounded-lg p-2 hover:bg-secondary transition-colors" title="User menu">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix" alt="User" />
                      <AvatarFallback>CM</AvatarFallback>
                    </Avatar>
                    {isOpen && (
                      <div className="text-left min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground truncate">@sarahjohnson</p>
                      </div>
                    )}
                  </div>
                  {isOpen && <MoreHorizontal className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix" alt="User" />
                      <AvatarFallback>CM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">View Profile</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Moon className="h-4 w-4 mr-2" />
                  Dark Mode
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

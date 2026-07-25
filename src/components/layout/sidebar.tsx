'use client';

import {
  Settings,
  LogOut,
  MoreHorizontal,
  Share2,
  Moon,
  Sun,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { UserAvatar } from '@/components/shared';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
// import { useAuthStore } from '@/store/auth.store';
import { NAV_ITEMS } from '@/lib/constants';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { dicebearUrl } from '@/lib/utils';

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const { data: user } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  const isCollapsed = state === 'collapsed';

  const { mutateAsync: logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // const user = useAuthStore((state) => state.user);
  const displayName = user?.displayName || '';
  const userHandle = '@' + (user?.username || '');
  const avatarUrl = user?.avatarUrl ?? dicebearUrl('cosmix');

  const renderMenuItems = () => (
    <SidebarMenu className="gap-1.5 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.matchAll
          ? item.matchAll.includes(pathname)
          : pathname === item.href;

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={`h-11 rounded-xl transition-all duration-300 relative group overflow-hidden text-muted-foreground hover:text-foreground hover:bg-transparent active:bg-transparent font-medium data-[active=true]:bg-vivid-blue/6 data-[active=true]:text-vivid-blue data-[active=true]:hover:text-vivid-blue data-[active=true]:font-semibold ${isCollapsed ? 'justify-center p-0' : ''}`}
              tooltip={item.label}
              onClick={() => setOpenMobile(false)}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 w-full ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 bg-vivid-blue rounded-full" />
                )}
                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                />
                {!isCollapsed && (
                  <>
                    <span className="text-[14px] truncate">{item.label}</span>
                    {item.badge && (
                      <SidebarMenuBadge className="bg-[#f84b4b] text-white font-bold opacity-100 group-hover:scale-110 transition-transform">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50 bg-card/60 backdrop-blur-xl animate-fade-in-left transition-all duration-300"
    >
      <SidebarHeader
        className={`pt-6 pb-2 px-4 transition-all duration-300 ${isCollapsed ? 'flex flex-col items-center gap-6' : 'gap-4'}`}
      >
        <div
          className={`flex items-center transition-all duration-300 ${isCollapsed ? 'flex-col gap-4' : 'justify-between gap-2 px-2'}`}
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-vivid-blue shadow-lg shadow-vivid-blue/20 flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
              <span className="text-xl font-black text-white z-10 relative">C</span>
            </div>
            {!isCollapsed && (
              <span className="font-sans text-lg font-bold tracking-[0.2em] text-foreground transition-all duration-300 animate-in fade-in slide-in-from-left-2">
                COSMIX
              </span>
            )}
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 gap-2">
        {renderMenuItems()}
      </SidebarContent>

      <SidebarFooter
        className={`px-3 bg-transparent flex flex-col transition-all duration-300 ${isCollapsed ? 'items-center gap-6' : ''}`}
      >
        <SidebarMenu className={isCollapsed ? 'items-center' : ''}>
          <SidebarMenuItem>
            {isCollapsed && (
              <SidebarMenuButton
                tooltip="Create Post"
                className="h-10 w-10 p-0 flex items-center justify-center rounded-xl bg-foreground text-background hover:bg-vivid-blue hover:text-white mx-auto shadow-md transition-all"
              >
                <Share2 className="h-5 w-5" />
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className={`rounded-2xl hover:bg-secondary transition-all group flex items-center focus:outline-none focus-visible:ring-0 focus-visible:outline-none ${isCollapsed ? 'h-10 w-10 p-0 justify-center' : 'w-full h-14 px-3 gap-3'
                }`}
            >
              <UserAvatar
                src={avatarUrl}
                alt="User"
                fallback={displayName?.[0] || 'U'}
                className={`${isCollapsed ? 'h-8 w-8' : 'h-9 w-9'} flex-shrink-0 ring-2 ring-transparent group-hover:ring-vivid-blue/30 transition-all`}
                fallbackClassName="text-[10px]"
              />
              {!isCollapsed && (
                <div className="text-left min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate font-medium">{userHandle}</p>
                </div>
              )}
              {!isCollapsed && <MoreHorizontal className="h-4 w-4 text-muted-foreground" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isCollapsed ? 'center' : 'end'}
            side={isCollapsed ? 'right' : 'top'}
            className="w-64 rounded-2xl p-2 shadow-2xl border-border/40 bg-card z-50"
          >
            <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer mb-1">
              <Link
                href="/profile"
                className="flex items-center gap-3"
                onClick={() => setOpenMobile(false)}
              >
                <UserAvatar src={avatarUrl} alt="User" fallback={displayName?.[0] || 'U'} size="md" />
                <div>
                  <p className="text-sm font-bold">{displayName}</p>
                  <p className="text-xs text-muted-foreground">View profile</p>
                </div>
              </Link>
            </DropdownMenuItem>
            <Separator className="my-1" />
            <DropdownMenuItem
              asChild
              className="rounded-xl cursor-pointer py-2.5"
              onClick={() => setOpenMobile(false)}
            >
              <Link href="/settings" className="flex items-center w-full">
                <Settings className="h-4 w-4 mr-3" />
                Settings & Privacy
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl cursor-pointer py-2.5"
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
                setOpenMobile(false);
              }}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 mr-3" />
              ) : (
                <Moon className="h-4 w-4 mr-3" />
              )}
              Toggle Theme
            </DropdownMenuItem>
            <Separator className="my-1" />
            <DropdownMenuItem
              className="rounded-xl cursor-pointer py-2.5"
              onClick={() => {
                handleLogout();
                setOpenMobile(false);
              }}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

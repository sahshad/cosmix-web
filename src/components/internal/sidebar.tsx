'use client';

import {
  Home,
  Compass,
  MessageCircle,
  Bookmark,
  Settings,
  LogOut,
  MoreHorizontal,
  Users,
  TrendingUp,
  Bell,
  Share2,
  User,
  Moon,
  Sun,
  ShieldCheck,
  List,
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
  SidebarInput,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useLogout } from '@/hooks/useAuth';
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface NavItem {
  label: string;
  icon: any;
  href: string;
  matchAll?: string[];
  badge?: number;
}

const data: {
  user: { name: string; handle: string; avatar: string };
  navigation: NavItem[];
} = {
  user: {
    name: "Sarah Johnson",
    handle: "@sarahjohnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cosmix",
  },
  navigation: [
    { label: "Home", icon: Home, href: "/", matchAll: ["/", "/dashboard"] },
    { label: "Explore", icon: Compass, href: "/explore" },
    { label: "Notifications", icon: Bell, href: "/notifications", badge: 3 },
    { label: "Messages", icon: MessageCircle, href: "/messages", badge: 2 },
    { label: "Communities", icon: Users, href: "/communities" },
    { label: "Verified", icon: ShieldCheck, href: "/verified" },
    { label: "Lists", icon: List, href: "/lists" },
    { label: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
    { label: "Trending", icon: TrendingUp, href: "/trending" },
    { label: "Following", icon: Users, href: "/following" },
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ],
}

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  
  const isCollapsed = state === 'collapsed';

  const { mutateAsync: logout } = useLogout();

  const handleLogout = async() => {
   try {
      await logout();          
      router.replace("/login");   
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderMenuItems = (items: NavItem[]) => (
    <SidebarMenu className="gap-1.5 px-3">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.matchAll 
            ? item.matchAll.includes(pathname) 
            : pathname === item.href;
            
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={`h-11 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                isActive 
                  ? 'bg-[#2d7af1]/10 text-[#2d7af1] font-semibold' 
                  : 'hover:bg-secondary text-muted-foreground hover:text-foreground font-medium'
               } ${isCollapsed ? 'justify-center p-0' : ''}`}
              tooltip={item.label}
              onClick={() => setOpenMobile(false)}
            >
              <Link href={item.href} className={`flex items-center gap-3 w-full ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}>
                {/* Active pill indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#2d7af1] rounded-r-full" />
                )}
                
                <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                
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
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-card/60 backdrop-blur-xl animate-fade-in-left transition-all duration-300">
      <SidebarHeader className={`pt-6 pb-2 px-4 transition-all duration-300 ${isCollapsed ? 'flex flex-col items-center gap-6' : 'gap-4'}`}>
        <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'flex-col gap-4' : 'justify-between gap-2 px-2'}`}>
          <Link href="/" className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl bg-[#2d7af1] shadow-lg shadow-[#2d7af1]/20 flex items-center justify-center flex-shrink-0 relative overflow-hidden group`}>
              <span className="text-xl font-black text-white z-10 relative">C</span>
            </div>
            {!isCollapsed && (
              <span className="font-sans text-lg font-bold tracking-[0.2em] text-foreground transition-all duration-300 animate-in fade-in slide-in-from-left-2">COSMIX</span>
            )}
          </Link>
        </div>
        {!isCollapsed && (
          <div className="px-2 pb-2">
             <div className="relative group">
               <SidebarInput 
                  placeholder="Search cosmos..." 
                  className="bg-secondary/40 border-none rounded-xl pl-10 h-10 group-hover:bg-secondary/60 transition-colors"
                />
               <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#2d7af1] transition-colors" />
             </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="py-2 gap-2 custom-scrollbar">
         {renderMenuItems(data.navigation)}
      </SidebarContent>

      <SidebarFooter className={`p-4 border-t border-border/40 bg-transparent flex flex-col transition-all duration-300 ${isCollapsed ? 'items-center gap-6' : 'gap-4'}`}>
        <SidebarMenu className={isCollapsed ? 'items-center' : ''}>
          <SidebarMenuItem className={isCollapsed ? '' : 'mb-4'}>
             {isCollapsed ? (
               <SidebarMenuButton tooltip="Create Post" className="h-10 w-10 p-0 flex items-center justify-center rounded-xl bg-foreground text-background hover:bg-[#2d7af1] hover:text-white mx-auto shadow-md transition-all">
                 <Share2 className="h-5 w-5" />
               </SidebarMenuButton>
             ) : (
               <Button className="w-full h-11 rounded-2xl bg-foreground text-background hover:bg-[#2d7af1] hover:text-white shadow-xl hover:-translate-y-0.5 transition-all font-bold text-sm">
                 <Share2 className="h-4 w-4 mr-2" />
                 Create Post
               </Button>
             )}
          </SidebarMenuItem>
        </SidebarMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className={`rounded-2xl hover:bg-secondary transition-all group flex items-center ${isCollapsed ? 'h-10 w-10 p-0 justify-center' : 'w-full h-14 px-3 gap-3'}`}>
               <Avatar className={`${isCollapsed ? 'h-8 w-8' : 'h-9 w-9'} flex-shrink-0 ring-2 ring-transparent group-hover:ring-[#2d7af1]/30 transition-all`}>
                  <AvatarImage src={data.user.avatar} alt="User" />
                  <AvatarFallback className="text-[10px]">SJ</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground truncate">{data.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate font-medium">{data.user.handle}</p>
                  </div>
                )}
                {!isCollapsed && <MoreHorizontal className="h-4 w-4 text-muted-foreground" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isCollapsed ? "center" : "end"} side={isCollapsed ? "right" : "top"} className="w-64 rounded-2xl p-2 shadow-2xl border-border/40 bg-card z-50">
            <DropdownMenuItem asChild className="rounded-xl p-3 cursor-pointer mb-1">
              <Link href="/profile" className="flex items-center gap-3" onClick={() => setOpenMobile(false)}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={data.user.avatar} alt="User" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold">{data.user.name}</p>
                  <p className="text-xs text-muted-foreground">View profile</p>
                </div>
              </Link>
            </DropdownMenuItem>
            <Separator className="my-1" />
            <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5" onClick={() => setOpenMobile(false)}>
              <Link href="/settings" className="flex items-center w-full">
                <Settings className="h-4 w-4 mr-3" />
                Settings & Privacy
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5" onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setOpenMobile(false); }}>
              {theme === 'dark' ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
              Toggle Theme
            </DropdownMenuItem>
            <Separator className="my-1" />
            <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 text-[#f84b4b] focus:text-[#f84b4b] focus:bg-[#f84b4b]/10" onClick={() => { handleLogout(); setOpenMobile(false); }}>
              <LogOut className="h-4 w-4 mr-3" />
              Log out {data.user.handle}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}


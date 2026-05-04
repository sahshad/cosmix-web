"use client"

import { AppSidebar } from "@/components/internal/sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useMe } from "@/hooks/useAuth"
import { useAuthStore } from "@/store/auth.store"
import { useEffect, useState, useCallback, useRef } from "react"
import { Search, Bell } from "lucide-react"
import Link from "next/link"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { isLoading, data: response } = useMe()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const setUser = useAuthStore((state) => state.setUser)
    const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)

    // Scroll Header Logic
    const [isVisible, setIsVisible] = useState(true)
    const lastScrollY = useRef(0)
    
    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY
        
        // Always show at the top
        if (currentScrollY < 10) {
            setIsVisible(true)
            return
        }

        // Hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY.current + 5) {
            setIsVisible(false) // Scrolling down
        } else if (currentScrollY < lastScrollY.current - 5) {
            setIsVisible(true) // Scrolling up
        }
        
        lastScrollY.current = currentScrollY
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [handleScroll])

    useEffect(() => {
        if (response?.data) {
            setUser(response.data.user)
            setIsAuthenticated(true)
        }
    }, [response, setUser, setIsAuthenticated])

    if (!isAuthenticated && isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset className="flex flex-col flex-1 relative min-h-screen">
                {/* Smart Mobile Header */}
                <header 
                    className={`flex h-14 shrink-0 items-center justify-between gap-2 transition-all duration-500 ease-in-out lg:hidden border-b border-border/5 px-4 bg-background/80 backdrop-blur-xl sticky top-0 z-50 ${
                        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="h-9 w-9 bg-secondary/50 rounded-lg text-[#2d7af1]" />
                        <span className="text-sm font-black tracking-widest text-[#2d7af1]">COSMIX</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </button>
                        <Link href="/notifications" className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors relative">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <div className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-[#f84b4b] rounded-full ring-2 ring-background" />
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-0">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

"use client"

import { AppSidebar } from "@/components/internal/sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <div className="flex flex-col flex-1 w-full">
                <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-16 items-center gap-4 px-4 md:px-6">
                        <SidebarTrigger className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SidebarTrigger>
                        <div className="flex-1" />
                    </div>
                </header>
                <main className="flex-1 overflow-auto bg-background">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}

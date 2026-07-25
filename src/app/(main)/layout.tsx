"use client"

import { AppSidebar } from "@/components/layout/sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { CenteredLoader } from "@/components/shared"
import { useCurrentUser } from "@/hooks/useAuth"
import { useAuthStore } from "@/store/auth.store"
import { useEffect } from "react"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, data: user } = useCurrentUser()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  // const setUser = useAuthStore((state) => state.setUser)
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)

  useEffect(() => {
    if (user) {
      // setUser(user)
      setIsAuthenticated(true)
    }
  }, [user, setIsAuthenticated])

  if (!isAuthenticated && isLoading) {
    return <CenteredLoader className="h-screen items-center" size="2xl" spinnerClassName="text-vivid-blue" />
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 relative min-h-screen">
        <MobileHeader />
        <main className="flex-1 p-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Sparkles, Moon, Sun } from "lucide-react"
import { useLogin } from "@/hooks/useAuth"
import { toast } from "sonner"
import { extractApiError } from "@/lib/error"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const loginMutation = useLogin()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    loginMutation.mutate({
      email,
      password,
    }, {
      onSuccess: () => {
        toast.success("Login successful")
        router.replace("/")
      },
      onError: (error: unknown) => {
        const apiError = extractApiError(error)
        toast.error(apiError.message)
      }
    })
  }

  return (
    <main className="h-[100dvh] w-full flex bg-background overflow-hidden relative selection:bg-vivid-blue/30">

      {/* Left Panel - Hero Graphic (Uneven Wave Separator) */}
      <div className="hidden lg:flex lg:w-[50%] h-full relative bg-[#f8f9fa] dark:bg-[#090b14] items-center justify-center p-12 overflow-hidden transition-colors duration-500">
          
          {/* Background Layer constrained to this panel */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-100">
              <div className="absolute top-[-20%] -right-[10%] w-[800px] h-[800px] bg-vivid-blue/20 rounded-full blur-[140px] transition-all animate-[spin_50s_linear_infinite]" />
              <div className="absolute top-[30%] -left-[10%] w-[600px] h-[600px] bg-[#11a657]/15 rounded-full blur-[120px] transition-all animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute -bottom-[20%] right-[30%] w-[700px] h-[700px] bg-[#f8b301]/15 rounded-full blur-[140px] transition-all animate-pulse" />
          </div>

          <div className="relative z-10 w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
              {/* Glass Card */}
              <div className="relative p-10 rounded-[2.5rem] bg-white/10 dark:bg-white/5 backdrop-blur-3xl border border-black/5 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-vivid-blue/10 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-1000 ease-in-out"></div>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-vivid-blue to-vivid-blue-dark rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-vivid-blue/20">
                      <span className="text-3xl text-white font-black tracking-tighter">C</span>
                  </div>

                  <h2 className="text-foreground dark:text-white text-[32px] font-bold mb-4 tracking-tight flex items-center gap-3">
                      Welcome to Cosmix <Sparkles className="w-6 h-6 text-[#f8b301]" />
                  </h2>
                  <p className="text-muted-foreground dark:text-white/70 text-sm font-medium leading-relaxed max-w-[340px]">
                     A vibrant layer for authentic connections. We blend high-performance infrastructure with a universe of color.
                  </p>
                  
                  {/* Mature Interactive Color Bars */}
                  <div className="mt-10 flex items-center gap-3">
                      <div className="h-1.5 w-12 group-hover:w-16 bg-vivid-blue rounded-full transition-all duration-700 ease-out opacity-80 group-hover:opacity-100" />
                      <div className="h-1.5 w-5 group-hover:w-10 bg-[#11a657] rounded-full transition-all duration-700 ease-out delay-75 opacity-70 group-hover:opacity-100" />
                      <div className="h-1.5 w-5 group-hover:w-8 bg-[#f8b301] rounded-full transition-all duration-700 ease-out delay-150 opacity-60 group-hover:opacity-100" />
                  </div>
              </div>
              
              <div className="mt-12 ml-4 text-muted-foreground dark:text-white/30 text-[11px] font-bold tracking-widest uppercase">
                 © 2024 COSMIX STUDIOS
              </div>
          </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-[50%] h-full flex flex-col justify-center bg-background relative z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Theme Toggle Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-6 right-6 lg:top-8 lg:right-10 rounded-full z-50 text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Sun className="h-[20px] w-[20px] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[20px] w-[20px] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="w-full max-w-[500px] m-auto flex flex-col p-10 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-vivid-blue to-vivid-blue-dark flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xl tracking-tighter">C</span>
            </div>
            <span className="text-foreground text-2xl font-bold tracking-tight">Cosmix</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="font-bold text-[26px] text-foreground tracking-tight mb-2">Welcome back</h2>
            <p className="text-muted-foreground font-medium text-[15px]">Please enter your details to sign in.</p>
          </div>

          {/* Social Logins */}
          <div className="flex gap-4 mb-8">
            <Button variant="outline" className="flex-1 h-12 bg-transparent hover:bg-secondary/60 border-border hover:border-vivid-blue/40 hover:text-vivid-blue text-[14px] font-bold transition-all group rounded-xl" type="button">
              <svg className="w-[18px] h-[18px] mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                 <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                 <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                 <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                 <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
          </div>
          
          {/* Divider */}
          <div className="relative mb-6 flex items-center">
             <Separator className="flex-1 opacity-60 bg-border/60" />
             <span className="shrink-0 px-4 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Or continue with
             </span>
             <Separator className="flex-1 opacity-60 bg-border/60" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] font-bold text-foreground pl-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[15px] px-4 shadow-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <Label htmlFor="password" className="text-[13px] font-bold text-foreground">
                   Password
                </Label>
                <Link href="/forgot-password" className="text-[12px] font-black text-vivid-blue hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[15px] px-4 pr-10 shadow-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-vivid-blue transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-vivid-blue hover:bg-vivid-blue-hover text-white text-[15px] font-bold transition-all mt-6 shadow-lg shadow-vivid-blue/20 hover:shadow-xl hover:shadow-vivid-blue/30 hover:-translate-y-0.5"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-[14px] font-medium text-muted-foreground">
             Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-vivid-blue font-black hover:underline">
              Sign up
            </Link>
          </p>

        </div>
      </div>

    </main>
  )
}

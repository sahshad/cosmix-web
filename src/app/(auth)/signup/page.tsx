"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Check, Heart, Moon, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSignup } from '@/hooks/useAuth'
import { toast } from "sonner"
import { extractApiError } from "@/lib/error"
import { useTheme } from "next-themes"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter();
  const signupMutation = useSignup();
  const { theme, setTheme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    signupMutation.mutate({
      displayName: name,
      email,
      password,
    }, {
      onSuccess: () => {
        toast.success("Signup successful");
        router.replace("/");
      },
      onError: (error: unknown) => {
        const apiError = extractApiError(error);
        toast.error(apiError.message);
      }
    })
  }

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  return (
    <main className="h-[100dvh] w-full flex bg-background overflow-hidden relative selection:bg-vivid-blue/30">

      {/* Left Panel - Signup Form */}
      <div className="w-full lg:w-[50%] h-full flex flex-col bg-background relative z-30 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Theme Toggle Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-6 left-6 lg:top-8 lg:left-10 rounded-full z-50 text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Sun className="h-[20px] w-[20px] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[20px] w-[20px] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Form Container */}
        <div className="w-full max-w-[500px] mx-auto mt-auto mb-auto flex flex-col pb-10 pt-20 lg:pt-20 lg:pb-16 px-10 lg:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          
          {/* Header */}
          <div className="mb-6">
            <h2 className="font-bold text-[26px] text-foreground tracking-tight mb-2">Create an account</h2>
            <p className="text-muted-foreground font-medium text-[15px]">Join the platform to begin creating.</p>
          </div>

          {/* Social Logins */}
          <div className="flex gap-4 mb-6">
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[13px] font-bold text-foreground pl-1">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                className="h-12 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[15px] px-4 shadow-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] font-bold text-foreground pl-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[15px] px-4 shadow-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <Label htmlFor="password" className="text-[13px] font-bold text-foreground">
                   Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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

              {/* Password Requirements */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5 pt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-black pl-1">
                    <span className={`transition-colors flex items-center ${hasMinLength ? 'text-vivid-blue' : 'text-muted-foreground'}`}>
                        {hasMinLength ? <Check className="w-[14px] h-[14px] mr-1" /> : <div className="w-[12px] h-[12px] inline-block mr-1.5 rounded-full border border-muted opacity-50" />}8+ chars
                    </span>
                    <span className={`transition-colors flex items-center ${hasUppercase ? 'text-vivid-blue' : 'text-muted-foreground'}`}>
                        {hasUppercase ? <Check className="w-[14px] h-[14px] mr-1" /> : <div className="w-[12px] h-[12px] inline-block mr-1.5 rounded-full border border-muted opacity-50" />}Uppercase
                    </span>
                    <span className={`transition-colors flex items-center ${hasNumber ? 'text-vivid-blue' : 'text-muted-foreground'}`}>
                        {hasNumber ? <Check className="w-[14px] h-[14px] mr-1" /> : <div className="w-[12px] h-[12px] inline-block mr-1.5 rounded-full border border-muted opacity-50" />}Number
                    </span>
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2.5 pt-2 pb-2 pl-1">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked: boolean) => setAcceptTerms(checked)}
                className="rounded-[4px] border-border data-[state=checked]:bg-vivid-blue data-[state=checked]:text-white data-[state=checked]:border-vivid-blue transition-all h-[18px] w-[18px]"
              />
              <Label htmlFor="terms" className="text-[13px] text-muted-foreground font-medium leading-relaxed cursor-pointer select-none mt-0.5">
                I agree to the{" "}
                <Link href="/terms" className="text-vivid-blue font-bold hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-vivid-blue font-bold hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-vivid-blue hover:bg-vivid-blue-hover text-white text-[15px] font-bold transition-all mt-4 shadow-lg shadow-vivid-blue/20 hover:shadow-xl hover:shadow-vivid-blue/25 hover:-translate-y-0.5"
              disabled={signupMutation.isPending || !acceptTerms}
            >
              {signupMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-[14px] font-medium text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-vivid-blue font-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Hero Graphic (Uneven Wave Separator) */}
      <div className="hidden lg:flex lg:w-[50%] h-full relative bg-[#f8f9fa] dark:bg-[#090b14] items-center justify-center p-12 overflow-hidden transition-colors duration-500">
          
          {/* Background Layer constrained to this panel */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-100">
              <div className="absolute top-[-10%] -left-[10%] w-[800px] h-[800px] bg-[#11a657]/20 rounded-full blur-[140px] transition-all animate-[spin_50s_linear_infinite]" />
              <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-vivid-blue/15 rounded-full blur-[120px] transition-all animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute -bottom-[20%] left-[30%] w-[700px] h-[700px] bg-[#f8b301]/15 rounded-full blur-[140px] transition-all animate-pulse" />
          </div>

          <div className="relative z-10 w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
              {/* Glass Card */}
              <div className="relative p-10 rounded-[2.5rem] bg-white/10 dark:bg-white/5 backdrop-blur-3xl border border-black/5 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden group">
                  <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#11a657]/15 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-1000 ease-in-out"></div>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-[#11a657] to-vivid-blue-dark rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-[#11a657]/20">
                      <Heart className="text-white w-7 h-7 fill-current" />
                  </div>

                  <h2 className="text-foreground dark:text-white text-[32px] font-bold mb-4 tracking-tight">Expand your horizon.</h2>
                  <p className="text-muted-foreground dark:text-white/70 text-sm font-medium leading-relaxed max-w-[340px]">
                     A meticulous network designed for modern creators. Scale your ideas rapidly and securely.
                  </p>
                  
                  {/* Mature Interactive Color Bars */}
                  <div className="mt-10 flex items-center gap-3">
                      <div className="h-1.5 w-6 group-hover:w-10 bg-[#11a657] rounded-full transition-all duration-700 ease-out opacity-70 group-hover:opacity-100" />
                      <div className="h-1.5 w-14 group-hover:w-16 bg-vivid-blue rounded-full transition-all duration-700 ease-out delay-75 opacity-80 group-hover:opacity-100" />
                      <div className="h-1.5 w-6 group-hover:w-8 bg-[#f8b301] rounded-full transition-all duration-700 ease-out delay-150 opacity-60 group-hover:opacity-100" />
                  </div>
              </div>

              <div className="mt-12 mr-4 text-muted-foreground dark:text-white/30 text-[11px] font-bold tracking-widest uppercase text-right">
                 DEVELOPERS COMMUNITY
              </div>
          </div>
      </div>
    </main>
  )
}

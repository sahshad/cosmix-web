"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Moon, Sun } from "lucide-react"
import { Spinner } from "@/components/shared"
import { useForgotPassword } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import { extractApiError } from "@/lib/error"
import { useTheme } from "next-themes"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const forgotPasswordMutation = useForgotPassword()
  const { theme, setTheme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setSubmitted(true)
        },
        onError: (error: unknown) => {
          const apiError = extractApiError(error)
          toast.error(apiError.message)
        },
      }
    )
  }

  return (
    <main className="h-dvh w-full flex bg-background overflow-hidden relative selection:bg-vivid-blue/30">
      <div className="w-full h-full flex flex-col justify-center bg-background relative z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-100">
          <div className="absolute top-[-20%] -right-[10%] w-200 h-200 bg-vivid-blue/20 rounded-full blur-[140px] transition-all animate-[spin_50s_linear_infinite]" />
          <div className="absolute top-[30%] -left-[10%] w-150 h-150 bg-vivid-green/15 rounded-full blur-[120px] transition-all animate-[spin_40s_linear_infinite_reverse]" />
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute top-6 right-6 lg:top-8 lg:right-10 rounded-full z-50 text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="w-full max-w-110 m-auto flex flex-col p-10 lg:px-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-[10px] bg-linear-to-br from-vivid-blue to-vivid-blue-dark flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xl tracking-tighter">C</span>
            </div>
            <span className="text-foreground text-2xl font-bold tracking-tight">Cosmix</span>
          </div>

          {!submitted ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="font-bold text-[26px] text-foreground tracking-tight mb-2">Forgot your password?</h2>
                <p className="text-muted-foreground font-medium text-[15px]">
                  Enter the email associated with your account and we&apos;ll send you a link to reset your password.
                </p>
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

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-vivid-blue hover:bg-vivid-blue-hover text-white text-[15px] font-bold transition-all mt-6 shadow-lg shadow-vivid-blue/20 hover:shadow-xl hover:shadow-vivid-blue/30 hover:-translate-y-0.5"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="lg" />
                      Sending link...
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
              <div className="w-16 h-16 rounded-2xl bg-vivid-blue/10 flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-vivid-blue" />
              </div>
              <h2 className="font-bold text-[24px] text-foreground tracking-tight mb-2">Check your email</h2>
              <p className="text-muted-foreground font-medium text-[15px] leading-relaxed">
                If an account exists for <span className="text-foreground font-bold">{email}</span>, we&apos;ve sent a link to reset your password. The link expires in 15 minutes.
              </p>
              <Button
                variant="outline"
                className="mt-8 h-11 rounded-xl border-border hover:border-vivid-blue/40 hover:text-vivid-blue font-bold"
                onClick={() => setSubmitted(false)}
              >
                Use a different email
              </Button>
            </div>
          )}

          {/* Back to login */}
          <Link
            href="/login"
            className="mt-8 flex items-center justify-center gap-1.5 text-[14px] font-bold text-muted-foreground hover:text-vivid-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

        </div>
      </div>
    </main>
  )
}

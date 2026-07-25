"use client"

import React, { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, CheckCircle2, XCircle, Moon, Sun } from "lucide-react"
import { Spinner } from "@/components/shared"
import { useResetPassword } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import { extractApiError } from "@/lib/error"
import { useTheme } from "next-themes"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const router = useRouter()

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [reset, setReset] = useState(false)
  const resetPasswordMutation = useResetPassword()
  const { theme, setTheme } = useTheme()

  const passwordsMatch = newPassword.length === 0 || newPassword === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    resetPasswordMutation.mutate(
      {
        token,
        newPassword,
      },
      {
        onSuccess: () => {
          setReset(true)
        },
        onError: (error: unknown) => {
          const apiError = extractApiError(error)
          toast.error(apiError.message)
        },
      }
    )
  }

  return (
    <main className="h-[100dvh] w-full flex bg-background overflow-hidden relative selection:bg-vivid-blue/30">
      <div className="w-full h-full flex flex-col justify-center bg-background relative z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-100">
          <div className="absolute top-[-20%] -right-[10%] w-[800px] h-[800px] bg-vivid-blue/20 rounded-full blur-[140px] transition-all animate-[spin_50s_linear_infinite]" />
          <div className="absolute top-[30%] -left-[10%] w-[600px] h-[600px] bg-[#11a657]/15 rounded-full blur-[120px] transition-all animate-[spin_40s_linear_infinite_reverse]" />
        </div>

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

        <div className="w-full max-w-[440px] m-auto flex flex-col p-10 lg:px-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-vivid-blue to-vivid-blue-dark flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xl tracking-tighter">C</span>
            </div>
            <span className="text-foreground text-2xl font-bold tracking-tight">Cosmix</span>
          </div>

          {reset ? (
            <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
              <div className="w-16 h-16 rounded-2xl bg-[#11a657]/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-7 h-7 text-[#11a657]" />
              </div>
              <h2 className="font-bold text-[24px] text-foreground tracking-tight mb-2">Password reset</h2>
              <p className="text-muted-foreground font-medium text-[15px] leading-relaxed">
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
              <Button
                className="mt-8 w-full h-12 rounded-xl bg-vivid-blue hover:bg-vivid-blue-hover text-white text-[15px] font-bold transition-all shadow-lg shadow-vivid-blue/20 hover:shadow-xl hover:shadow-vivid-blue/30 hover:-translate-y-0.5"
                onClick={() => router.replace("/login")}
              >
                Continue to login
              </Button>
            </div>
          ) : !token ? (
            <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
                <XCircle className="w-7 h-7 text-destructive" />
              </div>
              <h2 className="font-bold text-[24px] text-foreground tracking-tight mb-2">Invalid reset link</h2>
              <p className="text-muted-foreground font-medium text-[15px] leading-relaxed">
                This password reset link is missing or malformed. Please request a new one.
              </p>
              <Link href="/forgot-password" className="mt-8 text-[14px] font-black text-vivid-blue hover:underline">
                Request a new link
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="font-bold text-[26px] text-foreground tracking-tight mb-2">Reset your password</h2>
                <p className="text-muted-foreground font-medium text-[15px]">
                  Choose a new password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-[13px] font-bold text-foreground pl-1">
                    New password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Create a new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={8}
                      maxLength={64}
                      className="h-12 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[15px] px-4 pr-10 shadow-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-vivid-blue transition-colors"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-[13px] font-bold text-foreground pl-1">
                    Confirm new password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 rounded-xl bg-secondary/30 border border-border hover:border-vivid-blue/50 focus:border-vivid-blue focus:bg-background transition-all text-[15px] px-4 shadow-none"
                    required
                  />
                  {!passwordsMatch && (
                    <p className="text-[12px] font-bold text-destructive pl-1 pt-1">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-vivid-blue hover:bg-vivid-blue-hover text-white text-[15px] font-bold transition-all mt-6 shadow-lg shadow-vivid-blue/20 hover:shadow-xl hover:shadow-vivid-blue/30 hover:-translate-y-0.5"
                  disabled={resetPasswordMutation.isPending || !passwordsMatch}
                >
                  {resetPasswordMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="lg" />
                      Resetting...
                    </span>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </form>
            </>
          )}

          {!reset && (
            <Link
              href="/login"
              className="mt-8 text-center text-[14px] font-bold text-muted-foreground hover:text-vivid-blue transition-colors"
            >
              Back to login
            </Link>
          )}

        </div>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}

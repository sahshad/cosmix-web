"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail } from "lucide-react"
import { Spinner } from "@/components/shared"
import { useForgotPassword } from "@/features/auth/hooks/useAuth"
import { AuthThemeToggle, AuthBackgroundBlobs, AuthLogo, AuthStatusPanel } from "@/features/auth/components"
import { toast } from "sonner"
import { extractApiError } from "@/lib/error"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const forgotPasswordMutation = useForgotPassword()

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

        <AuthBackgroundBlobs />
        <AuthThemeToggle />

        <div className="w-full max-w-110 m-auto flex flex-col p-10 lg:px-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">

          <AuthLogo />

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
            <AuthStatusPanel
              icon={Mail}
              tone="info"
              title="Check your email"
              description={
                <>
                  If an account exists for <span className="text-foreground font-bold">{email}</span>, we&apos;ve sent a link to reset your password. The link expires in 15 minutes.
                </>
              }
            >
              <Button
                variant="outline"
                className="mt-8 h-11 rounded-xl border-border hover:border-vivid-blue/40 hover:text-vivid-blue font-bold"
                onClick={() => setSubmitted(false)}
              >
                Use a different email
              </Button>
            </AuthStatusPanel>
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

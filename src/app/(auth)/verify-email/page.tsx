"use client"

import React, { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"
import { Spinner } from "@/components/shared"
import { useVerifyEmail } from "@/features/auth/hooks/useAuth"
import { AuthThemeToggle, AuthBackgroundBlobs, AuthLogo, AuthStatusPanel } from "@/features/auth/components"
import { toast } from "sonner"
import { extractApiError } from "@/lib/error"

function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verified, setVerified] = useState(false)
  const verifyEmailMutation = useVerifyEmail()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    verifyEmailMutation.mutate(
      { token, email, password },
      {
        onSuccess: () => {
          setVerified(true)
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

          {verified ? (
            <AuthStatusPanel
              icon={CheckCircle2}
              tone="success"
              title="Email verified"
              description="Your email has been verified. You can now sign in to your account."
            >
              <Link href="/login" className="w-full">
                <Button className="mt-8 w-full h-12 rounded-xl bg-vivid-blue hover:bg-vivid-blue-hover text-white text-[15px] font-bold transition-all shadow-lg shadow-vivid-blue/20 hover:shadow-xl hover:shadow-vivid-blue/30 hover:-translate-y-0.5">
                  Continue to login
                </Button>
              </Link>
            </AuthStatusPanel>
          ) : !token ? (
            <AuthStatusPanel
              icon={XCircle}
              tone="error"
              title="Invalid verification link"
              description="This verification link is missing or malformed. Please check your email for the correct link, or sign up again."
            >
              <Link href="/login" className="mt-8 text-[14px] font-black text-vivid-blue hover:underline">
                Back to login
              </Link>
            </AuthStatusPanel>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="font-bold text-[26px] text-foreground tracking-tight mb-2">Verify your email</h2>
                <p className="text-muted-foreground font-medium text-[15px]">
                  Confirm your account details below to finish verifying your email address.
                </p>
              </div>

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
                  <Label htmlFor="password" className="text-[13px] font-bold text-foreground pl-1">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your account password"
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
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-vivid-blue hover:bg-vivid-blue-hover text-white text-[15px] font-bold transition-all mt-6 shadow-lg shadow-vivid-blue/20 hover:shadow-xl hover:shadow-vivid-blue/30 hover:-translate-y-0.5"
                  disabled={verifyEmailMutation.isPending}
                >
                  {verifyEmailMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="lg" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify email"
                  )}
                </Button>
              </form>
            </>
          )}

        </div>
      </div>
    </main>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  )
}

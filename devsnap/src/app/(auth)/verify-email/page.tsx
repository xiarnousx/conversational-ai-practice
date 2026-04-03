"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const emailParam = searchParams.get("email") ?? ""

  const [email, setEmail] = useState(emailParam)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  async function handleResend(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResendError(null)

    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    setLoading(false)

    if (res.ok) {
      setSent(true)
    } else {
      const data = await res.json()
      setResendError(data.error ?? "Something went wrong.")
    }
  }

  return (
    <div className="space-y-4">
      {error === "expired" ? (
        <p className="text-sm text-destructive text-center">
          Your verification link has expired. Request a new one below.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          We sent a verification link to your email. Click the link to activate your account.
        </p>
      )}

      {sent ? (
        <p className="text-sm text-center text-green-500">
          A new verification email has been sent. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleResend} className="space-y-3">
          {resendError && (
            <p className="text-sm text-destructive text-center">{resendError}</p>
          )}
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Resend verification email"}
          </Button>
        </form>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Already verified?{" "}
        <Link href="/sign-in" className="underline underline-offset-4 hover:text-foreground">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
        </div>
        <Suspense>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  )
}

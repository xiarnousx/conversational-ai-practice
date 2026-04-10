import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import { rateLimit, getIp, rateLimitResponse } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = getIp(request)
  const rl = await rateLimit({ key: `forgot-password:${ip}`, limit: 3, windowSeconds: 60 * 60 })
  if (!rl.success) return rateLimitResponse(rl.reset)

  try {
    const { email } = (await request.json()) as { email: string }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // GitHub OAuth users without a password can't use this flow
    if (!user.password) {
      return NextResponse.json({ error: "github-account" }, { status: 400 })
    }

    const identifier = `reset:${email}`

    // Delete any existing reset token for this email
    await prisma.verificationToken.deleteMany({ where: { identifier } })

    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.verificationToken.create({
      data: { identifier, token, expires },
    })

    if (process.env.NODE_ENV === "development") {
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
      console.log("[forgot-password] reset URL:", resetUrl)
    } else {
      await sendPasswordResetEmail(email, token)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

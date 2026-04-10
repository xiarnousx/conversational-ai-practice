import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"
import { rateLimit, getIp, rateLimitResponse } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = getIp(request)

  try {
    const { email } = (await request.json()) as { email: string }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const rl = await rateLimit({
      key: `resend-verification:${ip}:${email}`,
      limit: 3,
      windowSeconds: 15 * 60,
    })
    if (!rl.success) return rateLimitResponse(rl.reset)

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return success to avoid email enumeration
    if (!user || user.emailVerified) {
      return NextResponse.json({ success: true })
    }

    // Delete any existing token for this email
    await prisma.verificationToken.deleteMany({ where: { identifier: email } })

    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    })

    await sendVerificationEmail(email, token)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

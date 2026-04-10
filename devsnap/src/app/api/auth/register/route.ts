import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email"
import { rateLimit, getIp, rateLimitResponse } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = getIp(request)
  const rl = await rateLimit({ key: `register:${ip}`, limit: 3, windowSeconds: 60 * 60 })
  if (!rl.success) return rateLimitResponse(rl.reset)

  try {
    const body = await request.json()
    const { name, email, password, confirmPassword } = body as {
      name: string
      email: string
      password: string
      confirmPassword: string
    }

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const skipVerification = process.env.SKIP_EMAIL_VERIFICATION === "true"

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: skipVerification ? new Date() : null,
      },
    })

    if (!skipVerification) {
      // Generate a verification token (expires in 24h)
      const token = crypto.randomUUID()
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

      await prisma.verificationToken.create({
        data: { identifier: email, token, expires },
      })

      await sendVerificationEmail(email, token)
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error("[register]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

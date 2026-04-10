import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, token, password } = (await request.json()) as {
      email: string
      token: string
      password: string
    }

    if (!email || !token || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const identifier = `reset:${email}`

    const record = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier, token } },
    })

    if (!record) {
      return NextResponse.json({ error: "invalid-token" }, { status: 400 })
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      })
      return NextResponse.json({ error: "expired-token" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    })

    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier, token } },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

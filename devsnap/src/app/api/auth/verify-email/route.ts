import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  if (!token || !email) {
    return NextResponse.redirect(new URL("/sign-in?error=invalid-link", request.nextUrl.origin))
  }

  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
  })

  if (!record) {
    return NextResponse.redirect(new URL("/sign-in?error=invalid-link", request.nextUrl.origin))
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    })
    return NextResponse.redirect(
      new URL(`/verify-email?error=expired&email=${encodeURIComponent(email)}`, request.nextUrl.origin)
    )
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  })

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token } },
  })

  return NextResponse.redirect(new URL("/sign-in?verified=1", request.nextUrl.origin))
}

import { NextResponse } from "next/server"
import authConfig from "./auth.config"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

export const proxy = auth(function proxy(req) {
  const isLoggedIn = !!req.auth
  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/profile") ||
    req.nextUrl.pathname.startsWith("/items")

  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin)
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/items/:path*"],
}

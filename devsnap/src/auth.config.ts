import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [
    GitHub,
    Credentials({
      // Placeholder — real authorize logic is in auth.ts (needs bcrypt, not edge-safe)
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig

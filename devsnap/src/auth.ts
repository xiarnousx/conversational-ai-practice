import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

class UnverifiedEmailError extends CredentialsSignin {
  code = "email-not-verified"
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id
      return token
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        const skipVerification = process.env.SKIP_EMAIL_VERIFICATION === "true"
        if (!skipVerification && !user.emailVerified) throw new UnverifiedEmailError()

        return { id: user.id, email: user.email, name: user.name, image: user.image }
      },
    }),
  ],
})

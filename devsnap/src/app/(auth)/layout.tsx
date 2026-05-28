import { auth } from "@/auth"
import MarketingNav from "@/components/marketing/MarketingNav"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <>
      <MarketingNav isSignedIn={!!session} />
      {children}
    </>
  )
}

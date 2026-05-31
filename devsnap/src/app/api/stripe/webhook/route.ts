import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

// App Router provides raw body natively; this export is documentation only
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") ?? ""

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (!userId) break
      await prisma.user.updateMany({
        where: { id: userId },
        data: {
          isPro: true,
          stripeSubscriptionId: (session.subscription as string | null) ?? null,
          stripeCustomerId: (session.customer as string | null) ?? null,
        },
      })
      break
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const isPro = sub.status === "active" || sub.status === "trialing"
      await prisma.user.updateMany({
        where: { stripeCustomerId: sub.customer as string },
        data: { isPro, stripeSubscriptionId: sub.id },
      })
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      await prisma.user.updateMany({
        where: { stripeCustomerId: sub.customer as string },
        data: { isPro: false, stripeSubscriptionId: null },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}

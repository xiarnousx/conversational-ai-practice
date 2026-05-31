# Stripe Subscription Integration Plan

DevStash Pro: $8/month · $72/year

---

## Current State

### Schema

The `User` model already has all Stripe fields:

```prisma
model User {
  isPro                Boolean   @default(false)
  stripeCustomerId     String?
  stripeSubscriptionId String?
  ...
}
```

No schema migration needed.

### Session

`src/auth.ts` — JWT callbacks only carry `user.id` today:

```ts
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
```

`isPro` is not in the session yet — needed for client-side gating.

### Feature Gating — Nothing enforced yet

- Free limits (50 items, 3 collections) are stated in the marketing copy only (`PricingSection.tsx`).
- No server-side checks exist in `src/actions/items.ts` or `src/actions/collections.ts`.
- Pro-only uploads: `src/app/api/upload/route.ts` accepts all authenticated users.

### Environment Variables in Use

```
DATABASE_URL · NEXTAUTH_URL · REDIS_URL · RESEND_API_KEY
S3_ACCESS_KEY_ID · S3_SECRET_ACCESS_KEY · S3_BUCKET_NAME · S3_REGION
SKIP_EMAIL_VERIFICATION · NODE_ENV
```

---

## Implementation Order

1. Stripe Dashboard setup (price IDs)
2. Install Stripe SDK + add env vars
3. Extend session with `isPro`
4. Create Checkout session API route
5. Create Billing Portal API route
6. Stripe webhook handler
7. Enforce free-tier limits in server actions
8. Enforce Pro-only upload in `/api/upload`
9. Billing section in `/settings`
10. Upgrade prompt in UI
11. Tests + smoke-test checklist

---

## 1. Stripe Dashboard Setup

Create two prices on a single **DevStash Pro** product:

| Price | Amount | Interval | Metadata key |
|-------|--------|----------|--------------|
| Monthly | $8.00 USD | monthly | — |
| Yearly | $72.00 USD | yearly | — |

Copy the two Price IDs (`price_xxx`) — you'll need them as env vars.

Enable **Customer Portal** in Stripe Dashboard → Billing → Customer Portal:
- Allow plan switching (monthly ↔ yearly)
- Allow cancellation
- Return URL: `https://your-domain.com/settings`

---

## 2. Install & Environment

```bash
npm install stripe @stripe/stripe-js
```

Add to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
```

---

## 3. Extend Session with `isPro`

### `src/types/next-auth.d.ts` — add `isPro`

```ts
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isPro: boolean
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isPro?: boolean
  }
}
```

### `src/auth.ts` — always sync `isPro` from DB

Replace the existing `callbacks` block:

```ts
callbacks: {
  async jwt({ token, user }) {
    if (user?.id) token.sub = user.id

    // Always sync isPro so webhook updates are reflected on next page load
    if (token.sub) {
      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { isPro: true },
      })
      token.isPro = dbUser?.isPro ?? false
    }

    return token
  },
  session({ session, token }) {
    if (token.sub) session.user.id = token.sub
    if (token.isPro !== undefined) session.user.isPro = token.isPro
    return session
  },
},
```

> This adds one small DB read per session validation but ensures `isPro` stays in sync after a webhook update — no client-side polling needed.

---

## 4. Stripe Client Singleton

**Create `src/lib/stripe.ts`:**

```ts
import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
})
```

---

## 5. Checkout Session API Route

**Create `src/app/api/stripe/checkout/route.ts`:**

```ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { plan } = (await req.json()) as { plan: "monthly" | "yearly" }
  const priceId =
    plan === "yearly"
      ? process.env.STRIPE_PRICE_YEARLY!
      : process.env.STRIPE_PRICE_MONTHLY!

  // Get or create Stripe customer
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { email: true, stripeCustomerId: true },
  })

  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email! })
    customerId = customer.id
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    })
  }

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL!

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/settings?upgraded=1`,
    cancel_url: `${origin}/settings`,
    metadata: { userId: session.user.id },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
```

---

## 6. Billing Portal API Route

**Create `src/app/api/stripe/portal/route.ts`:**

```ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  })

  if (!user.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription found" }, { status: 400 })
  }

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL!

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${origin}/settings`,
  })

  return NextResponse.json({ url: portalSession.url })
}
```

---

## 7. Stripe Webhook Handler

**Create `src/app/api/stripe/webhook/route.ts`:**

```ts
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode === "subscription" && session.metadata?.userId) {
        await prisma.user.update({
          where: { id: session.metadata.userId },
          data: {
            isPro: true,
            stripeSubscriptionId: session.subscription as string,
            stripeCustomerId: session.customer as string,
          },
        })
      }
      break
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      // Active or trialing = Pro; anything else = revoke
      const isActive = ["active", "trialing"].includes(sub.status)
      await prisma.user.updateMany({
        where: { stripeCustomerId: sub.customer as string },
        data: { isPro: isActive },
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

// Tell Next.js not to parse the body — Stripe needs the raw bytes to verify the signature
export const config = { api: { bodyParser: false } }
```

> **Note:** In Next.js App Router the raw body is available via `req.text()` — the `bodyParser: false` export is a no-op but kept for clarity.

---

## 8. Enforce Free-Tier Limits

### `src/lib/db/limits.ts` — new file

```ts
import { prisma } from "@/lib/prisma"

export const FREE_ITEM_LIMIT = 50
export const FREE_COLLECTION_LIMIT = 3

export async function getUserLimits(userId: string) {
  const [itemCount, collectionCount, user] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { isPro: true } }),
  ])
  return {
    isPro: user?.isPro ?? false,
    itemCount,
    collectionCount,
    atItemLimit: !user?.isPro && itemCount >= FREE_ITEM_LIMIT,
    atCollectionLimit: !user?.isPro && collectionCount >= FREE_COLLECTION_LIMIT,
  }
}
```

### `src/actions/items.ts` — add limit check in `createItem`

After the `parsed` check, before calling `createItemInDb`:

```ts
import { getUserLimits } from "@/lib/db/limits"

// inside createItem():
const limits = await getUserLimits(session.user.id)
if (limits.atItemLimit) {
  return { success: false, error: "Free plan limit reached (50 items). Upgrade to Pro for unlimited items." }
}
```

### `src/actions/collections.ts` — add limit check in `createCollection`

```ts
const limits = await getUserLimits(session.user.id)
if (limits.atCollectionLimit) {
  return { success: false, error: "Free plan limit reached (3 collections). Upgrade to Pro for unlimited collections." }
}
```

### `src/app/api/upload/route.ts` — restrict to Pro users

After the `session` auth check, add:

```ts
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { isPro: true },
})

// Images are allowed on free; only files require Pro
if (!isImage && !user?.isPro) {
  return NextResponse.json(
    { error: "File uploads require a Pro plan." },
    { status: 403 }
  )
}
```

> Per the spec: free users get image uploads but NOT file uploads.

---

## 9. Billing Section in `/settings`

### `src/components/settings/BillingSection.tsx` — new client component

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface BillingSectionProps {
  isPro: boolean
  hasSubscription: boolean
}

export default function BillingSection({ isPro, hasSubscription }: BillingSectionProps) {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade(plan: "monthly" | "yearly") {
    setLoading(true)
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(false)
  }

  async function handleManage() {
    setLoading(true)
    const res = await fetch("/api/stripe/portal", { method: "POST" })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(false)
  }

  if (isPro) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground font-medium">DevStash Pro</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-bold">ACTIVE</span>
        </div>
        {hasSubscription && (
          <Button variant="outline" size="sm" onClick={handleManage} disabled={loading}>
            Manage Subscription
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        You&apos;re on the free plan (50 items · 3 collections).
      </p>
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" onClick={() => handleUpgrade("monthly")} disabled={loading}>
          Upgrade Monthly — $8/mo
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleUpgrade("yearly")} disabled={loading}>
          Upgrade Yearly — $72/yr
        </Button>
      </div>
    </div>
  )
}
```

### `src/app/settings/page.tsx` — add Billing section

Add to the query:

```ts
const user = await prisma.user.findUniqueOrThrow({
  where: { id: session.user.id },
  select: {
    password: true,
    editorPreferences: true,
    isPro: true,                  // add
    stripeSubscriptionId: true,   // add
  },
})
```

Add the section below Editor preferences:

```tsx
import BillingSection from "@/components/settings/BillingSection"

// Inside the JSX:
<div className="rounded-lg border border-border bg-card p-6 space-y-4">
  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
    Plan & Billing
  </h2>
  <BillingSection
    isPro={user.isPro}
    hasSubscription={!!user.stripeSubscriptionId}
  />
</div>
```

---

## 10. Upgrade Prompt in UI

Show a subtle limit warning when users hit 80% of free limits, or display a Pro badge after upgrade:

- In `NewItemDialog` and `NewCollectionDialog`: if the server action returns a limit error, surface it as a toast with an "Upgrade to Pro" link pointing to `/settings`.
- In the sidebar `UserAvatar` area: show a subtle **Upgrade** link for free users (session `isPro === false`).

The session already flows through `AppLayoutClient` — pass `session.user.isPro` down to `TopBar` and `Sidebar` via existing prop patterns.

---

## 11. `success_url` Handling — Auto-refresh Session

When Stripe redirects to `/settings?upgraded=1`, the session will pick up the new `isPro` value on its own (because the JWT callback always reads from DB). No extra client-side code needed — just a page load.

Optionally show a success toast by checking `searchParams` in the settings page:

```ts
// settings/page.tsx (server component)
export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>
}) {
  const { upgraded } = await searchParams
  // pass `upgraded === "1"` to a client component that shows a toast
}
```

---

## Files Summary

### Create

| File | Purpose |
|------|---------|
| `src/lib/stripe.ts` | Stripe client singleton |
| `src/lib/db/limits.ts` | Free-tier limit helpers |
| `src/app/api/stripe/checkout/route.ts` | Create Checkout session |
| `src/app/api/stripe/portal/route.ts` | Open Billing Portal |
| `src/app/api/stripe/webhook/route.ts` | Handle subscription events |
| `src/components/settings/BillingSection.tsx` | Billing UI in settings |

### Modify

| File | Change |
|------|--------|
| `src/types/next-auth.d.ts` | Add `isPro: boolean` to Session and JWT |
| `src/auth.ts` | Sync `isPro` from DB in JWT callback |
| `src/actions/items.ts` | Enforce item limit in `createItem` |
| `src/actions/collections.ts` | Enforce collection limit in `createCollection` |
| `src/app/api/upload/route.ts` | Gate file uploads (not images) behind Pro |
| `src/app/settings/page.tsx` | Add Billing section |

---

## Stripe Dashboard Setup Steps

1. Create product **DevStash Pro**
2. Create monthly price: $8.00 USD / month
3. Create yearly price: $72.00 USD / year
4. Copy both Price IDs → `.env.local`
5. Enable Customer Portal → set return URL
6. Add webhook endpoint: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
7. Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET` in `.env.local`
8. For local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

---

## Testing Checklist

- [ ] Free user can create up to 50 items — 51st returns limit error toast
- [ ] Free user can create up to 3 collections — 4th returns limit error toast
- [ ] Free user can upload images — succeeds
- [ ] Free user cannot upload files — gets 403 error
- [ ] Checkout redirects to Stripe → succeeds → redirects to `/settings?upgraded=1`
- [ ] After checkout, page shows Pro status (session synced)
- [ ] Pro user has no item/collection limits
- [ ] Pro user can upload files
- [ ] Manage Subscription opens Billing Portal
- [ ] Cancel subscription → webhook fires → `isPro` set to `false` in DB → next page load reflects free status
- [ ] Webhook signature verification rejects tampered payloads (400)
- [ ] `stripe listen` local webhook forwarding works in dev

---

## Notes

- **No DB migration needed** — `isPro`, `stripeCustomerId`, `stripeSubscriptionId` are already in the schema.
- **Session sync** — `isPro` is always read from DB in the JWT callback (per the research note), so a simple page reload after checkout is sufficient.
- **Fail-safe on limits** — the `getUserLimits()` helper is a single batched Prisma query (`Promise.all`), not three sequential calls.
- **Webhook idempotency** — `updateMany` by `stripeCustomerId` is safe to retry; Stripe may deliver events more than once.
- **Image uploads on free** — free users keep image uploads per the spec; only file (PDF, Markdown, etc.) uploads are Pro-gated.

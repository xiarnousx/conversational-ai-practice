# Feature: Stripe Integration — Phase 2 (Webhooks, Gating & UI)

## Status

Not Started

## Prerequisites

Phase 1 must be complete:
- `src/lib/stripe.ts` exists
- `src/lib/db/limits.ts` exists
- Session carries `isPro`
- Checkout and portal API routes exist

## Goals

Wire up the Stripe webhook handler to keep `isPro` in sync, enforce free-tier limits in server actions and the upload route, add a Billing section to `/settings`, and surface upgrade prompts in the UI. Requires Stripe CLI for local webhook testing.

## Scope

### Files to Create

| File | Purpose |
|------|---------|
| `src/app/api/stripe/webhook/route.ts` | Handle `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` |
| `src/components/settings/BillingSection.tsx` | Client component — upgrade buttons or manage subscription |

### Files to Modify

| File | Change |
|------|--------|
| `src/actions/items.ts` | Enforce item limit in `createItem` |
| `src/actions/collections.ts` | Enforce collection limit in `createCollection` |
| `src/app/api/upload/route.ts` | Gate file uploads (not images) behind Pro |
| `src/app/settings/page.tsx` | Add Plan & Billing section |

## Implementation Steps

### 1. Webhook Handler — `src/app/api/stripe/webhook/route.ts`

Handle three events:

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Set `isPro = true`, save `stripeSubscriptionId` + `stripeCustomerId` (keyed by `metadata.userId`) |
| `customer.subscription.updated` | Set `isPro` based on status — `active` / `trialing` = true, anything else = false (keyed by `stripeCustomerId`) |
| `customer.subscription.deleted` | Set `isPro = false`, clear `stripeSubscriptionId` (keyed by `stripeCustomerId`) |

- Use `req.text()` for raw body; verify with `stripe.webhooks.constructEvent`
- Return 400 on signature mismatch
- Use `updateMany` by `stripeCustomerId` — safe for Stripe retries (idempotent)

### 2. Enforce Item Limit — `src/actions/items.ts`

In `createItem`, after input validation, before `createItemInDb`:
```ts
const limits = await getUserLimits(session.user.id)
if (limits.atItemLimit) {
  return { success: false, error: "Free plan limit reached (50 items). Upgrade to Pro for unlimited items." }
}
```

### 3. Enforce Collection Limit — `src/actions/collections.ts`

In `createCollection`, after input validation:
```ts
const limits = await getUserLimits(session.user.id)
if (limits.atCollectionLimit) {
  return { success: false, error: "Free plan limit reached (3 collections). Upgrade to Pro for unlimited collections." }
}
```

### 4. Gate File Uploads — `src/app/api/upload/route.ts`

After the existing auth check, before accepting the file:
```ts
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { isPro: true },
})
// Free users keep image uploads; only non-image files require Pro
if (!isImage && !user?.isPro) {
  return NextResponse.json({ error: "File uploads require a Pro plan." }, { status: 403 })
}
```

### 5. Billing Section — `src/components/settings/BillingSection.tsx`

Client component receiving `{ isPro: boolean, hasSubscription: boolean }`:

- **Free user**: shows "You're on the free plan (50 items · 3 collections)" + two buttons:
  - "Upgrade Monthly — $8/mo" → POST `/api/stripe/checkout` with `{ plan: "monthly" }`
  - "Upgrade Yearly — $72/yr" → POST `/api/stripe/checkout` with `{ plan: "yearly" }`
- **Pro user**: shows "DevStash Pro · ACTIVE" badge + "Manage Subscription" button → POST `/api/stripe/portal`
- Both redirect to the returned `url` on success
- `loading` state disables buttons while fetch is in flight

### 6. Settings Page — `src/app/settings/page.tsx`

- Add `isPro` and `stripeSubscriptionId` to the existing Prisma query
- Add a "Plan & Billing" card section below Editor Preferences
- Import and render `<BillingSection isPro={user.isPro} hasSubscription={!!user.stripeSubscriptionId} />`
- Check `searchParams.upgraded === "1"` and pass a flag to show a success toast on redirect back from Stripe

### 7. Upgrade Prompts

- In `NewItemDialog` and `NewCollectionDialog`: if the server action returns a limit error, show a toast with an "Upgrade to Pro" link pointing to `/settings`
- In the sidebar `UserAvatar` area: show a subtle **Upgrade** link for `session.user.isPro === false` — use existing session prop flow through `AppLayoutClient`

## Local Testing Setup (Stripe CLI)

```bash
# Install Stripe CLI, then:
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This prints a `whsec_...` secret — set it as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

Trigger test events manually:
```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

## Test Plan (Manual Checklist)

- [ ] Free user can create up to 50 items — 51st returns limit error toast with "Upgrade to Pro" link
- [ ] Free user can create up to 3 collections — 4th returns limit error toast
- [ ] Free user can upload images — succeeds
- [ ] Free user cannot upload non-image files — gets 403 with "File uploads require a Pro plan."
- [ ] Checkout redirects to Stripe hosted page → succeeds → redirects to `/settings?upgraded=1`
- [ ] `/settings` shows success toast on `?upgraded=1`
- [ ] After checkout, settings page shows Pro status (session synced via JWT callback DB read)
- [ ] Pro user has no item/collection limits
- [ ] Pro user can upload files
- [ ] "Manage Subscription" opens Stripe Billing Portal
- [ ] Cancel subscription via portal → `customer.subscription.deleted` webhook fires → `isPro = false` in DB → next page load shows free status
- [ ] `customer.subscription.updated` with `status: "past_due"` → `isPro = false`
- [ ] Webhook with tampered signature → 400 response
- [ ] `stripe listen` local forwarding works end-to-end

## Notes

- Webhook handler uses `req.text()` — App Router provides raw body natively; the `bodyParser: false` export is kept as documentation but has no effect
- `updateMany` by `stripeCustomerId` makes webhooks safely idempotent — Stripe may deliver the same event more than once
- Session `isPro` is always read from DB in the JWT callback (Phase 1), so a simple page reload after Stripe redirects back is sufficient — no polling needed
- Free users keep image uploads per the project spec; only file (PDF, Markdown, ZIP, etc.) uploads are Pro-gated
- See `docs/stripe-integration-plan.md` for full code snippets and Stripe Dashboard setup checklist

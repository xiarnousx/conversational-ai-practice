# Feature: Stripe Integration — Phase 1 (Core Infrastructure)

## Status

Not Started

## Goals

Install Stripe SDK, extend the session with `isPro`, create the Stripe client singleton, implement checkout and billing portal API routes, and write unit tests for the usage-limits module. No webhooks, no UI gating, no billing UI yet — just the wiring that Phase 2 depends on.

## Scope

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/stripe.ts` | Stripe client singleton |
| `src/lib/db/limits.ts` | Free-tier limit helpers (`getUserLimits`) |
| `src/app/api/stripe/checkout/route.ts` | POST — create Checkout session, return URL |
| `src/app/api/stripe/portal/route.ts` | POST — open Billing Portal, return URL |
| `src/lib/__tests__/limits.test.ts` | Unit tests for `getUserLimits` |

### Files to Modify

| File | Change |
|------|--------|
| `src/types/next-auth.d.ts` | Add `isPro: boolean` to `Session` and `JWT` |
| `src/auth.ts` | Sync `isPro` from DB on every JWT refresh |

### Out of Scope (Phase 2)

- Stripe webhook handler
- Feature gating in server actions and upload route
- Billing UI in `/settings`
- Upgrade prompts in the app

## Implementation Steps

1. **Install Stripe SDK**
   ```bash
   npm install stripe @stripe/stripe-js
   ```

2. **Add env vars to `.env.local`**
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_MONTHLY=price_...
   STRIPE_PRICE_YEARLY=price_...
   ```

3. **Extend session type** — `src/types/next-auth.d.ts`
   - Add `isPro: boolean` to `Session["user"]`
   - Add `isPro?: boolean` to `JWT`

4. **Sync `isPro` in JWT callback** — `src/auth.ts`
   - Replace existing `callbacks` block; DB read on every JWT refresh so the session reflects webhook updates immediately on next page load

5. **Create Stripe singleton** — `src/lib/stripe.ts`
   - `new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" })`

6. **Create limits helper** — `src/lib/db/limits.ts`
   - `FREE_ITEM_LIMIT = 50`, `FREE_COLLECTION_LIMIT = 3` constants
   - `getUserLimits(userId)` — single `Promise.all` Prisma query returning `{ isPro, itemCount, collectionCount, atItemLimit, atCollectionLimit }`

7. **Checkout route** — `src/app/api/stripe/checkout/route.ts`
   - Auth-guarded POST
   - Accepts `{ plan: "monthly" | "yearly" }`
   - Gets or creates Stripe customer, persists `stripeCustomerId`
   - Returns `{ url: checkoutSession.url }`

8. **Billing portal route** — `src/app/api/stripe/portal/route.ts`
   - Auth-guarded POST
   - Returns 400 if no `stripeCustomerId`
   - Returns `{ url: portalSession.url }`

9. **Unit tests** — `src/lib/__tests__/limits.test.ts`
   - Mock Prisma; test all return fields for free and Pro users
   - Verify `atItemLimit` / `atCollectionLimit` boundary conditions (49, 50, 51 items; 2, 3, 4 collections)
   - Verify Pro users never hit limits regardless of counts

## Test Plan

- `npm test` — all limits unit tests pass
- `npm run build` — no TypeScript errors
- Manual: hit `POST /api/stripe/checkout` with a valid session → returns a Stripe URL (requires real `STRIPE_SECRET_KEY`)
- Manual: hit `POST /api/stripe/portal` without `stripeCustomerId` → returns 400

## Notes

- No DB migration needed — `isPro`, `stripeCustomerId`, `stripeSubscriptionId` are already in the schema
- The JWT callback DB read is intentional: ensures `isPro` syncs after a webhook fires without any client-side polling
- `STRIPE_PUBLISHABLE_KEY` is added now for use in Phase 2 client components
- See `docs/stripe-integration-plan.md` for full reference and Stripe Dashboard setup instructions

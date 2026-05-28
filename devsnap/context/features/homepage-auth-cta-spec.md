# Homepage Auth-Aware CTA

## Overview

When a user is already signed in and visits the public homepage (`/`), replace the sign-up/sign-in CTAs with a **"View Dashboard"** link so they are never stuck staring at a marketing page with no clear path back to the app.

## Affected Surfaces

| Surface | Logged-out state (current) | Logged-in state (new) |
|---|---|---|
| `MarketingNav` — desktop | "Sign In" + "Get Started" buttons | "View Dashboard" button only |
| `MarketingNav` — mobile Sheet | "Sign In" + "Get Started" links | "View Dashboard" link only |
| `HeroSection` — primary CTA | "Start for Free" → `/register` | "Go to Dashboard" → `/dashboard` |
| `HeroSection` — secondary CTA | "See Features →" → `#features` | unchanged |
| `CTASection` | "Get Started for Free" → `/register` | "Go to Dashboard" → `/dashboard` |

## Implementation

### Session check

- `src/app/page.tsx` is a **Server Component** — call `auth()` from `src/auth.ts` to read the session server-side (no client round-trip needed).
- Pass a boolean prop `isSignedIn` down to `MarketingNav`, `HeroSection`, and `CTASection`.

### `MarketingNav`

- Accept `isSignedIn: boolean` prop.
- When `true`: render a single ShadCN `Button` variant `"default"` labelled **"View Dashboard"** linking to `/dashboard`; hide the "Sign In" and "Get Started" buttons entirely.
- When `false`: existing behaviour unchanged.
- Apply the same logic inside the mobile `Sheet` nav drawer.

### `HeroSection`

- Accept `isSignedIn: boolean` prop and pass it down to the CTA button group.
- When `true`: replace "Start for Free" with **"Go to Dashboard"** → `/dashboard`; keep "See Features →" as-is.
- When `false`: existing behaviour unchanged.

### `CTASection`

- Accept `isSignedIn: boolean` prop.
- When `true`: replace "Get Started for Free" with **"Go to Dashboard"** → `/dashboard`.
- When `false`: existing behaviour unchanged.

## Style

- **"View Dashboard"** in `MarketingNav`: use ShadCN `Button` variant `"default"` (indigo, same weight as existing "Get Started").
- **"Go to Dashboard"** in `HeroSection`: same styling as the existing "Start for Free" primary button — no visual difference, only label + href change.
- **"Go to Dashboard"** in `CTASection`: same styling as the existing "Get Started for Free" button.

## File Checklist

- `src/app/page.tsx` — call `auth()`; pass `isSignedIn` to `MarketingNav`, `HeroSection`, `CTASection`
- `src/components/marketing/MarketingNav.tsx` — accept + apply `isSignedIn` prop (desktop + mobile Sheet)
- `src/components/marketing/HeroSection.tsx` — accept + apply `isSignedIn` prop
- `src/components/marketing/CTASection.tsx` — accept + apply `isSignedIn` prop

## Out of Scope

- No redirect: do **not** auto-redirect signed-in users away from `/`; they may intentionally browse the marketing page.
- No change to the Pricing section — "Get Started Free" / "Start Pro Trial" links are generic and acceptable either way.
- No middleware changes.

## References

- `@src/app/page.tsx`
- `@src/auth.ts`
- `@src/components/marketing/MarketingNav.tsx`
- `@src/components/marketing/HeroSection.tsx`
- `@src/components/marketing/CTASection.tsx`
- `@context/features/homepage-spec.md`

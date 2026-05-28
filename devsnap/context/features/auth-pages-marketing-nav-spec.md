# Auth Pages — Marketing Nav

## Overview

Add the `MarketingNav` component to the Sign In (`/sign-in`) and Register (`/register`) pages so users navigating to these pages from the homepage retain consistent top-level navigation. The nav gives them a clear path back to the homepage, the features/pricing anchors, and (if already signed in) directly to the dashboard.

---

## Affected Pages

| Route | File |
|---|---|
| `/sign-in` | `src/app/(auth)/sign-in/page.tsx` |
| `/register` | `src/app/(auth)/register/page.tsx` |

---

## Approach

### Shared auth layout

Create `src/app/(auth)/layout.tsx` — a **server component** that:

1. Calls `auth()` from `src/auth.ts` to read the session server-side.
2. Renders `<MarketingNav isSignedIn={!!session} />` above `{children}`.
3. Wraps `{children}` in a full-height container so each auth page's centred-card layout is preserved.

Using a shared layout avoids duplicating the nav render in each page and keeps session-reading in one place.

### Page layout adjustment

Each auth page currently uses `min-h-screen flex items-center justify-center` as its root div. After the nav is added the card must be offset by the nav height (`pt-16`) so it is not hidden behind the fixed bar.

- Replace `min-h-screen` with `min-h-screen pt-16` on the root `<div>` in both `sign-in/page.tsx` and `register/page.tsx`.

### `isSignedIn` behaviour on auth pages

On `/sign-in` and `/register` the nav renders in its **logged-out state** for unauthenticated users (shows "Sign In" + "Get Started"). If a session exists (user navigated here directly while already signed in) the nav shows "View Dashboard" — identical to the homepage behaviour.

The nav links "Features" and "Pricing" use hash anchors (`#features`, `#pricing`). On auth pages these anchors do not exist, so they will simply be no-ops / scroll to the top. This is acceptable for the initial implementation and consistent with how anchor links behave across all pages.

---

## File Checklist

- `src/app/(auth)/layout.tsx` — **new file**; server component; calls `auth()`, renders `MarketingNav` + `{children}`
- `src/app/(auth)/sign-in/page.tsx` — add `pt-16` to root `<div>`
- `src/app/(auth)/register/page.tsx` — add `pt-16` to root `<div>`

No changes needed to `MarketingNav` itself — the component already accepts `isSignedIn` and handles both states.

---

## Out of Scope

- Forgot Password (`/forgot-password`), Reset Password (`/reset-password`), and Verify Email (`/verify-email`) pages — these are transactional flows reached via email links; adding the nav to them is not required.
- Redirecting already-signed-in users away from auth pages — not in scope, consistent with homepage policy.
- Changing nav anchor links to point to homepage sections — the nav anchors are intentionally shallow links; fixing them to include the origin path is a future polish item.

---

## References

- `src/components/marketing/MarketingNav.tsx`
- `src/app/(auth)/sign-in/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/auth.ts`
- `context/features/homepage-auth-cta-spec.md`

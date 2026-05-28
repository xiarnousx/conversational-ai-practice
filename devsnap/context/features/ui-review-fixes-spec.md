# UI Review Fixes

## Overview

Address the issues found in the post-launch UI review covering the homepage and dashboard. Fixes are grouped by priority: layout-breaking Tailwind class errors first, then accessibility gaps, then visual polish.

---

## Group 1 — Fix Immediately (Broken Layout / Lost Conversions)

### 1. Invalid Tailwind v4 classes in `MarketingNav`

**Files:** `src/components/marketing/MarketingNav.tsx`

- Replace `bg-linear-to-r` with `bg-gradient-to-r` on all CTA button variants (lines 45, 59, 84, 95). Without this the "Get Started" / "View Dashboard" buttons render with no background, showing white text on a transparent surface.
- Replace `py-2.25` with `py-2.5` on all button variants (lines 45, 53, 59). `2.25` is not a valid Tailwind spacing step; buttons currently have zero vertical padding.
- Replace `max-w-285` on the nav inner container (line 23) with `max-w-[1100px]` to match every other section's width constraint.

---

## Group 2 — Fix Before Launch (Accessibility & UX Gaps)

### 2. Missing `SheetTitle` on mobile nav and mobile sidebar

**Files:** `src/components/marketing/MarketingNav.tsx`, `src/components/dashboard/Sidebar.tsx`

- Add a `<SheetTitle className="sr-only">Navigation</SheetTitle>` inside the `SheetContent` in `MarketingNav` (mobile nav drawer).
- Add a `<SheetTitle className="sr-only">Sidebar</SheetTitle>` inside the `SheetContent` in `Sidebar.tsx` (mobile app drawer).

### 3. Item drawer and sidebar `SheetContent` missing accessible description

**File:** `src/components/item-drawer/index.tsx`

- Add `<SheetDescription className="sr-only">Item details and actions</SheetDescription>` below the existing `SheetTitle` in the item drawer.

### 4. Collection card 3-dots dropdown invisible to keyboard users

**File:** `src/components/collection-card/CollectionCard.tsx`

- The `DropdownMenuTrigger` uses `opacity-0 group-hover:opacity-100`. Add `focus-visible:opacity-100` so the button becomes visible when focused via keyboard.

### 5. Icon-only TopBar buttons missing `aria-label` on mobile

**Files:** `src/components/item-create/index.tsx`, `src/components/collection-create/index.tsx` (wherever the TopBar buttons are rendered)

- Add `aria-label="New item"` to the "New Item" button and `aria-label="New collection"` to the "New Collection" button. The visible text is hidden on mobile via `hidden md:inline` so an `aria-label` is required as the accessible name.

### 6. Sign-in and register forms missing `<label>` elements

**Files:** `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/register/page.tsx`

- Wrap each input in a `<label>` (or use `htmlFor` + `id` pairing). Placeholder-only inputs lose their label as soon as the user starts typing, which is both an accessibility violation and a usability issue.

### 7. Double `p-6` padding on inner app pages

**Files:** `src/app/(app)/items/[type]/page.tsx`, `src/app/(app)/favorites/page.tsx`, `src/app/(app)/collections/page.tsx`, `src/app/(app)/collections/[id]/page.tsx`

- The shared `<main>` in `AppLayoutClient` already applies `p-6`. Remove the redundant `p-6` wrapper from each of these page components so their margins match the dashboard page.

### 8. Footer text color fails WCAG AA contrast

**File:** `src/components/marketing/MarketingFooter.tsx`

- Replace `text-[#3d4460]` (tagline, copyright, column link colors) with a lighter value — `text-[#6b7280]` (gray-500, ~4.6:1 on `#0a0c14`) or `text-slate-400` — to meet the 4.5:1 minimum for normal text.

### 9. Pricing toggle button missing `focus-visible` ring

**File:** `src/components/marketing/PricingSection.tsx`

- The billing toggle button uses `outline-none` with no replacement. Add `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` to the toggle button.

### 10. `✦` decorative character not `aria-hidden`

**File:** `src/components/marketing/AISection.tsx`

- Add `aria-hidden="true"` to the `✦` character in the "Pro Feature" badge so screen readers skip it.

### 11. Sidebar active-route indicator missing

**File:** `src/components/dashboard/Sidebar.tsx`

- Use Next.js `usePathname()` to detect the active item-type link. Apply a visible active style (e.g., `bg-sidebar-accent text-sidebar-accent-foreground`) and `aria-current="page"` on the matching link.

### 12. Pin icon `aria-label` ignored (no `role`)

**File:** `src/components/dashboard/ItemRow.tsx`

- The `Pin` SVG has `aria-label="Pinned"` but no `role`. Add `role="img"` to the icon wrapper so the label is announced by screen readers.

### 13. Sidebar user avatar dropdown trigger missing `aria-label`

**File:** `src/components/dashboard/Sidebar.tsx`

- Add `aria-label="User menu"` to the `DropdownMenuTrigger` wrapping the user avatar at the bottom of the sidebar.

---

## Group 3 — Polish (Minor but Notable)

### 14. Hero visual panels can overflow at 375px viewport

**File:** `src/components/marketing/HeroSection.tsx`

- The two `flex-shrink-0` boxes are 320px wide. At 375px viewport with `px-7` (28px each side), usable width is 319px — 1px short. Change to `w-full max-w-[320px]` and remove `flex-shrink-0` so the boxes shrink gracefully at narrow widths.

### 15. Hero headline uses raw-pixel letter-spacing

**File:** `src/components/marketing/HeroSection.tsx`

- `tracking-[-2px]` does not scale with font size. Replace with `tracking-[-0.04em]` so letter-spacing stays proportional across the clamp range.

### 16. Stats cards jump from 2 to 4 columns on tablet

**File:** `src/components/dashboard/StatsCards.tsx`

- Add `sm:grid-cols-2 md:grid-cols-4` breakpoints or insert an intermediate `grid-cols-3` step at ~640px so the 4 cards don't become very narrow at mid-size tablets.

### 17. Dashboard `loading.tsx` skeleton missing loading announcement

**File:** `src/app/(app)/dashboard/loading.tsx`

- Add `role="status"` and `aria-label="Loading dashboard"` to the skeleton root element so screen readers announce the loading state.

### 18. `>>` arrow animation fallback on mobile

**File:** `src/components/marketing/HeroSection.tsx`

- On mobile the arrow uses Tailwind's generic `animate-pulse` which fades opacity rather than suggesting direction. Replace with the same `arrowPulse` keyframe used on desktop, or use a right-pointing translate animation that reinforces the visual metaphor.

---

## Notes

- Group 1 must be fixed first — the broken Tailwind classes cause visible rendering failures in the nav on every page.
- Groups 2 and 3 can be done in a single pass; none require schema or API changes.
- No new routes, DB queries, or server actions are needed for any of these fixes.
- After fixes, run `npm run build` and verify in browser at 390px, 768px, and 1280px viewports.

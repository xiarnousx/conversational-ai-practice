# TopBar Responsive & Logo Spec

## Overview

Declutter the dashboard top bar on small screens, bring the logo in line with the homepage, and add a matching favicon.

## Current Problems (from Playwright audit)

### Mobile (390px)

- **Logo absent** — the sidebar is hidden on mobile, so the `⚡ DevSnap` branding disappears entirely from the top bar.
- **Buttons too wide** — "New Collection" (~110 px) and "+ New Item" (~90 px) together consume more than half the 390 px bar, leaving only ~80 px for search.
- **Search is unusable** — the centered absolute-positioned `<Input>` is squeezed to ~80 px and barely shows the placeholder.
- **Hamburger visually buried** — the absolute search overlay renders on top of the left-aligned hamburger icon.
- **No app identity on mobile** — a first-time visitor on a phone sees an unbranded toolbar.

### Tablet (768px)

- Layout is acceptable because the sidebar is visible (Tailwind `md` = 768 px), but full-text buttons still take significant space leaving the search narrower than ideal.

### Desktop (1440px)

- Layout is clean; no changes needed beyond logo alignment.

## Logo Alignment

The homepage `MarketingNav` uses `⚡ DevStash` (emoji + bold text). The sidebar currently uses plain text `DevSnap` with no emoji. Both should use the same style:

```
⚡  DevSnap   ← emoji + bold tracking-tight, matching homepage size/weight
```

> **Note on naming:** The sidebar says "DevSnap" while the homepage says "DevStash". Align to one name across both surfaces before implementing this spec. The folder name and `CLAUDE.md` use "DevSnap" — treat that as canonical unless instructed otherwise.

## Requirements

### 1. Logo in TopBar (mobile-only)

- Show `⚡ DevSnap` logo in the top bar **only on mobile** (`md:hidden`), placed between the hamburger and the search area.
- Same visual style as the homepage logo: `text-lg` emoji + `font-bold text-[17px] tracking-tight` text.
- Hide on `md+` where the sidebar already displays the logo.
- Wrap in a `NextLink` pointing to `/dashboard`.

### 2. Sidebar logo — emoji added

- Update `SidebarContent` header to render `⚡ DevSnap` (emoji + text) matching the homepage, instead of plain text.
- Collapsed state: show only the `⚡` emoji centered.

### 3. Icon-only action buttons on mobile

On screens `< md`, collapse labeled buttons to icon-only 32×32 icon buttons:

| Button | Desktop label | Mobile icon |
|---|---|---|
| New Collection | "New Collection" | `FolderPlus` (lucide) |
| New Item | "+ New Item" | `Plus` (lucide) |

- Add `title` attribute to each icon button for accessibility / hover tooltip.
- Keep full labels visible on `md+` as-is.

### 4. Search — icon trigger on mobile

On screens `< md`, replace the full-width absolute-positioned `<Input>` with a **search icon button** (32×32, same style as the hamburger) that calls `onSearchClick` to open the command palette.

On `md+`, keep the current centred `<Input>` with max-w-sm.

> The command palette already handles search, so an icon trigger is sufficient on mobile.

### 5. Favicon

Add a custom favicon using Next.js App Router conventions:

- Create `src/app/icon.tsx` — returns an SVG with a `⚡` character on a dark background using `ImageResponse`.
- Size: 32×32 for `icon`, 180×180 for `apple-icon`.
- Colors: dark background `#0a0c14`, lightning bolt `#6366f1` (indigo, matching the homepage CTA gradient).
- Remove any existing default Next.js favicon files if present.

## File Checklist

- `src/components/dashboard/TopBar.tsx` — mobile logo, icon-only buttons, search icon swap
- `src/components/dashboard/Sidebar.tsx` — emoji added to logo; collapsed state shows emoji only
- `src/app/icon.tsx` — new file, custom favicon via `ImageResponse`
- `src/app/apple-icon.tsx` — new file, 180×180 apple touch icon

## References

- `@context/features/dashboard-phase-2-spec.md`
- `@src/components/marketing/MarketingNav.tsx` — homepage logo style
- `@src/components/dashboard/TopBar.tsx`
- `@src/components/dashboard/Sidebar.tsx`

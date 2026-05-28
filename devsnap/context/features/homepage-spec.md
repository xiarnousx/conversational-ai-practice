# Homepage

## Overview

Build the public marketing homepage at `/` using the mockup at `prototypes/homepage/` as the visual reference. Replace any existing redirect at `src/app/page.tsx` with the real page.

## Route & Files

- **Page:** `src/app/page.tsx` (public, no auth required — remove any redirect)
- **Components:** `src/components/marketing/`

## Components

| Component | Type | Responsibility |
|---|---|---|
| `MarketingNav` | Client | Fixed navbar; scroll-opacity effect; mobile Sheet drawer |
| `HeroSection` | Server | Headline, CTA buttons, visual container wrapper |
| `HeroChaosCanvas` | Client | `requestAnimationFrame` floating-icon animation (chaos side) |
| `FeaturesSection` | Server | 6 feature cards grid |
| `AISection` | Server | Pro badge, checklist, code editor mockup |
| `PricingSection` | Server | Card layout wrapper |
| `PricingToggle` | Client | Monthly/yearly switch with `useState`; swaps price + description text |
| `CTASection` | Server | Gradient border box |
| `MarketingFooter` | Server | Logo + 3 link columns + copyright year |

## Sections

### Navbar
- Logo (⚡ DevStash), Features / Pricing anchor links, Sign In → `/sign-in`, Get Started → `/register`
- Background starts transparent, transitions to `bg-background/90 backdrop-blur` on scroll
- Mobile: ShadCN `Sheet` with the same links

### Hero
- Headline: "Stop Losing Your **Developer Knowledge**" — gradient text matches Tailwind `from-blue-500 via-indigo-400 to-pink-500`
- Buttons: "Start for Free" → `/register`, "See Features →" → `#features`
- Visual container: dark background (`bg-[#070912]`), 4 radial colour glows via inline style or `[background:...]` arbitrary value, dot-grid overlay with `bg-[radial-gradient(...)] bg-[length:22px_22px]`
- Left box: chaos container with `HeroChaosCanvas` — 8 floating icons (Notion, GitHub, Slack, VS Code, Globe, Terminal, File, Bookmark) that bounce and repel from mouse cursor using `requestAnimationFrame`
- Center: `>>` in monospace bold with the same gradient as the headline, CSS pulse animation
- Right box: static dashboard preview mockup — sidebar with 7 type labels (Snippet/Prompt/Command/Note/File/Image/URL) each in their accent colour, main content split into Pinned (2 cards) and Recent Items (5 rows) with pulsing skeleton placeholders

### Features
- 6 cards in a `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` grid
- Cards: Code Snippets (#3b82f6), AI Prompts (#f59e0b), Instant Search (#6366f1), Commands (#06b6d4), Files & Docs (#64748b), Collections (#22c55e)
- Each card: icon with tinted background, title, short description
- Hover: border shifts to accent colour, slight `translateY(-2px)`

### AI Section
- Left: "✦ Pro Feature" amber badge, heading, description, green-checkmark list (auto-tagging, summaries, explain code, prompt optimisation, semantic search)
- Right: static code editor mockup component — traffic-light dots, `useDebounce.ts` filename, syntax-highlighted code block (spans with colour classes), AI-generated tags strip at the bottom

### Pricing
- `PricingToggle` at top — monthly ($8/mo) / yearly ($72/yr, "Save 25%" badge)
- Free card: $0, feature list, "Get Started Free" → `/register`
- Pro card: highlighted border, "Most Popular" badge, price driven by toggle state, "Start Pro Trial" → `/register?plan=pro`

### CTA
- Gradient-bordered box, "Get Started for Free" → `/register`

### Footer
- Logo + tagline, columns: Product (Features, Pricing, Changelog), Resources (Docs, API, Blog), Company (About, Privacy, Terms)
- Copyright year via `new Date().getFullYear()` in a Client Component or as a static string
- All unbuilt links use `href="#"`

## Technical Notes

- All Tailwind — no custom CSS files; use `[background:...]` arbitrary values for the multi-gradient glow container
- Use ShadCN `Button` for CTAs, ShadCN `Sheet` for mobile nav
- `HeroChaosCanvas` must be `'use client'`; wrap the `requestAnimationFrame` loop in `useEffect` with cleanup
- Scroll listener in `MarketingNav` must be `'use client'`; add `{ passive: true }` and clean up on unmount
- Pulsing skeleton placeholders: Tailwind `animate-pulse` on the placeholder divs
- Pricing toggle: lift price state into `PricingSection` as a client component boundary, keep the card markup as JSX within the same file
- `src/middleware.ts` already protects `/dashboard/*`, `/items/*`, etc. — `/` requires no changes

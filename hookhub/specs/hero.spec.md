# Hero Component Spec

Source reviewed: `src/components/heros/Hero.tsx`

## Purpose

The Hero is the first thing a visitor sees on the hookhub landing page (`src/app/page.tsx`). Its
job is to communicate, in under a second, what hookhub is and give the visitor exactly one clear
next action. It sits directly below the site header and above the category-stats grid.

## Goals

1. **Explain the product immediately.** A visitor with zero context should understand "this is a
   directory of Claude Code hooks" from the headline alone.
2. **Establish trust/scale.** The supporting copy states the size of the catalog (hook count) and
   the breadth of categories it covers, signaling this is a real, populated directory — not an
   empty shell.
3. **Drive one primary action.** "Browse hooks" is the primary conversion goal of the entire page;
   the hero's CTA should always point there.
4. **Offer one secondary, lower-commitment action.** A link out to the reference GitHub examples
   repo, for visitors who want to see raw source before committing to browsing the catalog.
5. **Stay lightweight.** No client-side state, no animation libraries, no data fetching — this is
   a static, server-rendered section fed by props from the parent page.

## Current implementation contract

- **Component type:** Server component (no `"use client"`), default export, function declaration.
- **Props:** `{ hookCount: number }` — the only dynamic value. Everything else is static copy.
  - `hookCount` is interpolated into the supporting paragraph ("A curated directory of {hookCount}
    hooks…"). It must always reflect the live count from `src/data/hooks.ts` (currently passed as
    `hooks.length` from `page.tsx`) — never hardcode this number.
- **Structure (top to bottom):**
  1. `<section>` wrapper — centers and constrains content width, provides vertical rhythm.
  2. `<h1>` — the single page-level heading. There must be exactly one `<h1>` on the page, and this
     is it. Do not duplicate an `<h1>` elsewhere (e.g. in the header) while this component is in
     use for the homepage.
  3. `<p>` — one supporting sentence: catalog size + category breadth + value prop ("ready to drop
     into your project").
  4. CTA row — exactly two actions:
     - Primary: internal `Link` to `/browse`, filled/dark style.
     - Secondary: external `<a>` to the GitHub examples repo, outlined/light style, opens in a new
       tab with `target="_blank" rel="noopener noreferrer"`.

## Content guidelines

- **Headline:** States what the product *is* (a directory of hooks for Claude Code), not a vague
  tagline. Keep it to one line at desktop widths.
- **Subheading:** One sentence. Leads with a concrete number (catalog size) — numbers build
  credibility faster than adjectives. Ends by stating the value prop in plain terms ("ready to
  drop into your project").
- **CTA labels:** Verb-first, unambiguous ("Browse hooks", "View examples on GitHub"). Avoid vague
  labels like "Learn more" or "Get started".
- **Tone:** Direct, technical, no marketing fluff — this is a developer tool aimed at other
  developers.

## Visual / interaction guidelines

- **Hierarchy:** Headline > subheading > CTAs, both in font size and in visual weight. The primary
  CTA must be visually heavier (filled) than the secondary CTA (outlined) — never give both equal
  visual weight.
- **Alignment:** Centered content, constrained to a readable max width (subheading narrower than
  headline) so line lengths stay comfortable at large viewports.
- **Responsiveness:** Headline scales up at larger breakpoints; CTA row wraps rather than overflows
  on narrow viewports.
- **Color:** Uses the existing zinc neutral palette already established by `Header`/`Footer`/
  `HookCard` — a new hero variant should stay within that palette (or deliberately introduce a new
  accent, but not silently drift from it).
- **No layout shift:** Since `hookCount` is passed in as a prop from server-rendered data, the
  number must never flash/update client-side after initial paint.

## Accessibility requirements

- Exactly one `<h1>` per page; this component owns it on the homepage.
- Primary and secondary actions must be real interactive elements (`Link`/`<a>`), not `<div>` with
  click handlers.
- External link (GitHub) must carry `rel="noopener noreferrer"` whenever `target="_blank"` is used.
- Text contrast must meet WCAG AA against the section background in both CTA styles.

## Out of scope / non-goals

- No client interactivity (no carousels, animated counters, video backgrounds, etc.) unless a
  variation is explicitly designed to test that as a hypothesis.
- No data fetching inside the component — `hookCount` (and any future dynamic values) must be
  computed by the parent page/server and passed in as props.
- No third-party UI/animation dependencies without an explicit decision to add one.

## Guidance for building variations

When implementing an alternative Hero:

1. Keep the same prop contract (`hookCount: number`, plus any new props added deliberately and
   documented here) so `page.tsx` doesn't need conditional logic beyond swapping the import.
2. Preserve the two-CTA structure and the "browse hooks" primary action — the destination and
   priority of the primary CTA is the one thing that should not change between variations.
3. It's fine to vary: layout (centered vs. split/asymmetric), imagery/illustration, background
   treatment, copy, animation, additional secondary content (e.g. a code snippet preview, logos,
   category chips). It's not fine to vary: accessibility guarantees, the single-`<h1>` rule, or
   introducing client-side data fetching for content that's already available server-side.
4. Name variation files descriptively and keep them under `src/components/heros/` (e.g.
   `HeroSplit.tsx`, `HeroWithPreview.tsx`) so they stay easy to compare and swap in `page.tsx`.
5. Update this spec if a variation intentionally changes one of the "current implementation
   contract" rules above — the spec should stay the source of truth for what's required vs. what's
   free to vary.

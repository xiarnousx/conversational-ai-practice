# Current Feature: Email Verification on Register

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

- After registration, send a verification email with a unique token link via Resend
- New accounts are marked as unverified until the link is clicked
- Clicking the link marks the account as verified and redirects to the dashboard
- Unverified users are blocked from accessing protected routes (or shown a warning)
- Resend verification email option available (e.g., on sign-in or a dedicated page)

## Notes

- Use the `emailVerified` field on the `User` model (already part of NextAuth v5 schema)
- Generate a secure token (e.g., `crypto.randomUUID()`) stored in the `VerificationToken` table (also already in schema)
- Send email via the `resend` npm package using `RESEND_API_KEY` from `.env`
- Token should expire (e.g., 24 hours)
- The verification link should be something like `/api/auth/verify-email?token=xxx`
- On successful verification, sign the user in or redirect to sign-in
- Guard unverified users in middleware or server components

## History

- 2026-03-19: Initial Next.js project setup and boilerplate cleanup
- 2026-03-21: Dashboard UI Phase 1 completed — ShadCN init, dark mode, /dashboard route with topbar, sidebar and main placeholders
- 2026-03-21: Dashboard UI Phase 2 completed — collapsible sidebar, item types with links, favorite/recent collections, user avatar area, mobile drawer
- 2026-03-21: Dashboard UI Phase 3 completed — stats cards, collections grid, pinned items, and recent items sections using mock data
- 2026-03-21: Prisma + Docker PostgreSQL setup completed — Prisma 7.5.0 with driver adapter, full schema (all app models + NextAuth v5 models), initial migration applied, db scripts added to package.json
- 2026-03-21: Seed data script completed — prisma/seed.ts with demo user, 7 system item types, 5 collections and 15 items; dashboard updated to use Prisma instead of mock data
- 2026-03-21: Dashboard Collections real data — created src/lib/db/collections.ts, collection cards now use real DB data with border color derived from most-used item type per collection
- 2026-03-21: Dashboard Items real data — created src/lib/db/items.ts, item cards now use real DB data with type-colored left border, type badge, and fixed icon lookup case sensitivity
- 2026-03-21: Stats & Sidebar real data — sidebar item types and collections now use DB data; colored circle for recent collections based on dominant item type; "View all collections" link added; mock-data.ts deleted; layout refactored to server component
- 2026-03-23: Pro badge in sidebar — added ShadCN Badge component; subtle uppercase PRO badge rendered next to File and Image item types in sidebar navigation
- 2026-03-24: Codebase quick wins — getDemoUser() with React cache() in src/lib/db/user.ts; DEMO_USER_EMAIL constant extracted to src/lib/constants.ts; take: 50 cap on nested items in collections queries; empty-state guard in RecentItems; PRO_TYPES lowercase normalization in Sidebar; CollectionsGrid uses imported CollectionCardData type; dashboard loading.tsx skeleton added; bcryptjs moved to dependencies
- 2026-03-28: Auth Setup — NextAuth v5 (beta) + GitHub OAuth; split auth config for edge compatibility; Prisma adapter with JWT strategy; /dashboard/* protected via src/proxy.ts middleware; session type extended with user.id
- 2026-03-28: Auth Credentials — Credentials provider added with bcrypt validation; POST /api/auth/register route with password hashing, duplicate check, and input validation; password field was already in User model
- 2026-03-28: Auth UI — Custom /sign-in and /register pages; UserAvatar component (GitHub image or initials); sidebar bottom updated with real user, sign-out dropdown, profile link; JWT/session callbacks for user.id; success toast + auto sign-in on register

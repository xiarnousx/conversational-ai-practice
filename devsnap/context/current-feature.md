# Current Feature: Skip Email Verification in Development

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

- Add a `SKIP_EMAIL_VERIFICATION` environment variable that bypasses email verification in development
- When the flag is enabled, credentials sign-in should succeed even if `emailVerified` is null
- When the flag is enabled, the register flow should not send a verification email and should auto-verify the user
- Production behavior (verification required) must remain unchanged when the flag is off

## Notes

- The Resend service currently has no domain configured, making email delivery impossible in development
- The toggle should be an env var (e.g. `SKIP_EMAIL_VERIFICATION=true`) checked server-side only
- Add the variable to `.env.local` (or `.env`) with a comment explaining it is dev-only
- Add to `.env.example` (if it exists) as `SKIP_EMAIL_VERIFICATION=false` with a comment
- Relevant files to change:
  - `src/app/api/auth/[...nextauth]/route.ts` or auth config — sign-in blocked for unverified users
  - `src/app/api/auth/register/route.ts` — sends verification email on register
  - Possibly `src/lib/auth.ts` or wherever credentials sign-in validation lives

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
- 2026-04-03: Email Verification — Resend integration; verification token stored in VerificationToken table (24h expiry); /api/auth/verify-email verifies and sets emailVerified; /verify-email page with resend option; credentials sign-in blocked for unverified users; dashboard page migrated from demo user to real session user

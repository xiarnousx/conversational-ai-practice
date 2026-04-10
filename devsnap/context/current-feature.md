# Current Feature: Forgot Password

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

- "Forgot password?" link on the sign-in page opens a request form
- User submits their email; a reset email is sent via Resend with a time-limited token link (1h expiry)
- Clicking the link opens a reset-password page where the user sets a new password
- Token is validated server-side (exists, not expired, not already used)
- On success, password is updated and token is invalidated; user is redirected to sign-in
- Credentials-only flow — GitHub OAuth users without a password are shown a helpful message
- Error states handled: unknown email (silent/generic), expired token, invalid token

## Notes

- Reuse the existing `VerificationToken` table (nextauth model) for storing reset tokens — same `identifier` + `token` + `expires` structure; prefix identifier with `reset:` to distinguish from email-verification tokens
- Send emails via the existing Resend setup (`src/lib/resend.ts` or equivalent)
- Follow the existing auth page style (`/sign-in`, `/register`, `/verify-email`)
- No new DB migration needed if reusing `VerificationToken`

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
- 2026-04-03: Skip Email Verification dev flag — SKIP_EMAIL_VERIFICATION=true in .env bypasses email check on sign-in and auto-verifies on register; production flow unchanged when flag is off

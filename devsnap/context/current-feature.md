# Current Feature

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

## Notes

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
- 2026-04-10: Forgot Password — /forgot-password request form and /reset-password page; POST /api/auth/forgot-password creates 1h token in VerificationToken (reset: prefix) and sends email via Resend; POST /api/auth/reset-password validates token, hashes new password, invalidates token; "Forgot password?" link on sign-in; GitHub OAuth-only accounts shown helpful message; unknown emails handled silently; reset URL logged to console in development (Resend skipped)
- 2026-04-10: Profile Page — /profile route (protected); user info card with avatar, name, email, member since date; usage stats (total items, collections, breakdown by item type); change password form (email users only, hidden for OAuth); delete account with shadcn Dialog confirmation; POST /api/auth/change-password and DELETE /api/auth/delete-account API routes
- 2026-04-10: Seed mark@gmail.com — seeded 7 system item types, 5 collections (React Patterns, Python Scripts, AI Prompts, DevOps Commands, Useful Links), 29 items across all 7 type categories, 9 tags, 21 tag associations via PostgreSQL MCP; query log saved to summaries/2026-04-10.mark-data.md
- 2026-04-10: Rate Limiting for Auth — sliding window Redis rate limiting on all auth endpoints (login 5/15min IP+email, register/forgot-password 3/1hr IP, reset-password 5/15min IP, resend-verification 3/15min IP+email); src/lib/rate-limit.ts utility with ioredis; 429 + Retry-After header; fail-open when Redis unavailable; sign-in page handles rate-limited error code
- 2026-05-02: Items List View — dynamic /items/[type] route with type-filtered items grid (2-col on md+); getItemsByType() added to src/lib/db/items.ts; dashboard layout refactored into shared (app) route group; DashboardLayoutClient renamed to AppLayoutClient; /items/* added to middleware protection

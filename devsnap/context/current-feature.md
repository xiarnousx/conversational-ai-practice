# Current Feature: Auth UI — Sign In, Register & Sign Out

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

- Create custom `/sign-in` page (email/password fields, GitHub button, link to register)
- Create custom `/register` page (name, email, password, confirmPassword, submit to `/api/auth/register`, redirect to sign-in)
- Update sidebar bottom: user avatar (GitHub image or initials fallback), user name, dropdown with Sign Out, clicking avatar goes to `/profile`
- Form validation and error display on both pages
- Reusable avatar component handling both image and initials cases

## Notes

- Replace NextAuth default pages with custom UI
- Avatar logic: use `image` from session if available (GitHub), otherwise generate initials from name (e.g. "Brad Traversy" → "BT")
- Initials avatar component should be reusable
- Middleware must allow `/sign-in` and `/register` without auth

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

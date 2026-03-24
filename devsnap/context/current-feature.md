# Current Feature: Codebase Quick Wins

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

- Extract `getDemoUser()` with React `cache()` into `src/lib/db/user.ts` to eliminate duplicate DB round-trip shared by `layout.tsx` and `page.tsx`
- Add `take: 50` cap to nested `items` include in `getCollectionsForUser` and `getSidebarCollections` in `src/lib/db/collections.ts` to prevent unbounded memory use
- Add empty-state guard `if (items.length === 0) return null` in `RecentItems` to match the existing `PinnedItems` pattern
- Normalize `PRO_TYPES.has(type.name)` to `PRO_TYPES.has(type.name.toLowerCase())` in `Sidebar.tsx` to match the defensive casing pattern used elsewhere
- Extract `DEMO_USER_EMAIL = "demo@devstash.io"` constant to `src/lib/constants.ts` and replace the three hardcoded occurrences in `layout.tsx`, `page.tsx`, and `Sidebar.tsx`
- Replace the locally-redeclared `Collection` interface in `CollectionsGrid.tsx` with `import type { CollectionCardData }` from `src/lib/db/collections.ts`
- Add `src/app/dashboard/loading.tsx` with a skeleton UI to enable Suspense streaming for the dashboard route
- Move `bcryptjs` from `devDependencies` to `dependencies` in `package.json`

## Notes

- Highest-value fixes: `getDemoUser()` with `cache()` and the collections over-fetching cap
- The `take: 50` on collections is an immediate safety cap; a proper `groupBy` aggregate query is the full long-term fix
- Collection cards and item rows have click affordances but no navigation — address when detail pages are built
- `typeIconMap` is duplicated across 3 files (`CollectionsGrid`, `ItemRow`, `Sidebar`) — extract to `src/lib/item-type-map.ts` when adding new item types (out of scope for this feature)

## History

<!-- Keep this updated. Earliest to latest -->

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

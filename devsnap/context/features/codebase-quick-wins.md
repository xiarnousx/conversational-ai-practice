# Codebase Quick Wins (Post-Audit)

## Overview

Address the issues identified in the automated code audit. No critical security issues were found. These are performance, consistency, and code-quality improvements.

## Requirements

- Extract `getDemoUser()` with React `cache()` into `src/lib/db/user.ts` to eliminate the duplicate DB round-trip shared by `layout.tsx` and `page.tsx`
- Add `take: 50` cap to the nested `items` include in `getCollectionsForUser` and `getSidebarCollections` in `src/lib/db/collections.ts` to prevent unbounded memory use
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
- `typeIconMap` is duplicated across 3 files (`CollectionsGrid`, `ItemRow`, `Sidebar`) — extract to `src/lib/item-type-map.ts` when adding new item types

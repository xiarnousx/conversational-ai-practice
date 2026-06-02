# Refactor Plan — `src/actions/` (2026-06-02)

Scanned files: `items.ts`, `collections.ts`, `editor-preferences.ts`

---

## HIGH — Extract shared auth guard

**Problem:** Every server action (8 total) opens with the same 3-line block:

```ts
const session = await auth();
if (!session?.user?.id) {
  return { success: false, error: "Unauthorized" };
}
```

Two minor formatting variants exist (multi-line vs single-line) but the logic is identical.

**Fix:** Create `src/lib/auth-guard.ts`:

```ts
import { auth } from "@/auth";

type AuthGuard =
  | { ok: true; userId: string }
  | { ok: false; error: "Unauthorized" };

export async function requireUserId(): Promise<AuthGuard> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  return { ok: true, userId: session.user.id };
}
```

Usage in each action:

```ts
const guard = await requireUserId();
if (!guard.ok) return { success: false, error: guard.error };
// use guard.userId
```

**Affected locations:**
- `src/actions/items.ts:19-22`, `:48-51`, `:89-90`, `:103-104`, `:117-120`
- `src/actions/collections.ts:32-33`, `:44-45`, `:69-70`, `:85-86`
- `src/actions/editor-preferences.ts:11-12`

**Effort:** Low (< 30 min, mechanical replacement)

---

## MEDIUM — Shared `ActionResult<T>` type

**Problem:** `items.ts` defines 5 bespoke result types inline. `collections.ts` already has a local `ActionResult<T>` but doesn't export it.

**Fix:** Create `src/types/action-result.ts`:

```ts
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export const fail = (error: string): ActionResult<never> =>
  ({ success: false, error });
```

- Move the existing `ActionResult<T>` from `collections.ts` here and export it.
- Replace `UpdateItemResult`, `CreateItemResult`, `DeleteItemResult` in `items.ts` with `ActionResult<ItemDetail>` / `ActionResult`.
- Keep the toggle shapes (`{ success: true; isFavorite: boolean }`) as-is — they genuinely differ and forcing them into the generic adds noise.
- Optionally replace literal `{ success: false, error: "..." }` returns with `fail("...")`.

**Effort:** Low–medium

---

## MEDIUM — Deduplicate Zod schemas (cross-folder: `src/lib/validations/`)

**Problem:** `createItemSchema` and `updateItemSchema` redefine identical field shapes verbatim. `createCollectionSchema` and `updateCollectionSchema` are byte-for-byte identical bodies.

**Fix:** Create `src/lib/validations/shared.ts` with reusable field constants:

```ts
export const titleField = z.string().trim().min(1, "Title is required");
export const descriptionField = z.string().trim().nullable().optional();
export const tagsField = z.array(z.string().trim().min(1)).default([]);
export const collectionIdsField = z.array(z.string()).default([]);

export const collectionBaseFields = {
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().trim().max(500, "Description is too long").nullable().optional(),
};
```

Then compose:

```ts
// collections.ts
export const createCollectionSchema = z.object(collectionBaseFields);
export const updateCollectionSchema = z.object(collectionBaseFields);
```

**Affected locations:**
- `src/lib/validations/items.ts:4-10` (duplicated at `:19-34`)
- `src/lib/validations/collections.ts:4-5` (duplicated at `:11-12`)

**Effort:** Low

---

## LOW — `fail()` helper for repeated error literals

**Problem:** Identical `{ success: false, error: "..." }` literals returned in multiple catch blocks and ownership checks:

- `"Item not found"` — 4 occurrences in `items.ts`
- `"Collection not found"` — 2 occurrences in `collections.ts`
- Generic catch messages repeated across both files

**Fix:** If adopting the shared `ActionResult` type (MEDIUM above), add the `fail()` helper there and use it in place of inline object literals. Otherwise leave as-is — the benefit alone is marginal.

**Effort:** Trivial (included in MEDIUM task above)

---

## Already Clean — No Action Needed

- `editor-preferences.ts` — single small action, no duplication beyond the auth guard
- Ownership checks — correctly delegated to the DB layer; no `assertOwnership` helper needed here
- `revalidatePath` / `router.refresh()` — revalidation handled client-side; nothing to extract at the action layer
- Tag connect-or-create blocks — live in `src/lib/db/`, not in actions

---

## Recommended Execution Order

1. Create `src/types/action-result.ts` — shared type + `fail()` helper
2. Create `src/lib/auth-guard.ts` — `requireUserId()`
3. Update all 8 action functions to use `requireUserId()` and `ActionResult<T>`
4. Create `src/lib/validations/shared.ts` and update both validation files
5. Run `npm run build` and `npm test` to verify no regressions

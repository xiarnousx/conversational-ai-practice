# Feature: AI Integration — Phase 2 (Prompt Optimization)

## Status

Not Started

## Prerequisites

Phase 1 must be complete:
- `src/lib/openai.ts` exists
- `src/actions/ai.ts` exists with shared auth/Pro/rate-limit guard pattern
- `src/lib/validations/ai.ts` exists

## Goals

Add a **Prompt Optimization** action for items of type `prompt`. A Pro user clicks "Optimize Prompt" in the item drawer, the AI rewrites the prompt to be clearer and more effective, and the result is shown side-by-side with the original in an accept/reject diff UI before any changes are committed to the database.

## Scope

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/items/AIOptimizePromptButton.tsx` | Trigger button + diff UI (original vs optimized) |
| `src/actions/__tests__/ai-optimize.test.ts` | Unit tests for the `optimizePrompt` server action |

### Files to Modify

| File | Change |
|------|--------|
| `src/lib/validations/ai.ts` | Add `optimizePromptSchema` |
| `src/actions/ai.ts` | Add `optimizePrompt` server action |
| `src/components/items/ItemDrawer.tsx` | Render `AIOptimizePromptButton` for `prompt` type items |

## Implementation Steps

### 1. Zod schema — `src/lib/validations/ai.ts`

Append:

```ts
export const optimizePromptSchema = z.object({
  itemId: z.string().min(1),
});

export type OptimizePromptInput = z.infer<typeof optimizePromptSchema>;
```

### 2. Server action — `src/actions/ai.ts`

Add `optimizePrompt`:

- Auth → Pro check → rate limit (`ai:optimize-prompt:{userId}`, 10 req/hr) → validate input
- Fetch `item.content` from DB by `itemId` (ownership-checked)
- Return early with error if `item.typeName !== "prompt"` or content is empty
- Truncate content to 2000 chars before sending
- System prompt: `"You are an expert prompt engineer. Rewrite the given prompt to be clearer, more specific, and produce better results. Return only the improved prompt text, with no preamble."`
- `max_tokens: 500`
- Return `{ success: true, data: string }` (the optimized prompt text) or `{ success: false, error: string }`

### 3. `AIOptimizePromptButton` component

Client component. Props: `{ itemId: string, originalContent: string, isPro: boolean, onApply: (optimized: string) => void }`.

**States:**

| State | UI |
|---|---|
| Free user | Wand2 icon button; Crown icon + tooltip "AI features require Pro" |
| Idle | "Optimize Prompt" button with Wand2 icon |
| Loading | Loader2 spinner, button disabled |
| Diff view | Two-panel layout — original (left) vs optimized (right) with Apply / Dismiss |

**Diff view layout:**

```
┌─────────────────────────────────────────────────┐
│ Original              │ Optimized               │
│ (existing content)    │ (AI result, highlighted) │
├─────────────────────────────────────────────────┤
│                  [Apply]  [Dismiss]              │
└─────────────────────────────────────────────────┘
```

Both panels use `MarkdownEditor` in preview mode (read-only). The optimized panel uses a subtle `ring-1 ring-violet-500/40` border to indicate it is the AI suggestion.

On **Apply**: call the existing `updateItem` server action with `{ content: optimizedContent }`, show success toast "Prompt updated", close diff view. On **Dismiss**: return to idle without saving.

### 4. Item Drawer integration

In `ItemDrawer`, render `AIOptimizePromptButton` in the action bar only when `item.typeName === "prompt"`. Pass `isPro` from session prop flow (already available).

## Test Plan

- `npm test` — all unit tests pass
- `npm run build` — no TypeScript errors
- Manual (Pro user, prompt item):
  - [ ] "Optimize Prompt" button is visible in the action bar
  - [ ] Clicking shows Loader2 spinner while AI call is in flight
  - [ ] Diff view renders original and optimized side by side
  - [ ] "Apply" saves the optimized content; item content updates after drawer refresh
  - [ ] "Dismiss" closes diff view; item content is unchanged
  - [ ] Rate limit toast appears after 10 requests within 1 hour
- Manual (Pro user, non-prompt item):
  - [ ] "Optimize Prompt" button does not appear
- Manual (Free user):
  - [ ] Button shows Crown icon; tooltip shown on hover; no AI call made

## Notes

- The action only accepts `itemId` — content is fetched from DB server-side, not passed from the client, to prevent spoofing
- `updateItem` server action (already exists) is reused for the Apply step; no new write endpoint needed
- The diff UI avoids showing a raw text diff (line-by-line delta); instead it shows the two full versions side by side — prompts are often short enough that a side-by-side read is more useful than a diff
- See `docs/ai-integration-plan.md` for system prompt details, rate limit configuration, and security considerations

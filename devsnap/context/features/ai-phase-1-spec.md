# Feature: AI Integration — Phase 1 (SDK Setup, Auto-tagging & Summaries)

## Status

Not Started

## Goals

Install the OpenAI SDK, create the singleton client, wire up per-user rate limiting for AI calls, and implement two Pro-only server actions: **Suggest Tags** and **Summarize Item**. Both features display as action buttons in the item drawer with an accept/dismiss suggestion UI. No streaming — plain server actions following the existing `{ success, data, error }` pattern.

## Prerequisites

- `session.user.isPro` is available in the session (Stripe Phase 1 complete)
- Redis is configured (`REDIS_URL`) for rate limiting
- `src/lib/rate-limit.ts` exists

## Scope

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/openai.ts` | OpenAI client singleton |
| `src/actions/ai.ts` | `suggestTags` and `summarizeItem` server actions |
| `src/lib/validations/ai.ts` | Zod schemas for AI action inputs |
| `src/components/items/AISuggestTagsButton.tsx` | Trigger button + inline suggestion UI for tags |
| `src/components/items/AISummarizeButton.tsx` | Trigger button + inline suggestion UI for summary |
| `src/actions/__tests__/ai.test.ts` | Unit tests for both server actions |

### Files to Modify

| File | Change |
|------|--------|
| `.env.local` | Add `OPENAI_API_KEY` |
| `src/components/items/ItemDrawer.tsx` | Add `AISuggestTagsButton` and `AISummarizeButton` to the action bar (Pro users only) |

### Out of Scope (Phase 2)

- Prompt optimization feature
- Code explanation (separate spec: `ai-explain-spec.md`)
- Persisting AI results to the database (aiSummary / aiTags columns)

## Implementation Steps

### 1. Install OpenAI SDK

```bash
npm install openai
```

### 2. Add env var

```env
OPENAI_API_KEY=sk-...
```

### 3. OpenAI singleton — `src/lib/openai.ts`

Mirror the `src/lib/stripe.ts` pattern:

```ts
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

Never use `NEXT_PUBLIC_OPENAI_API_KEY`.

### 4. Zod validation — `src/lib/validations/ai.ts`

```ts
import { z } from "zod";

export const suggestTagsSchema = z.object({
  itemId: z.string().min(1),
});

export const summarizeItemSchema = z.object({
  itemId: z.string().min(1),
});

export type SuggestTagsInput = z.infer<typeof suggestTagsSchema>;
export type SummarizeItemInput = z.infer<typeof summarizeItemSchema>;
```

### 5. Server actions — `src/actions/ai.ts`

Both actions share the same guard pattern: auth → Pro check → rate limit → fetch item from DB → call OpenAI → return result. Always fetch item server-side using `itemId` — never trust client-supplied content.

**`suggestTags`**

- Rate limit: 20 requests/hr per user (`ai:suggest-tags:{userId}`)
- Fetch `item.title` + `item.content` from DB
- Truncate content to 500 chars before sending
- Use `response_format: { type: "json_object" }` and parse `{ tags: string[] }`
- `max_tokens: 100`
- Return `{ success: true, data: string[] }` or `{ success: false, error: string }`

**`summarizeItem`**

- Rate limit: 20 requests/hr per user (`ai:summarize:{userId}`)
- Fetch `item.title` + `item.content` from DB
- Truncate content to 1500 chars before sending
- Plain text response (no `response_format`)
- `max_tokens: 150`
- Return `{ success: true, data: string }` or `{ success: false, error: string }`

Error handling for both:
```ts
} catch (err) {
  if (err instanceof OpenAI.APIError) {
    if (err.status === 429) return { success: false, error: "AI service is busy. Try again in a moment." };
    if (err.status >= 500) return { success: false, error: "AI service is temporarily unavailable." };
  }
  return { success: false, error: "AI request failed. Please try again." };
}
```

### 6. `AISuggestTagsButton` component

Client component. Props: `{ itemId: string, currentTags: string[], isPro: boolean, onApply: (tags: string[]) => void }`.

States:
- **Free user**: Sparkles icon button with Crown icon and tooltip "AI features require Pro"
- **Idle**: "Suggest Tags" button with Sparkles icon
- **Loading**: Loader2 spinner, button disabled
- **Suggested**: Renders suggested tags as pills with "Apply" and "Dismiss" buttons

On Apply: merge suggested tags with existing, call `updateItem` server action, show success toast. On Dismiss: return to idle.

### 7. `AISummarizeButton` component

Client component. Props: `{ itemId: string, isPro: boolean }`.

States:
- **Free user**: button with Crown icon and tooltip
- **Idle**: "Summarize" button with Sparkles icon
- **Loading**: Loader2 spinner
- **Suggested**: Renders summary text in a small card with "Dismiss" button (summary is display-only, not saved to DB in Phase 1)

### 8. Item Drawer integration

Add both buttons to the ItemDrawer action bar. Pass `isPro` from the existing session prop flow. Only show for relevant item types:
- `AISuggestTagsButton`: all item types
- `AISummarizeButton`: snippet, prompt, command, note (not file, image, link)

## Test Plan

- `npm test` — all unit tests pass
- `npm run build` — no TypeScript errors
- Manual (Pro user):
  - [ ] "Suggest Tags" returns up to 5 relevant lowercase tags for a snippet
  - [ ] "Apply" merges suggested tags into the item (tags visible in drawer after refresh)
  - [ ] "Dismiss" clears the suggestion without saving
  - [ ] "Summarize" returns a 1-2 sentence summary for a note
  - [ ] Both buttons show Loader2 spinner while loading
  - [ ] Rate limit toast appears after 20 requests within 1 hour
- Manual (Free user):
  - [ ] Both buttons show Crown icon; clicking shows tooltip, no AI call is made

## Notes

- Item content is always fetched from the DB server-side using `itemId` — client never passes raw content
- AI results are not persisted to the database in Phase 1; caching via `aiSummary` / `aiTags` DB columns is a future enhancement
- Prompt injection is prevented by keeping user content in the `user` message role only, never interpolated into the system prompt
- See `docs/ai-integration-plan.md` for full architectural context, prompt templates, and cost optimization details

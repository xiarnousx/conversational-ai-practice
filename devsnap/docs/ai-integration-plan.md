# AI Integration Plan

## Overview

This document covers how to integrate OpenAI `gpt-5-nano` into DevStash for four features: auto-tagging, AI summaries, code explanation, and prompt optimization. All AI features are **Pro-only**.

---

## 1. SDK Setup

### Installation

```bash
npm install openai
```

### Singleton Client (`src/lib/openai.ts`)

Mirror the stripe.ts singleton pattern:

```ts
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

**Never** use `NEXT_PUBLIC_OPENAI_API_KEY` — the key must stay server-side only.

### Environment Variable

```env
OPENAI_API_KEY=sk-...
```

Add to `.env.local` for dev, and the deployment secrets manager (Vercel env vars / AWS Secrets Manager) for production. Never commit to version control.

---

## 2. Feature Architecture

### Non-streaming features (auto-tag, summarize, optimize prompt)

Use **Server Actions** — they fit the existing `{ success, data, error }` pattern and avoid exposing an HTTP endpoint.

```ts
// src/actions/ai.ts
"use server";

export type AISuggestResult =
  | { success: true; data: string[] }
  | { success: false; error: string };

export async function suggestTags(itemId: string): Promise<AISuggestResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };
  if (!session.user.isPro) return { success: false, error: "Pro feature" };
  // ...call openai, return tags
}
```

### Streaming feature (code explanation)

Use a **Route Handler** (`src/app/api/ai/explain/route.ts`) returning a `ReadableStream`. Server Actions cannot stream incremental text to the client. Use the Vercel AI SDK's `streamText` or the raw OpenAI streaming API.

```ts
// Route Handler pattern
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.isPro) {
    return new Response("Pro feature", { status: 403 });
  }
  // stream response back
}
```

---

## 3. Feature Implementations

### A) Auto-tagging

**When:** After item save (user clicks "Suggest Tags" button — not automatic on every save to avoid latency and cost).

**Prompt strategy:** Use structured outputs with `response_format: { type: "json_object" }` to get a reliable JSON array of tags. No need to describe the schema in the prompt itself — this saves tokens.

```ts
const response = await openai.chat.completions.create({
  model: "gpt-5-nano",
  response_format: { type: "json_object" },
  messages: [
    {
      role: "system",
      content: 'Return JSON: { "tags": ["tag1", "tag2", "tag3"] }. Max 5 tags. Lowercase, no spaces.',
    },
    {
      role: "user",
      content: `Title: ${title}\n\nContent: ${truncate(content, 500)}`,
    },
  ],
  max_tokens: 100,
});
```

**Input truncation:** Cap content at ~500 chars for tagging — the model only needs enough context to classify.

### B) AI Summary

**When:** User clicks "Summarize" button in item drawer.

```ts
const response = await openai.chat.completions.create({
  model: "gpt-5-nano",
  messages: [
    {
      role: "system",
      content: "Write a 1-2 sentence summary of the following developer resource. Be concise and technical.",
    },
    {
      role: "user",
      content: truncate(content, 1500),
    },
  ],
  max_tokens: 150,
});
```

Store the result in a `aiSummary String?` column on `Item` so it's not re-generated on every view.

### C) Code Explanation

**When:** User clicks "Explain Code" in the drawer for snippet/command types.

**Use streaming** — explanations can be long (300–600 tokens) and users benefit from seeing text appear immediately.

```ts
// src/app/api/ai/explain/route.ts
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.isPro) return new Response("Pro required", { status: 403 });

  const { content, language } = await req.json();

  const stream = await openai.chat.completions.create({
    model: "gpt-5-nano",
    stream: true,
    messages: [
      {
        role: "system",
        content: `Explain the following ${language ?? "code"} snippet clearly and concisely for a developer.`,
      },
      { role: "user", content: truncate(content, 2000) },
    ],
    max_tokens: 400,
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

On the client, read the stream with `fetch` + `response.body.getReader()` and append chunks to state.

### D) Prompt Optimization

**When:** User clicks "Optimize Prompt" for items of type `prompt`.

```ts
const response = await openai.chat.completions.create({
  model: "gpt-5-nano",
  messages: [
    {
      role: "system",
      content:
        "You are an expert prompt engineer. Rewrite the given prompt to be clearer, more specific, and produce better results. Return only the improved prompt text.",
    },
    { role: "user", content: truncate(content, 2000) },
  ],
  max_tokens: 500,
});
```

Present the result as a diff-style accept/reject UI (original vs suggested). Do not auto-apply.

---

## 4. Pro Gating

Follow the existing `getUserLimits()` pattern. Check `session.user.isPro` from the JWT (already synced via the JWT callback):

```ts
// In server actions
if (!session.user.isPro) {
  return { success: false, error: "UPGRADE_REQUIRED" };
}

// In route handlers
if (!session?.user?.isPro) {
  return new Response(JSON.stringify({ error: "UPGRADE_REQUIRED" }), { status: 403 });
}
```

The client should detect `error === "UPGRADE_REQUIRED"` and show the upgrade dialog (same pattern as item/collection limit errors in `NewItemDialog`).

---

## 5. Rate Limiting

Apply per-user rate limits on AI endpoints using the existing `rateLimit()` utility from `src/lib/rate-limit.ts`. AI calls are expensive — be conservative:

| Feature          | Limit     | Window |
|------------------|-----------|--------|
| Auto-tag         | 20/hr     | 1 hour |
| Summarize        | 20/hr     | 1 hour |
| Explain Code     | 10/hr     | 1 hour |
| Optimize Prompt  | 10/hr     | 1 hour |

```ts
const limited = await rateLimit({
  key: `ai:suggest-tags:${session.user.id}`,
  limit: 20,
  windowSeconds: 3600,
});
if (!limited.success) return { success: false, error: "Rate limit exceeded. Try again later." };
```

Redis fail-open behavior is already handled by the existing utility — AI calls will proceed if Redis is down.

---

## 6. Error Handling

Wrap all OpenAI calls in try/catch. Map error types to user-friendly messages:

```ts
try {
  // openai call
} catch (err) {
  if (err instanceof OpenAI.APIError) {
    if (err.status === 429) return { success: false, error: "AI service is busy. Try again in a moment." };
    if (err.status >= 500) return { success: false, error: "AI service is temporarily unavailable." };
  }
  return { success: false, error: "AI request failed. Please try again." };
}
```

Never expose raw OpenAI error messages to the client (they may contain prompt content).

---

## 7. Cost Optimization

| Strategy | How |
|---|---|
| **Input truncation** | Cap content passed to the model: 500 chars for tagging, 1500 for summary, 2000 for explain/optimize |
| **Low max_tokens** | Set tight `max_tokens` per feature — auto-tag needs ~100, summary ~150, explain ~400 |
| **Structured outputs** | Use `response_format: { type: "json_object" }` instead of describing the JSON schema in the prompt |
| **Cache results** | Store `aiSummary` and `aiTags` on the `Item` row; don't re-call the API on repeated views |
| **On-demand only** | Never auto-trigger AI on item save; require explicit user action |
| **gpt-5-nano** | Already the cheapest tier; no model upgrade needed for these features |

---

## 8. UI Patterns

### Loading State

Each AI button gets a local `isPending` boolean. Show a spinner in the button and disable it during the call:

```tsx
<Button onClick={handleSuggestTags} disabled={isPending}>
  {isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
  Suggest Tags
</Button>
```

### Accept / Reject Pattern

For suggestions that modify item content (tags, summary, optimized prompt), show the result in a temporary state before committing:

```
[Suggested Tags: react, hooks, performance]  [Apply All] [Dismiss]
```

Calling `updateItem` is only triggered when the user clicks **Apply**. This prevents unwanted overwrites.

### Streaming UI

For code explanation, append chunks to a `string` state variable and render inside the existing `MarkdownEditor` in preview mode:

```tsx
const [explanation, setExplanation] = useState("");

// on each stream chunk:
setExplanation(prev => prev + chunk);
```

---

## 9. Security Considerations

| Concern | Mitigation |
|---|---|
| **API key exposure** | `OPENAI_API_KEY` server-only env var; never `NEXT_PUBLIC_` |
| **Prompt injection** | Separate system and user messages; never interpolate raw user input into the system prompt |
| **Content length attacks** | Truncate all user content before sending to the API (see cost section) |
| **Input validation** | Validate `itemId` and fetch item from DB server-side; never trust client-supplied content strings directly |
| **Output trust** | AI-suggested tags and summaries are treated as unverified suggestions — the user must confirm before they are written to the DB |
| **SSRF / data exfiltration** | All AI calls go outbound from the server to `api.openai.com` only; no user-controlled URLs are passed to the model |

---

## 10. File Structure

```
src/
  lib/
    openai.ts                   # singleton client
  actions/
    ai.ts                       # suggestTags, summarizeItem, optimizePrompt server actions
  app/
    api/
      ai/
        explain/route.ts        # streaming code explanation route handler
  lib/
    validations/
      ai.ts                     # Zod schemas for AI action inputs
  components/
    items/
      AISuggestButton.tsx       # reusable AI trigger button with loading state
      AIExplainPanel.tsx        # streaming explanation panel
```

---

## 11. Prisma Schema Additions

Two optional columns on `Item` to cache AI results:

```prisma
model Item {
  // ...existing fields
  aiSummary   String?
  aiTags      String[]  @default([])
}
```

Run `prisma migrate dev --name add-ai-fields` after adding these.

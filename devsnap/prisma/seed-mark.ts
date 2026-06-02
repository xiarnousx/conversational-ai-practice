import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const MARK_EMAIL = "mark@gmail.com";

async function getOrCreateSystemTypeId(name: string): Promise<string> {
  const existing = await prisma.itemType.findFirst({
    where: { name, isSystem: true, userId: null },
    select: { id: true },
  });
  if (existing) return existing.id;
  const created = await prisma.itemType.create({
    data: { name, isSystem: true },
  });
  return created.id;
}

async function main() {
  console.log("Seeding mark@gmail.com...");

  // ─── Wipe existing mark data ──────────────────────────────────────────────

  const existing = await prisma.user.findUnique({ where: { email: MARK_EMAIL } });
  if (existing) {
    await prisma.itemTag.deleteMany({ where: { item: { userId: existing.id } } });
    await prisma.itemCollection.deleteMany({ where: { item: { userId: existing.id } } });
    await prisma.item.deleteMany({ where: { userId: existing.id } });
    await prisma.collection.deleteMany({ where: { userId: existing.id } });
    await prisma.tag.deleteMany({ where: { userId: existing.id } });
    await prisma.user.delete({ where: { id: existing.id } });
    console.log("Deleted existing mark@gmail.com data");
  }

  // ─── User ─────────────────────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash("12345678", 12);

  const mark = await prisma.user.create({
    data: {
      email: MARK_EMAIL,
      name: "Mark Twain",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  console.log(`Created user: ${mark.email}`);

  // ─── Resolve system item type IDs ─────────────────────────────────────────

  const snippetId = await getOrCreateSystemTypeId("snippet");
  const promptId = await getOrCreateSystemTypeId("prompt");
  const commandId = await getOrCreateSystemTypeId("command");
  const noteId = await getOrCreateSystemTypeId("note");
  const linkId = await getOrCreateSystemTypeId("link");

  // ─── Collection 1: React Patterns ─────────────────────────────────────────

  const reactPatterns = await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React hooks, components and patterns",
      isFavorite: true,
      userId: mark.id,
    },
  });

  const reactItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "useLocalStorage Hook",
        contentType: "text",
        language: "typescript",
        content: `import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValue, setValue] as const;
}`,
        isFavorite: true,
        isPinned: true,
        userId: mark.id,
        typeId: snippetId,
        collections: { create: [{ collectionId: reactPatterns.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "useDebounce Hook",
        contentType: "text",
        language: "typescript",
        content: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}`,
        isFavorite: false,
        isPinned: false,
        userId: mark.id,
        typeId: snippetId,
        collections: { create: [{ collectionId: reactPatterns.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "React Error Boundary",
        contentType: "text",
        language: "tsx",
        content: `import { Component, ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}`,
        isFavorite: true,
        isPinned: false,
        userId: mark.id,
        typeId: snippetId,
        collections: { create: [{ collectionId: reactPatterns.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "useFetch Hook",
        contentType: "text",
        language: "typescript",
        content: `import { useState, useEffect } from "react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}`,
        isFavorite: false,
        isPinned: false,
        userId: mark.id,
        typeId: snippetId,
        collections: { create: [{ collectionId: reactPatterns.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "React 19 Key Changes",
        contentType: "text",
        content: `## React 19 — What Changed

### Actions
- \`useActionState\` replaces \`useFormState\`
- Native support for async transitions with loading states

### New Hooks
- \`useOptimistic\` for optimistic UI updates
- \`use(Promise)\` reads a promise inside render

### Server Components
- \`"use server"\` / \`"use client"\` directives stable
- Server Actions callable directly from client

### Compiler
- React Compiler auto-memoizes — no more \`useMemo\`/\`useCallback\` boilerplate
- Still opt-in via Babel plugin in Next.js 16`,
        isFavorite: true,
        isPinned: true,
        userId: mark.id,
        typeId: noteId,
        collections: { create: [{ collectionId: reactPatterns.id }] },
      },
    }),
  ]);

  // ─── Collection 2: AI Prompts ──────────────────────────────────────────────

  const aiPrompts = await prisma.collection.create({
    data: {
      name: "AI Prompts",
      description: "Curated prompts for coding, writing and research",
      isFavorite: true,
      userId: mark.id,
    },
  });

  await Promise.all([
    prisma.item.create({
      data: {
        title: "Code Review Assistant",
        contentType: "text",
        content: `Review the following code and provide feedback on:

1. **Correctness** — Are there any bugs or logic errors?
2. **Performance** — Unnecessary re-renders, N+1 queries, or inefficiencies?
3. **Security** — Input validation, auth checks, injection risks?
4. **Readability** — Is the code clear and well-structured?
5. **Patterns** — Does it follow the project's conventions?

Be concise. List issues by severity: critical / warning / suggestion.

\`\`\`
{code}
\`\`\``,
        isFavorite: true,
        isPinned: true,
        userId: mark.id,
        typeId: promptId,
        collections: { create: [{ collectionId: aiPrompts.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Debug This Error",
        contentType: "text",
        content: `I'm getting the following error in my {language} project:

\`\`\`
{error_message}
\`\`\`

Context:
- Framework: {framework}
- What I was doing: {description}

Please:
1. Explain what the error means
2. Identify the most likely root cause
3. Provide a fix with explanation
4. Suggest how to prevent it in the future`,
        isFavorite: true,
        isPinned: false,
        userId: mark.id,
        typeId: promptId,
        collections: { create: [{ collectionId: aiPrompts.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Write Unit Tests",
        contentType: "text",
        content: `Write comprehensive unit tests for the following function using {test_framework}.

Requirements:
- Cover the happy path
- Cover edge cases (empty input, null, undefined, boundary values)
- Cover error cases (invalid input, thrown errors)
- Each test should have a clear description
- Use AAA pattern (Arrange, Act, Assert)

\`\`\`
{code}
\`\`\``,
        isFavorite: false,
        isPinned: false,
        userId: mark.id,
        typeId: promptId,
        collections: { create: [{ collectionId: aiPrompts.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Explain Code Like I'm Senior Dev",
        contentType: "text",
        content: `Explain the following code to me as if I'm an experienced developer who is new to this codebase.

Focus on:
- What problem it solves (the WHY, not the what)
- Any non-obvious design decisions
- Potential gotchas or footguns
- How it fits into the larger system

Skip obvious boilerplate explanations.

\`\`\`
{code}
\`\`\``,
        isFavorite: false,
        isPinned: false,
        userId: mark.id,
        typeId: promptId,
        collections: { create: [{ collectionId: aiPrompts.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Refactor for Readability",
        contentType: "text",
        content: `Refactor the following code to improve clarity and maintainability.

Goals:
- Simplify complex logic without changing behavior
- Extract reusable helpers if a block appears more than once
- Apply single-responsibility principle
- Use modern syntax (optional chaining, nullish coalescing, etc.)
- Keep the diff minimal — don't rewrite what doesn't need changing

Return the refactored code with a short bullet list of what changed and why.

\`\`\`
{code}
\`\`\``,
        isFavorite: false,
        isPinned: true,
        userId: mark.id,
        typeId: promptId,
        collections: { create: [{ collectionId: aiPrompts.id }] },
      },
    }),
  ]);

  // ─── Collection 3: DevOps Commands ────────────────────────────────────────

  const devopsCommands = await prisma.collection.create({
    data: {
      name: "DevOps Commands",
      description: "Docker, git, kubectl and server management",
      isFavorite: false,
      userId: mark.id,
    },
  });

  await Promise.all([
    prisma.item.create({
      data: {
        title: "Docker System Cleanup",
        contentType: "text",
        language: "bash",
        content: "docker system prune -af --volumes",
        description: "Remove all stopped containers, unused images, networks and volumes",
        isFavorite: true,
        isPinned: true,
        userId: mark.id,
        typeId: commandId,
        collections: { create: [{ collectionId: devopsCommands.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Git Log Pretty",
        contentType: "text",
        language: "bash",
        content: "git log --oneline --graph --decorate --all",
        description: "Show branch graph with decorations in compact form",
        isFavorite: true,
        isPinned: false,
        userId: mark.id,
        typeId: commandId,
        collections: { create: [{ collectionId: devopsCommands.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Kill Port Process",
        contentType: "text",
        language: "bash",
        content: "lsof -ti:3000 | xargs kill -9",
        description: "Kill whatever process is listening on port 3000",
        isFavorite: false,
        isPinned: true,
        userId: mark.id,
        typeId: commandId,
        collections: { create: [{ collectionId: devopsCommands.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "SSH Tunnel to Remote DB",
        contentType: "text",
        language: "bash",
        content: "ssh -L 5432:localhost:5432 user@remote-host -N",
        description: "Forward remote PostgreSQL to localhost:5432",
        isFavorite: false,
        isPinned: false,
        userId: mark.id,
        typeId: commandId,
        collections: { create: [{ collectionId: devopsCommands.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Watch kubectl Pods",
        contentType: "text",
        language: "bash",
        content: "kubectl get pods --all-namespaces -w",
        description: "Live watch all pods across namespaces",
        isFavorite: false,
        isPinned: false,
        userId: mark.id,
        typeId: commandId,
        collections: { create: [{ collectionId: devopsCommands.id }] },
      },
    }),
    prisma.item.create({
      data: {
        title: "Prisma ORM Docs",
        contentType: "text",
        url: "https://www.prisma.io/docs",
        description: "Official Prisma ORM documentation — migrations, queries, schema reference",
        isFavorite: false,
        isPinned: false,
        userId: mark.id,
        typeId: linkId,
        collections: { create: [{ collectionId: devopsCommands.id }] },
      },
    }),
  ]);

  // ─── Tags ──────────────────────────────────────────────────────────────────

  const tagNames = ["react", "hooks", "typescript", "docker", "git", "ai", "devops"];
  const tags: Record<string, string> = {};

  for (const name of tagNames) {
    const tag = await prisma.tag.create({ data: { name, userId: mark.id } });
    tags[name] = tag.id;
  }

  // Tag react items
  const [useLocalStorage, useDebounce, errorBoundary, useFetch] = reactItems;
  await Promise.all([
    prisma.itemTag.create({ data: { itemId: useLocalStorage.id, tagId: tags["react"] } }),
    prisma.itemTag.create({ data: { itemId: useLocalStorage.id, tagId: tags["hooks"] } }),
    prisma.itemTag.create({ data: { itemId: useLocalStorage.id, tagId: tags["typescript"] } }),
    prisma.itemTag.create({ data: { itemId: useDebounce.id, tagId: tags["react"] } }),
    prisma.itemTag.create({ data: { itemId: useDebounce.id, tagId: tags["hooks"] } }),
    prisma.itemTag.create({ data: { itemId: errorBoundary.id, tagId: tags["react"] } }),
    prisma.itemTag.create({ data: { itemId: useFetch.id, tagId: tags["react"] } }),
    prisma.itemTag.create({ data: { itemId: useFetch.id, tagId: tags["hooks"] } }),
    prisma.itemTag.create({ data: { itemId: useFetch.id, tagId: tags["typescript"] } }),
  ]);

  console.log("Seeding complete.");
  console.log(`  Collections: 3`);
  console.log(`  Items: ${5 + 5 + 6}`);
  console.log(`  Tags: ${tagNames.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

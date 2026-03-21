export const mockUser = {
  id: "user-1",
  name: "Demo User",
  email: "demo@devstash.com",
  isPro: true,
};

export const mockItemTypes = [
  { id: "type-snippet", name: "Snippet", icon: "code", color: "#a78bfa", isSystem: true },
  { id: "type-prompt", name: "Prompt", icon: "sparkles", color: "#60a5fa", isSystem: true },
  { id: "type-command", name: "Command", icon: "terminal", color: "#34d399", isSystem: true },
  { id: "type-note", name: "Note", icon: "file-text", color: "#fbbf24", isSystem: true },
  { id: "type-file", name: "File", icon: "file", color: "#f87171", isSystem: true },
  { id: "type-image", name: "Image", icon: "image", color: "#fb923c", isSystem: true },
  { id: "type-url", name: "URL", icon: "link", color: "#38bdf8", isSystem: true },
];

export const mockCollections = [
  {
    id: "col-1",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    itemCount: 12,
    isFavorite: true,
    icons: ["snippet", "url", "note"],
  },
  {
    id: "col-2",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    itemCount: 8,
    isFavorite: false,
    icons: ["snippet", "file"],
  },
  {
    id: "col-3",
    name: "Context Files",
    description: "AI context files for projects",
    itemCount: 5,
    isFavorite: true,
    icons: ["file", "image"],
  },
  {
    id: "col-4",
    name: "Interview Prep",
    description: "Technical interview preparation",
    itemCount: 24,
    isFavorite: false,
    icons: ["snippet", "command", "url", "note"],
  },
  {
    id: "col-5",
    name: "Git Commands",
    description: "Frequently used git commands",
    itemCount: 15,
    isFavorite: true,
    icons: ["snippet", "file"],
  },
  {
    id: "col-6",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    itemCount: 18,
    isFavorite: false,
    icons: ["prompt", "snippet"],
  },
];

export const mockItems = [
  {
    id: "item-1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    contentType: "text",
    content: `import { useSession } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}`,
    typeId: "type-snippet",
    typeName: "Snippet",
    collectionId: "col-1",
    language: "typescript",
    tags: ["react", "auth", "hooks"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2026-03-19T10:00:00Z",
    updatedAt: "2026-03-19T10:00:00Z",
  },
  {
    id: "item-2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    contentType: "text",
    content: `async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(res.statusText)
      return await res.json()
    } catch (e) {
      if (i === retries - 1) throw e
      await new Promise(r => setTimeout(r, 2 ** i * 1000))
    }
  }
}`,
    typeId: "type-snippet",
    typeName: "Snippet",
    collectionId: "col-1",
    language: "typescript",
    tags: ["api", "error-handling", "fetch"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2026-03-19T11:00:00Z",
    updatedAt: "2026-03-19T11:00:00Z",
  },
  {
    id: "item-3",
    title: "Git Undo Last Commit",
    description: "Undo last commit while keeping changes staged",
    contentType: "text",
    content: "git reset --soft HEAD~1",
    typeId: "type-command",
    typeName: "Command",
    collectionId: "col-5",
    language: "bash",
    tags: ["git", "undo"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-03-18T09:00:00Z",
    updatedAt: "2026-03-18T09:00:00Z",
  },
  {
    id: "item-4",
    title: "Code Review Prompt",
    description: "Prompt for AI code review with actionable feedback",
    contentType: "text",
    content:
      "Review the following code for: 1) Security vulnerabilities 2) Performance issues 3) Code style 4) Edge cases. Provide specific, actionable feedback with examples.",
    typeId: "type-prompt",
    typeName: "Prompt",
    collectionId: "col-6",
    language: null,
    tags: ["ai", "code-review"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-03-17T14:00:00Z",
    updatedAt: "2026-03-17T14:00:00Z",
  },
  {
    id: "item-5",
    title: "Prisma Query Cheatsheet",
    description: "Common Prisma ORM query patterns",
    contentType: "text",
    content: `// Find many with filter
const users = await prisma.user.findMany({
  where: { isActive: true },
  include: { posts: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
})`,
    typeId: "type-snippet",
    typeName: "Snippet",
    collectionId: "col-2",
    language: "typescript",
    tags: ["prisma", "database"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-03-16T16:00:00Z",
    updatedAt: "2026-03-16T16:00:00Z",
  },
  {
    id: "item-6",
    title: "DevStash Project Context",
    description: "Main project overview context file for AI assistants",
    contentType: "text",
    content: "# DevStash Context\nA developer knowledge hub built with Next.js...",
    typeId: "type-file",
    typeName: "File",
    collectionId: "col-3",
    language: "markdown",
    tags: ["context", "ai"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-03-15T12:00:00Z",
    updatedAt: "2026-03-15T12:00:00Z",
  },
  {
    id: "item-7",
    title: "Next.js Docs",
    description: "Official Next.js documentation",
    contentType: "text",
    url: "https://nextjs.org/docs",
    content: null,
    typeId: "type-url",
    typeName: "URL",
    collectionId: null,
    language: null,
    tags: ["nextjs", "docs"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-03-14T08:00:00Z",
    updatedAt: "2026-03-14T08:00:00Z",
  },
  {
    id: "item-8",
    title: "System Design Interview Notes",
    description: "Notes on scalability, load balancing, and caching",
    contentType: "text",
    content:
      "## Key Concepts\n- Horizontal vs vertical scaling\n- CAP theorem\n- Load balancing strategies\n- Cache invalidation patterns",
    typeId: "type-note",
    typeName: "Note",
    collectionId: "col-4",
    language: "markdown",
    tags: ["system-design", "interview"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-03-13T10:00:00Z",
    updatedAt: "2026-03-13T10:00:00Z",
  },
];

export const mockTypeCounts: Record<string, number> = {
  Snippet: 24,
  Prompt: 18,
  Command: 15,
  Note: 12,
  File: 5,
  Image: 3,
  URL: 8,
};

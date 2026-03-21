import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ─── User ──────────────────────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });

  console.log(`Created user: ${user.email}`);

  // ─── System Item Types ─────────────────────────────────────────────────────

  const systemTypes = [
    { name: "snippet", icon: "Code", color: "#3b82f6" },
    { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
    { name: "command", icon: "Terminal", color: "#f97316" },
    { name: "note", icon: "StickyNote", color: "#fde047" },
    { name: "file", icon: "File", color: "#6b7280" },
    { name: "image", icon: "Image", color: "#ec4899" },
    { name: "link", icon: "Link", color: "#10b981" },
  ];

  const createdTypes: Record<string, string> = {};

  for (const t of systemTypes) {
    const itemType = await prisma.itemType.upsert({
      where: {
        // upsert by name + null userId (system types have no user)
        id: (
          await prisma.itemType.findFirst({
            where: { name: t.name, isSystem: true, userId: null },
            select: { id: true },
          })
        )?.id ?? "new",
      },
      update: {},
      create: {
        name: t.name,
        icon: t.icon,
        color: t.color,
        isSystem: true,
      },
    });
    createdTypes[t.name] = itemType.id;
  }

  console.log("Created system item types");

  // ─── Collections & Items ───────────────────────────────────────────────────

  // React Patterns
  const reactPatterns = await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
    },
  });

  await prisma.item.createMany({
    data: [
      {
        title: "useDebounce & useLocalStorage Hooks",
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
}

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
        userId: user.id,
        typeId: createdTypes["snippet"],
        collectionId: reactPatterns.id,
      },
      {
        title: "Context Provider Pattern",
        contentType: "text",
        language: "typescript",
        content: `import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}`,
        userId: user.id,
        typeId: createdTypes["snippet"],
        collectionId: reactPatterns.id,
      },
      {
        title: "Compound Component Pattern",
        contentType: "text",
        language: "typescript",
        content: `import { createContext, useContext, ReactNode } from "react";

interface AccordionContextValue {
  openItem: string | null;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue>({
  openItem: null,
  toggle: () => {},
});

function Accordion({ children }: { children: ReactNode }) {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const toggle = (id: string) => setOpenItem((curr) => (curr === id ? null : id));
  return (
    <AccordionContext.Provider value={{ openItem, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const { openItem, toggle } = useContext(AccordionContext);
  return (
    <div>
      <button onClick={() => toggle(id)}>{title}</button>
      {openItem === id && <div>{children}</div>}
    </div>
  );
}

Accordion.Item = AccordionItem;
export { Accordion };`,
        userId: user.id,
        typeId: createdTypes["snippet"],
        collectionId: reactPatterns.id,
      },
    ],
  });

  // AI Workflows
  const aiWorkflows = await prisma.collection.create({
    data: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
    },
  });

  await prisma.item.createMany({
    data: [
      {
        title: "Code Review Prompt",
        contentType: "text",
        content: `Review the following code and provide feedback on:

1. **Correctness** — Are there any bugs or logic errors?
2. **Performance** — Any unnecessary re-renders, N+1 queries, or inefficiencies?
3. **Security** — Input validation, auth checks, injection risks?
4. **Readability** — Is the code clear and well-structured?
5. **Patterns** — Does it follow the project's conventions?

Be concise. List issues by severity (critical / warning / suggestion).

\`\`\`
{code}
\`\`\``,
        userId: user.id,
        typeId: createdTypes["prompt"],
        collectionId: aiWorkflows.id,
      },
      {
        title: "Documentation Generator Prompt",
        contentType: "text",
        content: `Generate concise documentation for the following function or module.

Include:
- **Purpose** — One sentence describing what it does
- **Parameters** — Name, type, and description for each
- **Returns** — What it returns and when
- **Example** — A short usage example
- **Edge cases** — Any important constraints or gotchas

Keep it developer-friendly. Use TypeScript types where relevant.

\`\`\`
{code}
\`\`\``,
        userId: user.id,
        typeId: createdTypes["prompt"],
        collectionId: aiWorkflows.id,
      },
      {
        title: "Refactoring Assistant Prompt",
        contentType: "text",
        content: `Refactor the following code to improve clarity and maintainability.

Goals:
- Simplify complex logic without changing behavior
- Extract reusable helpers if a block appears more than once
- Apply the single-responsibility principle
- Use modern syntax (optional chaining, nullish coalescing, etc.)
- Keep the diff minimal — don't rewrite what doesn't need changing

Return the refactored code with a short bullet list of what changed and why.

\`\`\`
{code}
\`\`\``,
        userId: user.id,
        typeId: createdTypes["prompt"],
        collectionId: aiWorkflows.id,
      },
    ],
  });

  // DevOps
  const devops = await prisma.collection.create({
    data: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
    },
  });

  await prisma.item.createMany({
    data: [
      {
        title: "Docker Compose — Next.js + PostgreSQL",
        contentType: "text",
        language: "yaml",
        content: `version: "3.9"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/devsnap
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: devsnap
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:`,
        userId: user.id,
        typeId: createdTypes["snippet"],
        collectionId: devops.id,
      },
      {
        title: "Deploy to Vercel",
        contentType: "text",
        content: `# Build & deploy
npm run build
vercel --prod

# Run migrations before deploy (Vercel build command)
prisma migrate deploy && next build

# Check deployment status
vercel ls
vercel logs --follow`,
        userId: user.id,
        typeId: createdTypes["command"],
        collectionId: devops.id,
      },
      {
        title: "Prisma Documentation",
        contentType: "text",
        url: "https://www.prisma.io/docs",
        description: "Official Prisma ORM documentation — migrations, queries, schema reference",
        userId: user.id,
        typeId: createdTypes["link"],
        collectionId: devops.id,
      },
      {
        title: "Docker Documentation",
        contentType: "text",
        url: "https://docs.docker.com",
        description: "Official Docker documentation — containers, compose, networking",
        userId: user.id,
        typeId: createdTypes["link"],
        collectionId: devops.id,
      },
    ],
  });

  // Terminal Commands
  const terminalCommands = await prisma.collection.create({
    data: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
    },
  });

  await prisma.item.createMany({
    data: [
      {
        title: "Git Operations",
        contentType: "text",
        content: `# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Stash with a message
git stash push -m "wip: feature description"

# Interactive rebase last 3 commits
git rebase -i HEAD~3

# Clean up merged branches
git branch --merged | grep -v main | xargs git branch -d

# Show log as graph
git log --oneline --graph --decorate --all`,
        userId: user.id,
        typeId: createdTypes["command"],
        collectionId: terminalCommands.id,
      },
      {
        title: "Docker Commands",
        contentType: "text",
        content: `# Stop and remove all containers
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)

# Remove all unused images
docker image prune -a

# Exec into running container
docker exec -it <container_name> sh

# View logs with follow
docker logs -f <container_name>

# Rebuild without cache
docker compose build --no-cache`,
        userId: user.id,
        typeId: createdTypes["command"],
        collectionId: terminalCommands.id,
      },
      {
        title: "Process Management",
        contentType: "text",
        content: `# Find process using a port
lsof -ti tcp:3000

# Kill process on port 3000
kill -9 $(lsof -ti tcp:3000)

# Show top CPU/memory consumers
ps aux --sort=-%cpu | head -10

# Watch a process
watch -n 2 "ps aux | grep node"`,
        userId: user.id,
        typeId: createdTypes["command"],
        collectionId: terminalCommands.id,
      },
      {
        title: "Package Manager Utilities",
        contentType: "text",
        content: `# Check for outdated packages
npm outdated

# Update all packages to latest
npx npm-check-updates -u && npm install

# Audit and fix vulnerabilities
npm audit fix

# List installed global packages
npm list -g --depth=0

# Clean install (remove node_modules first)
rm -rf node_modules package-lock.json && npm install`,
        userId: user.id,
        typeId: createdTypes["command"],
        collectionId: terminalCommands.id,
      },
    ],
  });

  // Design Resources
  const designResources = await prisma.collection.create({
    data: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
    },
  });

  await prisma.item.createMany({
    data: [
      {
        title: "Tailwind CSS Documentation",
        contentType: "text",
        url: "https://tailwindcss.com/docs",
        description: "Official Tailwind CSS docs — utility classes, configuration, plugins",
        userId: user.id,
        typeId: createdTypes["link"],
        collectionId: designResources.id,
      },
      {
        title: "shadcn/ui Components",
        contentType: "text",
        url: "https://ui.shadcn.com/docs/components",
        description: "Beautifully designed components built with Radix UI and Tailwind CSS",
        userId: user.id,
        typeId: createdTypes["link"],
        collectionId: designResources.id,
      },
      {
        title: "Radix UI Design System",
        contentType: "text",
        url: "https://www.radix-ui.com",
        description: "Unstyled, accessible components for building high-quality design systems",
        userId: user.id,
        typeId: createdTypes["link"],
        collectionId: designResources.id,
      },
      {
        title: "Lucide Icons",
        contentType: "text",
        url: "https://lucide.dev/icons",
        description: "Beautiful & consistent icon library — search and copy as React components",
        userId: user.id,
        typeId: createdTypes["link"],
        collectionId: designResources.id,
      },
    ],
  });

  console.log("Created collections and items");
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

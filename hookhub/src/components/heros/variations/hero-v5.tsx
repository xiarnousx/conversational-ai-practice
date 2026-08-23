import Link from "next/link";

const CATEGORY_CHIPS = [
  "Security & Safety",
  "Code Quality",
  "Session Management",
  "Notifications",
  "Logging & Monitoring",
  "Workflow Automation",
] as const;

interface HeroProps {
  hookCount: number;
  categoryCount?: number;
}

export default function Hero({
  hookCount,
  categoryCount = CATEGORY_CHIPS.length,
}: HeroProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
        Discover open-source hooks for Claude Code
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
        {hookCount} hooks across {categoryCount} categories — security, code
        quality, session management, notifications, logging, and workflow
        automation — ready to drop into your project.
      </p>

      {/* Stats strip */}
      <div className="mx-auto mt-8 flex max-w-md items-stretch justify-center divide-x divide-zinc-200 rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex-1 px-6 py-4">
          <div className="text-3xl font-bold text-zinc-900">{hookCount}</div>
          <div className="mt-1 text-xs font-medium tracking-wide text-zinc-500 uppercase">
            Hooks
          </div>
        </div>
        <div className="flex-1 px-6 py-4">
          <div className="text-3xl font-bold text-zinc-900">
            {categoryCount}
          </div>
          <div className="mt-1 text-xs font-medium tracking-wide text-zinc-500 uppercase">
            Categories
          </div>
        </div>
      </div>

      {/* Category chips */}
      <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2">
        {CATEGORY_CHIPS.map((label) => (
          <li key={label}>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200">
              {label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href="/browse"
          className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Browse hooks
        </Link>
        <a
          href="https://github.com/anthropics/claude-code-hooks-examples"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100"
        >
          View examples on GitHub
        </a>
      </div>
    </section>
  );
}

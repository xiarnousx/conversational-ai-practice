import Link from "next/link";
import { CATEGORY_LABELS, hooks, type Category } from "@/data/hooks";
import HookCard from "@/components/HookCard";
import Footer from "@/components/Footer";

const CATEGORY_COUNTS = Object.fromEntries(
  (Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => [
    cat,
    hooks.filter((h) => h.category === cat).length,
  ])
) as Record<Category, number>;

export default function Home() {
  const featured = hooks.slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            hookhub
          </span>
          <Link
            href="/browse"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Browse hooks
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Discover open-source hooks for Claude Code
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
          A curated directory of {hooks.length} hooks for security, code
          quality, session management, notifications, logging, and workflow
          automation — ready to drop into your project.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
            <Link
              key={cat}
              href={`/browse?category=${cat}`}
              className="rounded-xl border border-zinc-200 bg-white p-4 text-center shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-100"
            >
              <div className="text-2xl font-bold text-zinc-900">
                {CATEGORY_COUNTS[cat]}
              </div>
              <div className="mt-1 text-xs font-medium text-zinc-600">
                {CATEGORY_LABELS[cat]}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">
            Featured hooks
          </h2>
          <Link
            href="/browse"
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((hook) => (
            <HookCard key={hook.id} hook={hook} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

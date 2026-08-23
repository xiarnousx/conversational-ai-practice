import Link from "next/link";
import { CATEGORY_LABELS, hooks, type Category } from "@/data/hooks";
import HookCard from "@/components/HookCard";
import Hero from "@/components/heros/Hero";
import Footer from "@/components/Footer";

const CATEGORY_COUNTS = Object.fromEntries(
  (Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => [
    cat,
    hooks.filter((h) => h.category === cat).length,
  ])
) as Record<Category, number>;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ hero?: string }>;
}) {
  const featured = hooks.slice(0, 3);
  const { hero } = await searchParams;

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

      <Hero hookCount={hooks.length} variant={hero} />

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

import Link from "next/link";

const CATEGORIES = [
  "Security",
  "Code quality",
  "Session management",
  "Notifications",
  "Logging",
  "Workflow automation",
];

export default function Hero({ hookCount }: { hookCount: number }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
        Stop writing the Claude Code hook someone already built.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
        hookhub is a directory of {hookCount} hooks for Claude Code, ready to
        drop into your project instead of writing your own from scratch.
      </p>
      <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((category) => (
          <li
            key={category}
            className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700"
          >
            {category}
          </li>
        ))}
      </ul>
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
  );
}

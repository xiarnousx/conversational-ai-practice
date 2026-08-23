import Link from "next/link";

export default function Hero({ hookCount }: { hookCount: number }) {
  return (
    <section
      className="relative overflow-hidden bg-zinc-950 py-24 text-center"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* top/bottom fade so the dot grid doesn't hard-cut against neighboring sections */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          hookhub://catalog
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
          <span className="text-emerald-400">$</span> A directory of hooks for{" "}
          <span className="text-emerald-400">Claude Code</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl font-mono text-base leading-relaxed text-zinc-400 sm:text-lg">
          {hookCount} hooks for security, code quality, session management,
          notifications, logging, and workflow automation — ready to drop
          into your project.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/browse"
            className="rounded-md bg-emerald-500 px-6 py-3 font-mono text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(16,185,129,0.4)] transition-colors hover:bg-emerald-400"
          >
            Browse hooks &gt;_
          </Link>
          <a
            href="https://github.com/anthropics/claude-code-hooks-examples"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-zinc-700 px-6 py-3 font-mono text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
          >
            View examples on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

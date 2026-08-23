import Link from "next/link";

export default function Hero({ hookCount }: { hookCount: number }) {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
        {/* Left: copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {hookCount} hooks and counting
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            A directory of hooks for Claude Code
          </h1>

          <p className="mt-4 text-lg text-zinc-600">
            A curated directory of {hookCount} hooks for security, code
            quality, session management, notifications, logging, and workflow
            automation — ready to drop into your project.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
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
              className="text-sm font-semibold text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900 hover:decoration-zinc-500"
            >
              View examples on GitHub
            </a>
          </div>
        </div>

        {/* Right: code preview panel */}
        <div className="relative">
          <div className="absolute -inset-3 -z-10 hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-transparent lg:block" />
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-900 shadow-xl shadow-zinc-900/10">
            <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="ml-2 text-xs text-zinc-500">
                .claude/settings.json
              </span>
            </div>
            <pre className="overflow-x-auto px-5 py-5 text-[13px] leading-relaxed text-zinc-300">
              <code>{`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "hookhub/guard.sh"
          }
        ]
      }
    ]
  }
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

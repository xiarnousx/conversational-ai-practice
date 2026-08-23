import Link from "next/link";

export default function Hero({ hookCount }: { hookCount: number }) {
  return (
    <section className="relative mx-auto max-w-6xl overflow-hidden px-6 py-20 text-center">
      <style>{`
        @keyframes hero-v3-fade-up {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes hero-v3-glow-drift {
          0%,
          100% {
            transform: translate(-50%, -10%) scale(1);
            opacity: 0.35;
          }
          50% {
            transform: translate(-50%, -6%) scale(1.15);
            opacity: 0.55;
          }
        }

        @keyframes hero-v3-shine {
          from {
            transform: translateX(-130%) skewX(-12deg);
          }
          to {
            transform: translateX(230%) skewX(-12deg);
          }
        }

        .hero-v3-reveal {
          opacity: 0;
          animation: hero-v3-fade-up 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .hero-v3-glow {
          animation: hero-v3-glow-drift 9s ease-in-out infinite;
        }

        .hero-v3-shine-sweep::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.35),
            transparent
          );
          transform: translateX(-130%) skewX(-12deg);
          pointer-events: none;
        }

        .hero-v3-shine-sweep:hover::after,
        .hero-v3-shine-sweep:focus-visible::after {
          animation: hero-v3-shine 900ms ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-v3-reveal {
            animation: none;
            opacity: 1;
          }

          .hero-v3-glow {
            animation: none;
          }

          .hero-v3-shine-sweep:hover::after,
          .hero-v3-shine-sweep:focus-visible::after {
            animation: none;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="hero-v3-glow pointer-events-none absolute left-1/2 top-0 -z-10 h-[26rem] w-[26rem] rounded-full bg-zinc-300/40 blur-3xl dark:bg-zinc-700/30"
      />

      <h1
        className="hero-v3-reveal text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl"
        style={{ animationDelay: "0ms" }}
      >
        Discover open-source hooks for Claude Code
      </h1>
      <p
        className="hero-v3-reveal mx-auto mt-4 max-w-2xl text-lg text-zinc-600"
        style={{ animationDelay: "120ms" }}
      >
        A curated directory of {hookCount} hooks for security, code quality,
        session management, notifications, logging, and workflow automation —
        ready to drop into your project.
      </p>
      <div
        className="hero-v3-reveal mt-8 flex flex-wrap justify-center gap-3"
        style={{ animationDelay: "240ms" }}
      >
        <Link
          href="/browse"
          className="hero-v3-shine-sweep relative overflow-hidden rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/20 focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 active:translate-y-0"
        >
          Browse hooks
        </Link>
        <a
          href="https://github.com/anthropics/claude-code-hooks-examples"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 ring-1 ring-zinc-200 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-zinc-100 hover:ring-zinc-300 focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 active:translate-y-0"
        >
          View examples on GitHub
          <span
            aria-hidden="true"
            className="ml-1 inline-block -translate-x-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          >
            →
          </span>
        </a>
      </div>
    </section>
  );
}

import Link from "next/link";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-zinc-900"
          >
            hookhub
          </Link>
          <Link
            href="/browse"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Browse hooks
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Terms &amp; Conditions
        </h1>
        <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-zinc-600">
          <p>
            hookhub is a directory that indexes and links to third-party,
            open-source hooks for Claude Code. We do not author, host, or
            maintain the linked hooks unless explicitly noted.
          </p>
          <p>
            Hooks execute arbitrary code in your development environment.
            Review a hook&apos;s source before installing it, and use it at
            your own risk. hookhub is not responsible for any damage, data
            loss, or unintended behavior resulting from the use of a listed
            hook.
          </p>
          <p>
            Listings are provided &quot;as is&quot; without warranty of any
            kind. Descriptions and categories are maintained on a best-effort
            basis and may not reflect the current state of the linked
            repository.
          </p>
          <p>
            Content on this site may be updated or removed at any time
            without notice. Continued use of hookhub constitutes acceptance
            of these terms.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

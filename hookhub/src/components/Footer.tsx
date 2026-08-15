import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <span className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} hookhub
        </span>
        <nav className="flex gap-6">
          <Link
            href="/browse"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Browse hooks
          </Link>
          <Link
            href="/faq"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            FAQ
          </Link>
          <Link
            href="/terms"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Terms &amp; Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}

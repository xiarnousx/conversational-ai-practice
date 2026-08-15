import Link from "next/link";
import Footer from "@/components/Footer";

const FAQS = [
  {
    question: "What is hookhub?",
    answer:
      "hookhub is a curated directory of open-source hooks for Claude Code — scripts that run at specific points in a session, such as before or after a tool call, to add safety checks, logging, notifications, or workflow automation.",
  },
  {
    question: "How do I use a hook I find here?",
    answer:
      "Each listing links to the hook's source repository. Follow the setup instructions there, then register the hook in your project's Claude Code settings so it fires on the relevant event.",
  },
  {
    question: "Are these hooks maintained by Anthropic?",
    answer:
      "Some are official examples; many are community-contributed. Check the author and repository for each hook before relying on it in production.",
  },
  {
    question: "Can I submit my own hook?",
    answer:
      "Yes — open a pull request against the hook's source repository, or reach out with a link to your hook and we'll consider it for the directory.",
  },
];

export default function FaqPage() {
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
          Frequently asked questions
        </h1>
        <dl className="mt-10 flex flex-col gap-8">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="text-base font-semibold text-zinc-900">
                {faq.question}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-zinc-600">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </main>
      <Footer />
    </div>
  );
}

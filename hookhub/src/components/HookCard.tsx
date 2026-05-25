import { CATEGORY_LABELS, type Category, type Hook } from "@/data/hooks";

const CATEGORY_COLORS: Record<Category, string> = {
  security: "bg-red-100 text-red-700",
  "code-quality": "bg-blue-100 text-blue-700",
  session: "bg-purple-100 text-purple-700",
  notifications: "bg-yellow-100 text-yellow-700",
  logging: "bg-green-100 text-green-700",
  workflow: "bg-orange-100 text-orange-700",
};

export default function HookCard({ hook }: { hook: Hook }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[hook.category]}`}
        >
          {CATEGORY_LABELS[hook.category]}
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
          {hook.hook_event}
        </span>
      </div>
      <h3 className="text-base font-semibold text-zinc-900">{hook.name}</h3>
      <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600">
        {hook.description}
      </p>
      <div className="mt-auto pt-2">
        <a
          href={hook.repo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:underline"
        >
          View on GitHub
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}

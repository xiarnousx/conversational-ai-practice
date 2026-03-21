import {
  Code,
  Sparkles,
  Terminal,
  FileText,
  File,
  ImageIcon,
  Link,
  LucideIcon,
} from "lucide-react";

const typeIconMap: Record<string, { icon: LucideIcon; color: string }> = {
  snippet: { icon: Code, color: "text-violet-400" },
  prompt: { icon: Sparkles, color: "text-blue-400" },
  command: { icon: Terminal, color: "text-emerald-400" },
  note: { icon: FileText, color: "text-yellow-400" },
  file: { icon: File, color: "text-red-400" },
  image: { icon: ImageIcon, color: "text-orange-400" },
  url: { icon: Link, color: "text-sky-400" },
};

interface Item {
  id: string;
  title: string;
  description: string;
  typeName: string;
  typeColor: string;
  tags: string[];
  createdAt: string;
}

interface ItemRowProps {
  item: Item;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ItemRow({ item }: ItemRowProps) {
  const typeKey = item.typeName.toLowerCase();
  const typeEntry = typeIconMap[typeKey];
  const Icon = typeEntry?.icon ?? File;
  const iconColor = typeEntry?.color ?? "text-muted-foreground";

  return (
    <div
      className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:border-border/80 cursor-pointer transition-colors border-l-2"
      style={{ borderLeftColor: item.typeColor }}
    >
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className={`size-4 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {item.title}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <span
            className="rounded px-1.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${item.typeColor}20`, color: item.typeColor }}
          >
            {item.typeName}
          </span>
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">
        {formatDate(item.createdAt)}
      </span>
    </div>
  );
}

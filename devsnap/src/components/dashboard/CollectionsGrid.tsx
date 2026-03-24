import {
  Code,
  Sparkles,
  Terminal,
  FileText,
  File,
  ImageIcon,
  Link,
  Star,
  MoreHorizontal,
  LucideIcon,
} from "lucide-react";
import type { CollectionCardData } from "@/lib/db/collections";

const typeIconMap: Record<string, LucideIcon> = {
  snippet: Code,
  prompt: Sparkles,
  command: Terminal,
  note: FileText,
  file: File,
  image: ImageIcon,
  link: Link,
};

interface CollectionsGridProps {
  collections: CollectionCardData[];
}

export default function CollectionsGrid({ collections }: CollectionsGridProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Collections</h2>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          View all
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <div
            key={col.id}
            style={{ borderColor: col.borderColor }}
            className="group rounded-lg border bg-card p-4 cursor-pointer transition-colors"
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="truncate font-medium text-sm text-foreground">
                  {col.name}
                </span>
                {col.isFavorite && (
                  <Star className="size-3 shrink-0 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <button className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              {col.itemCount} items
            </p>
            <p className="mb-4 text-xs text-muted-foreground line-clamp-2">
              {col.description}
            </p>
            <div className="flex items-center gap-1.5">
              {col.icons.map((iconName, i) => {
                const Icon = typeIconMap[iconName];
                if (!Icon) return null;
                return (
                  <div
                    key={i}
                    className="flex size-6 items-center justify-center rounded bg-muted"
                  >
                    <Icon className="size-3 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

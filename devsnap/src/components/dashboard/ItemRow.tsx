"use client";

import { useState, useTransition } from "react";
import {
  Code,
  Sparkles,
  Terminal,
  FileText,
  File,
  ImageIcon,
  Link,
  Pin,
  Star,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useItemDrawer } from "@/components/item-drawer";
import { toggleFavoriteItem } from "@/actions/items";
import type { ItemCardData } from "@/lib/db/items";

const typeIconMap: Record<string, { icon: LucideIcon; color: string }> = {
  snippet: { icon: Code, color: "text-violet-400" },
  prompt: { icon: Sparkles, color: "text-blue-400" },
  command: { icon: Terminal, color: "text-emerald-400" },
  note: { icon: FileText, color: "text-yellow-400" },
  file: { icon: File, color: "text-red-400" },
  image: { icon: ImageIcon, color: "text-orange-400" },
  url: { icon: Link, color: "text-sky-400" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ItemRow({ item }: { item: ItemCardData }) {
  const { openDrawer } = useItemDrawer();
  const router = useRouter();
  const [isFav, setIsFav] = useState(item.isFavorite);
  const [, startTransition] = useTransition();

  const typeKey = item.typeName.toLowerCase();
  const typeEntry = typeIconMap[typeKey];
  const Icon = typeEntry?.icon ?? File;
  const iconColor = typeEntry?.color ?? "text-muted-foreground";

  function handleToggleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    const next = !isFav;
    setIsFav(next);
    startTransition(async () => {
      const result = await toggleFavoriteItem(item.id);
      if (!result.success) {
        setIsFav(!next);
        toast.error("Failed to update favorite");
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div
      onClick={() => openDrawer(item.id)}
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
      <div className="flex shrink-0 items-center gap-1">
        {item.isPinned && (
          <Pin className="size-3 fill-sky-400 text-sky-400" aria-label="Pinned" />
        )}
        <button
          onClick={handleToggleFavorite}
          className="rounded p-1 text-muted-foreground transition-colors hover:text-amber-400"
          title={isFav ? "Unfavorite" : "Favorite"}
        >
          <Star className={`size-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`} />
        </button>
        <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
      </div>
    </div>
  );
}

"use client";

import { Code, Sparkles, Terminal, FileText, File, ImageIcon, Link, LucideIcon } from "lucide-react";
import { useItemDrawer } from "@/components/item-drawer";
import { FavoriteItem } from "@/lib/db/items";
import { formatShortDate } from "@/lib/utils";

const typeIconMap: Record<string, { icon: LucideIcon; color: string }> = {
  snippet: { icon: Code, color: "text-violet-400" },
  prompt: { icon: Sparkles, color: "text-blue-400" },
  command: { icon: Terminal, color: "text-emerald-400" },
  note: { icon: FileText, color: "text-yellow-400" },
  file: { icon: File, color: "text-red-400" },
  image: { icon: ImageIcon, color: "text-orange-400" },
  url: { icon: Link, color: "text-sky-400" },
};

export default function FavoriteItemRow({ item }: { item: FavoriteItem }) {
  const { openDrawer } = useItemDrawer();
  const typeKey = item.typeName.toLowerCase();
  const typeEntry = typeIconMap[typeKey];
  const Icon = typeEntry?.icon ?? File;
  const iconColor = typeEntry?.color ?? "text-muted-foreground";

  return (
    <button
      onClick={() => openDrawer(item.id)}
      className="flex w-full items-center gap-3 px-3 py-1.5 text-left hover:bg-muted/50 transition-colors rounded"
    >
      <Icon className={`size-3.5 shrink-0 ${iconColor}`} />
      <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
        {item.title}
      </span>
      <span
        className="shrink-0 rounded px-1.5 py-0.5 text-xs font-medium"
        style={{ backgroundColor: `${item.typeColor}20`, color: item.typeColor }}
      >
        {item.typeName.toLowerCase()}
      </span>
      <span className="w-16 shrink-0 text-right font-mono text-xs text-muted-foreground">
        {formatShortDate(item.updatedAt)}
      </span>
    </button>
  );
}

"use client";

import { useItemDrawer } from "@/components/item-drawer";
import { ItemCardData } from "@/lib/db/items";

interface ImageThumbnailCardProps {
  item: ItemCardData;
}

export default function ImageThumbnailCard({ item }: ImageThumbnailCardProps) {
  const { openDrawer } = useItemDrawer();

  return (
    <div
      onClick={() => openDrawer(item.id)}
      className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/view/${item.id}`}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="px-3 py-2">
        <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
        {item.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

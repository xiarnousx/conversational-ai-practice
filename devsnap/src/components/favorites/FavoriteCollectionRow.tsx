"use client";

import { useState, useTransition } from "react";
import { Folder, Star } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleFavoriteCollection } from "@/actions/collections";
import { FavoriteCollection } from "@/lib/db/collections";
import { formatShortDate } from "@/lib/utils";

export default function FavoriteCollectionRow({ collection }: { collection: FavoriteCollection }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [removed, setRemoved] = useState(false);

  function handleUnfavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setRemoved(true);
    startTransition(async () => {
      const result = await toggleFavoriteCollection(collection.id);
      if (!result.success || result.isFavorite) {
        setRemoved(false);
        toast.error("Failed to remove from favorites");
      } else {
        router.refresh();
      }
    });
  }

  if (removed) return null;

  return (
    <div className="flex w-full items-center gap-3 px-3 py-1.5 hover:bg-muted/50 transition-colors rounded">
      <NextLink
        href={`/collections/${collection.id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <Folder className="size-3.5 shrink-0 text-amber-400" />
        <span className="min-w-0 flex-1 truncate font-mono text-sm text-foreground">
          {collection.name}
        </span>
        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
        </span>
        <span className="w-16 shrink-0 text-right font-mono text-xs text-muted-foreground">
          {formatShortDate(collection.updatedAt)}
        </span>
      </NextLink>
      <button
        onClick={handleUnfavorite}
        className="shrink-0 rounded p-1 text-amber-400 transition-colors hover:text-muted-foreground"
        title="Remove from favorites"
      >
        <Star className="size-3.5 fill-amber-400" />
      </button>
    </div>
  );
}

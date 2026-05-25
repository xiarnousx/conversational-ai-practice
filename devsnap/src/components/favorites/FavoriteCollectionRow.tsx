import { Folder } from "lucide-react";
import NextLink from "next/link";
import { FavoriteCollection } from "@/lib/db/collections";
import { formatShortDate } from "@/lib/utils";

export default function FavoriteCollectionRow({ collection }: { collection: FavoriteCollection }) {
  return (
    <NextLink
      href={`/collections/${collection.id}`}
      className="flex w-full items-center gap-3 px-3 py-1.5 hover:bg-muted/50 transition-colors rounded"
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
  );
}

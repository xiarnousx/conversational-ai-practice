import NextLink from "next/link";
import type { CollectionCardData } from "@/lib/db/collections";
import { CollectionCard } from "@/components/collection-card/CollectionCard";

interface CollectionsGridProps {
  collections: CollectionCardData[];
}

export default function CollectionsGrid({ collections }: CollectionsGridProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Collections</h2>
        <NextLink
          href="/collections"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </NextLink>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <CollectionCard key={col.id} collection={col} />
        ))}
      </div>
    </section>
  );
}

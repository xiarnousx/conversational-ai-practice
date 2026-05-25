"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import FavoriteItemRow from "./FavoriteItemRow";
import FavoriteCollectionRow from "./FavoriteCollectionRow";
import type { FavoriteItem } from "@/lib/db/items";
import type { FavoriteCollection } from "@/lib/db/collections";

type ItemSort = "name" | "type" | "date";
type CollectionSort = "name" | "date";

function sortItems(items: FavoriteItem[], key: ItemSort): FavoriteItem[] {
  return [...items].sort((a, b) => {
    if (key === "name") return a.title.localeCompare(b.title);
    if (key === "type") return a.typeName.localeCompare(b.typeName) || a.title.localeCompare(b.title);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function sortCollections(cols: FavoriteCollection[], key: CollectionSort): FavoriteCollection[] {
  return [...cols].sort((a, b) => {
    if (key === "name") return a.name.localeCompare(b.name);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

interface SortPillsProps<T extends string> {
  options: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}

function SortPills<T extends string>({ options, active, onChange }: SortPillsProps<T>) {
  return (
    <div className="flex items-center gap-1">
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "rounded px-2 py-0.5 font-mono text-xs transition-colors",
            active === key
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

interface Props {
  items: FavoriteItem[];
  collections: FavoriteCollection[];
}

const ITEM_SORTS: { key: ItemSort; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
];

const COLLECTION_SORTS: { key: CollectionSort; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "name", label: "Name" },
];

export default function FavoritesSortedList({ items, collections }: Props) {
  const [itemSort, setItemSort] = useState<ItemSort>("date");
  const [collectionSort, setCollectionSort] = useState<CollectionSort>("date");

  const sortedItems = sortItems(items, itemSort);
  const sortedCollections = sortCollections(collections, collectionSort);

  return (
    <div className="flex flex-col gap-6">
      {items.length > 0 && (
        <section>
          <div className="mb-1 flex items-center gap-2 px-3 pb-1 border-b border-border">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Items
            </span>
            <span className="font-mono text-xs text-muted-foreground">{items.length}</span>
            <div className="ml-auto">
              <SortPills options={ITEM_SORTS} active={itemSort} onChange={setItemSort} />
            </div>
          </div>
          <div className="flex flex-col">
            {sortedItems.map((item) => (
              <FavoriteItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {collections.length > 0 && (
        <section>
          <div className="mb-1 flex items-center gap-2 px-3 pb-1 border-b border-border">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Collections
            </span>
            <span className="font-mono text-xs text-muted-foreground">{collections.length}</span>
            <div className="ml-auto">
              <SortPills options={COLLECTION_SORTS} active={collectionSort} onChange={setCollectionSort} />
            </div>
          </div>
          <div className="flex flex-col">
            {sortedCollections.map((col) => (
              <FavoriteCollectionRow key={col.id} collection={col} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

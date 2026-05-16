"use client";

import { useRouter } from "next/navigation";
import { Layers } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { useItemDrawer } from "@/components/item-drawer";
import type { SearchItem } from "@/lib/db/items";
import type { SearchCollection } from "@/lib/db/collections";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchItems: SearchItem[];
  searchCollections: SearchCollection[];
}

export function CommandPalette({ open, onOpenChange, searchItems, searchCollections }: CommandPaletteProps) {
  const { openDrawer } = useItemDrawer();
  const router = useRouter();

  function handleSelectItem(id: string) {
    onOpenChange(false);
    openDrawer(id);
  }

  function handleSelectCollection(id: string) {
    onOpenChange(false);
    router.push(`/collections/${id}`);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Search items and collections"
    >
      <Command>
      <CommandInput placeholder="Search items and collections..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {searchItems.length > 0 && (
          <CommandGroup heading="Items">
            {searchItems.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => handleSelectItem(item.id)}
              >
                <span
                  className="flex h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: item.typeColor }}
                />
                <span className="truncate">{item.title}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {item.typeName}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchItems.length > 0 && searchCollections.length > 0 && (
          <CommandSeparator />
        )}

        {searchCollections.length > 0 && (
          <CommandGroup heading="Collections">
            {searchCollections.map((col) => (
              <CommandItem
                key={col.id}
                value={col.name}
                onSelect={() => handleSelectCollection(col.id)}
              >
                <Layers className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{col.name}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {col.itemCount} {col.itemCount === 1 ? "item" : "items"}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
      </Command>
    </CommandDialog>
  );
}

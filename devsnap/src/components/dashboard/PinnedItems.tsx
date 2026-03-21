import { ItemCardData } from "@/lib/db/items";
import ItemRow from "./ItemRow";

interface PinnedItemsProps {
  items: ItemCardData[];
}

export default function PinnedItems({ items }: PinnedItemsProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 font-semibold text-foreground">Pinned</h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

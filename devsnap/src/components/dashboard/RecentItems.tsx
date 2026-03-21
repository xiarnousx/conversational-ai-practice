import { ItemCardData } from "@/lib/db/items";
import ItemRow from "./ItemRow";

interface RecentItemsProps {
  items: ItemCardData[];
}

export default function RecentItems({ items }: RecentItemsProps) {
  return (
    <section>
      <h2 className="mb-3 font-semibold text-foreground">Recent Items</h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

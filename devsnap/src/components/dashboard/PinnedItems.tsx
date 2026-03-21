import ItemRow from "./ItemRow";

interface Item {
  id: string;
  title: string;
  description: string;
  typeName: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
}

interface PinnedItemsProps {
  items: Item[];
}

export default function PinnedItems({ items }: PinnedItemsProps) {
  const pinned = items.filter((i) => i.isPinned);

  if (pinned.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 font-semibold text-foreground">Pinned</h2>
      <div className="flex flex-col gap-2">
        {pinned.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

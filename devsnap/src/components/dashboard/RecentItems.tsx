import ItemRow from "./ItemRow";

interface Item {
  id: string;
  title: string;
  description: string;
  typeName: string;
  tags: string[];
  createdAt: string;
}

interface RecentItemsProps {
  items: Item[];
}

export default function RecentItems({ items }: RecentItemsProps) {
  const recent = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <section>
      <h2 className="mb-3 font-semibold text-foreground">Recent Items</h2>
      <div className="flex flex-col gap-2">
        {recent.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

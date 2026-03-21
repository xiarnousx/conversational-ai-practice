import { Package, FolderOpen, Star, BookMarked } from "lucide-react";

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
}

interface StatsCardsProps {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export default function StatsCards({
  totalItems,
  totalCollections,
  favoriteItems,
  favoriteCollections,
}: StatsCardsProps) {
  const cards: StatCard[] = [
    {
      label: "Total Items",
      value: totalItems,
      icon: <Package className="size-4 text-violet-400" />,
    },
    {
      label: "Collections",
      value: totalCollections,
      icon: <FolderOpen className="size-4 text-blue-400" />,
    },
    {
      label: "Favorite Items",
      value: favoriteItems,
      icon: <Star className="size-4 text-yellow-400" />,
    },
    {
      label: "Favorite Collections",
      value: favoriteCollections,
      icon: <BookMarked className="size-4 text-emerald-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            {card.icon}
            <span className="text-xs text-muted-foreground">{card.label}</span>
          </div>
          <p className="text-2xl font-semibold text-foreground">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

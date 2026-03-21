import { mockCollections, mockItems, mockTypeCounts } from "@/lib/mock-data";
import StatsCards from "@/components/dashboard/StatsCards";
import CollectionsGrid from "@/components/dashboard/CollectionsGrid";
import PinnedItems from "@/components/dashboard/PinnedItems";
import RecentItems from "@/components/dashboard/RecentItems";

export default function DashboardPage() {
  const totalItems = Object.values(mockTypeCounts).reduce((a, b) => a + b, 0);
  const totalCollections = mockCollections.length;
  const favoriteItems = mockItems.filter((i) => i.isFavorite).length;
  const favoriteCollections = mockCollections.filter((c) => c.isFavorite).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your developer knowledge hub</p>
      </div>

      <StatsCards
        totalItems={totalItems}
        totalCollections={totalCollections}
        favoriteItems={favoriteItems}
        favoriteCollections={favoriteCollections}
      />

      <CollectionsGrid collections={mockCollections} />

      <PinnedItems items={mockItems} />

      <RecentItems items={mockItems} />
    </div>
  );
}

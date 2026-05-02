import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCollectionsForUser } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems } from "@/lib/db/items";
import StatsCards from "@/components/dashboard/StatsCards";
import CollectionsGrid from "@/components/dashboard/CollectionsGrid";
import PinnedItems from "@/components/dashboard/PinnedItems";
import RecentItems from "@/components/dashboard/RecentItems";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const user = { id: session.user.id };

  const [totalItems, totalCollections, favoriteItems, favoriteCollections, collectionsData, pinnedItems, recentItems] =
    await Promise.all([
      prisma.item.count({ where: { userId: user.id } }),
      prisma.collection.count({ where: { userId: user.id } }),
      prisma.item.count({ where: { userId: user.id, isFavorite: true } }),
      prisma.collection.count({ where: { userId: user.id, isFavorite: true } }),
      getCollectionsForUser(user.id),
      getPinnedItems(user.id),
      getRecentItems(user.id),
    ]);

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

      <CollectionsGrid collections={collectionsData} />

      <PinnedItems items={pinnedItems} />

      <RecentItems items={recentItems} />
    </div>
  );
}

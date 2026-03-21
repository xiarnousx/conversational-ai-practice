import { prisma } from "@/lib/prisma";
import StatsCards from "@/components/dashboard/StatsCards";
import CollectionsGrid from "@/components/dashboard/CollectionsGrid";
import PinnedItems from "@/components/dashboard/PinnedItems";
import RecentItems from "@/components/dashboard/RecentItems";

export default async function DashboardPage() {
  // Temporary: use the demo user until auth is wired up
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: "demo@devstash.io" },
    select: { id: true },
  });

  const [totalItems, totalCollections, favoriteItems, favoriteCollections, collections, pinnedItems, recentItems] =
    await Promise.all([
      prisma.item.count({ where: { userId: user.id } }),
      prisma.collection.count({ where: { userId: user.id } }),
      prisma.item.count({ where: { userId: user.id, isFavorite: true } }),
      prisma.collection.count({ where: { userId: user.id, isFavorite: true } }),
      prisma.collection.findMany({
        where: { userId: user.id },
        include: { items: { include: { type: { select: { name: true } } } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.item.findMany({
        where: { userId: user.id, isPinned: true },
        include: {
          type: { select: { name: true } },
          tags: { include: { tag: { select: { name: true } } } },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.item.findMany({
        where: { userId: user.id },
        include: {
          type: { select: { name: true } },
          tags: { include: { tag: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  const collectionsData = collections.map((col) => ({
    id: col.id,
    name: col.name,
    description: col.description ?? "",
    itemCount: col.items.length,
    isFavorite: col.isFavorite,
    icons: [...new Set(col.items.map((item) => item.type.name))].slice(0, 4),
  }));

  const mapItem = (item: (typeof pinnedItems)[number]) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    typeName: item.type.name,
    tags: item.tags.map((t) => t.tag.name),
    isPinned: item.isPinned,
    createdAt: item.createdAt.toISOString(),
  });

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

      <PinnedItems items={pinnedItems.map(mapItem)} />

      <RecentItems items={recentItems.map(mapItem)} />
    </div>
  );
}

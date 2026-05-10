import { cache } from "react";
import { prisma } from "@/lib/prisma";

export interface CollectionCardData {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  isFavorite: boolean;
  icons: string[];
  borderColor: string;
}

export interface SidebarCollection {
  id: string;
  name: string;
  itemCount: number;
  isFavorite: boolean;
  dominantColor: string;
}

// Single cached query — runs at most once per request per userId.
// Both getCollectionsForUser and getSidebarCollections consume this.
const fetchCollectionsWithTypes = cache(async (userId: string) => {
  return prisma.collection.findMany({
    where: { userId },
    include: {
      items: {
        take: 50,
        include: {
          type: { select: { name: true, color: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
});

function getDominantColor(
  items: { type: { name: string; color: string | null } }[]
): string {
  const typeCounts: Record<string, { count: number; color: string }> = {};
  for (const item of items) {
    const { name, color } = item.type;
    if (!typeCounts[name]) typeCounts[name] = { count: 0, color: color ?? "#6b7280" };
    typeCounts[name].count++;
  }
  return Object.values(typeCounts).sort((a, b) => b.count - a.count)[0]?.color ?? "#6b7280";
}

export async function getCollectionsForUser(userId: string): Promise<CollectionCardData[]> {
  const collections = await fetchCollectionsWithTypes(userId);
  return collections.map((col) => ({
    id: col.id,
    name: col.name,
    description: col.description ?? "",
    itemCount: col.items.length,
    isFavorite: col.isFavorite,
    icons: [...new Set(col.items.map((item) => item.type.name))].slice(0, 4),
    borderColor: getDominantColor(col.items),
  }));
}

export async function getSidebarCollections(userId: string): Promise<SidebarCollection[]> {
  const collections = await fetchCollectionsWithTypes(userId);
  return collections
    .slice()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map((col) => ({
      id: col.id,
      name: col.name,
      itemCount: col.items.length,
      isFavorite: col.isFavorite,
      dominantColor: getDominantColor(col.items),
    }));
}

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

export async function getCollectionsForUser(userId: string): Promise<CollectionCardData[]> {
  const collections = await prisma.collection.findMany({
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

  return collections.map((col) => {
    const typeCounts: Record<string, { count: number; color: string }> = {};

    for (const item of col.items) {
      const { name, color } = item.type;
      if (!typeCounts[name]) {
        typeCounts[name] = { count: 0, color: color ?? "#6b7280" };
      }
      typeCounts[name].count++;
    }

    const dominant = Object.values(typeCounts).sort((a, b) => b.count - a.count)[0];
    const borderColor = dominant?.color ?? "#6b7280";
    const icons = [...new Set(col.items.map((item) => item.type.name))].slice(0, 4);

    return {
      id: col.id,
      name: col.name,
      description: col.description ?? "",
      itemCount: col.items.length,
      isFavorite: col.isFavorite,
      icons,
      borderColor,
    };
  });
}

export interface SidebarCollection {
  id: string;
  name: string;
  itemCount: number;
  isFavorite: boolean;
  dominantColor: string;
}

export async function getSidebarCollections(userId: string): Promise<SidebarCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    include: {
      items: {
        take: 50,
        include: {
          type: { select: { name: true, color: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return collections.map((col) => {
    const typeCounts: Record<string, { count: number; color: string }> = {};
    for (const item of col.items) {
      const { name, color } = item.type;
      if (!typeCounts[name]) typeCounts[name] = { count: 0, color: color ?? "#6b7280" };
      typeCounts[name].count++;
    }
    const dominant = Object.values(typeCounts).sort((a, b) => b.count - a.count)[0];

    return {
      id: col.id,
      name: col.name,
      itemCount: col.items.length,
      isFavorite: col.isFavorite,
      dominantColor: dominant?.color ?? "#6b7280",
    };
  });
}

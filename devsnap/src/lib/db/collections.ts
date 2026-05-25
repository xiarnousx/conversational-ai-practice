import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { COLLECTIONS_PER_PAGE } from "@/lib/constants";

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
          item: {
            include: {
              type: { select: { name: true, color: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
});

type CollectionWithItems = Awaited<ReturnType<typeof fetchCollectionsWithTypes>>[number];

function getDominantColor(items: CollectionWithItems["items"]): string {
  const typeCounts: Record<string, { count: number; color: string }> = {};
  for (const ic of items) {
    const { name, color } = ic.item.type;
    if (!typeCounts[name]) typeCounts[name] = { count: 0, color: color ?? "#6b7280" };
    typeCounts[name].count++;
  }
  return Object.values(typeCounts).sort((a, b) => b.count - a.count)[0]?.color ?? "#6b7280";
}

export interface SearchCollection {
  id: string;
  name: string;
  itemCount: number;
}

export async function getCollectionsForSearch(userId: string): Promise<SearchCollection[]> {
  const collections = await fetchCollectionsWithTypes(userId);
  return collections.map((col) => ({
    id: col.id,
    name: col.name,
    itemCount: col.items.length,
  }));
}

export async function getCollectionsForUser(userId: string): Promise<CollectionCardData[]> {
  const collections = await fetchCollectionsWithTypes(userId);
  return collections.map((col) => ({
    id: col.id,
    name: col.name,
    description: col.description ?? "",
    itemCount: col.items.length,
    isFavorite: col.isFavorite,
    icons: [...new Set(col.items.map((ic) => ic.item.type.name))].slice(0, 4),
    borderColor: getDominantColor(col.items),
  }));
}

export async function getCollectionsForUserPaginated(
  userId: string,
  page: number
): Promise<{ collections: CollectionCardData[]; total: number }> {
  const skip = (page - 1) * COLLECTIONS_PER_PAGE;
  const [rawCollections, total] = await Promise.all([
    prisma.collection.findMany({
      where: { userId },
      include: {
        items: {
          take: 50,
          include: {
            item: {
              include: { type: { select: { name: true, color: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: COLLECTIONS_PER_PAGE,
    }),
    prisma.collection.count({ where: { userId } }),
  ]);
  return {
    collections: rawCollections.map((col) => ({
      id: col.id,
      name: col.name,
      description: col.description ?? "",
      itemCount: col.items.length,
      isFavorite: col.isFavorite,
      icons: [...new Set(col.items.map((ic) => ic.item.type.name))].slice(0, 4),
      borderColor: getDominantColor(col.items),
    })),
    total,
  };
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

export interface FavoriteCollection {
  id: string;
  name: string;
  itemCount: number;
  updatedAt: string;
}

export async function getFavoriteCollections(userId: string): Promise<FavoriteCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { userId, isFavorite: true },
    include: { _count: { select: { items: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return collections.map((col) => ({
    id: col.id,
    name: col.name,
    itemCount: col._count.items,
    updatedAt: col.updatedAt.toISOString(),
  }));
}

export async function getCollectionById(
  userId: string,
  collectionId: string
): Promise<CollectionCardData | null> {
  const collection = await prisma.collection.findFirst({
    where: { id: collectionId, userId },
    include: {
      items: {
        take: 50,
        include: {
          item: {
            include: { type: { select: { name: true, color: true } } },
          },
        },
      },
    },
  });
  if (!collection) return null;
  return {
    id: collection.id,
    name: collection.name,
    description: collection.description ?? "",
    itemCount: collection.items.length,
    isFavorite: collection.isFavorite,
    icons: [...new Set(collection.items.map((ic) => ic.item.type.name))].slice(0, 4),
    borderColor: getDominantColor(collection.items),
  };
}

export async function updateCollectionInDb(
  userId: string,
  collectionId: string,
  data: { name: string; description?: string | null }
): Promise<CollectionCardData | null> {
  try {
    const collection = await prisma.collection.update({
      where: { id: collectionId, userId },
      data: {
        name: data.name,
        description: data.description ?? null,
      },
      include: {
        items: {
          take: 50,
          include: {
            item: {
              include: { type: { select: { name: true, color: true } } },
            },
          },
        },
      },
    });
    return {
      id: collection.id,
      name: collection.name,
      description: collection.description ?? "",
      itemCount: collection.items.length,
      isFavorite: collection.isFavorite,
      icons: [...new Set(collection.items.map((ic) => ic.item.type.name))].slice(0, 4),
      borderColor: getDominantColor(collection.items),
    };
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2025") return null;
    throw e;
  }
}

export async function deleteCollectionInDb(
  userId: string,
  collectionId: string
): Promise<void> {
  await prisma.collection.deleteMany({
    where: { id: collectionId, userId },
  });
}

export async function createCollectionInDb(
  userId: string,
  data: { name: string; description?: string | null }
): Promise<CollectionCardData> {
  const collection = await prisma.collection.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      userId,
    },
  });

  return {
    id: collection.id,
    name: collection.name,
    description: collection.description ?? "",
    itemCount: 0,
    isFavorite: collection.isFavorite,
    icons: [],
    borderColor: "#6b7280",
  };
}

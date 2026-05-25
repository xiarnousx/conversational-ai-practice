import { prisma } from "@/lib/prisma";
import { ITEMS_PER_PAGE, COLLECTIONS_PER_PAGE, DASHBOARD_RECENT_ITEMS_LIMIT } from "@/lib/constants";

export interface ItemCardData {
  id: string;
  title: string;
  description: string;
  typeName: string;
  typeColor: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: string;
  fileName: string | null;
  fileSize: number | null;
  fileUrl: string | null;
}

type ItemWithRelations = Awaited<ReturnType<typeof fetchItems>>[number];

async function fetchItems(userId: string, options: { pinnedOnly?: boolean; take?: number }) {
  return prisma.item.findMany({
    where: {
      userId,
      ...(options.pinnedOnly ? { isPinned: true } : {}),
    },
    include: {
      type: { select: { name: true, color: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
    orderBy: options.pinnedOnly ? { updatedAt: "desc" } : { createdAt: "desc" },
    ...(options.take ? { take: options.take } : {}),
  });
}

function toCardData(item: ItemWithRelations): ItemCardData {
  return {
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    typeName: item.type.name,
    typeColor: item.type.color ?? "#6b7280",
    tags: item.tags.map((t) => t.tag.name),
    isPinned: item.isPinned,
    isFavorite: item.isFavorite,
    createdAt: item.createdAt.toISOString(),
    fileName: item.fileName,
    fileSize: item.fileSize,
    fileUrl: item.fileUrl,
  };
}

export interface PaginatedItems {
  items: ItemCardData[];
  total: number;
}

export async function getItemsByType(userId: string, typeName: string, page = 1): Promise<PaginatedItems> {
  const where = { userId, type: { name: { equals: typeName, mode: "insensitive" as const } } };
  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      include: {
        type: { select: { name: true, color: true } },
        tags: { include: { tag: { select: { name: true } } } },
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.item.count({ where }),
  ]);
  return { items: items.map(toCardData), total };
}

export async function getItemsByCollectionId(
  userId: string,
  collectionId: string,
  page = 1
): Promise<PaginatedItems> {
  const where = { userId, collections: { some: { collectionId } } };
  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      include: {
        type: { select: { name: true, color: true } },
        tags: { include: { tag: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * COLLECTIONS_PER_PAGE,
      take: COLLECTIONS_PER_PAGE,
    }),
    prisma.item.count({ where }),
  ]);
  return { items: items.map(toCardData), total };
}

export async function getPinnedItems(userId: string): Promise<ItemCardData[]> {
  const items = await fetchItems(userId, { pinnedOnly: true });
  return items.map(toCardData);
}

export async function getRecentItems(userId: string): Promise<ItemCardData[]> {
  const items = await fetchItems(userId, { take: DASHBOARD_RECENT_ITEMS_LIMIT });
  return items.map(toCardData);
}

export interface ItemDetail {
  id: string
  title: string
  description: string | null
  content: string | null
  language: string | null
  url: string | null
  fileUrl: string | null
  fileName: string | null
  fileSize: number | null
  typeName: string
  typeColor: string
  tags: string[]
  collections: { id: string; name: string }[]
  isFavorite: boolean
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export async function getItemById(userId: string, itemId: string): Promise<ItemDetail | null> {
  const item = await prisma.item.findFirst({
    where: { id: itemId, userId },
    include: {
      type: { select: { name: true, color: true } },
      tags: { include: { tag: { select: { name: true } } } },
      collections: { include: { collection: { select: { id: true, name: true } } } },
    },
  })
  if (!item) return null
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    content: item.content,
    language: item.language,
    url: item.url,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
    fileSize: item.fileSize,
    typeName: item.type.name,
    typeColor: item.type.color ?? "#6b7280",
    tags: item.tags.map((t) => t.tag.name),
    collections: item.collections.map((c) => ({ id: c.collection.id, name: c.collection.name })),
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

export interface UpdateItemData {
  title: string
  description?: string | null
  content?: string | null
  language?: string | null
  url?: string | null
  tags: string[]
  collectionIds: string[]
}

export async function updateItem(
  userId: string,
  itemId: string,
  data: UpdateItemData
): Promise<ItemDetail | null> {
  let updated
  try {
    updated = await prisma.item.update({
      where: { id: itemId, userId },
      data: {
        title: data.title,
        description: data.description ?? null,
        content: data.content ?? null,
        language: data.language ?? null,
        url: data.url ?? null,
        tags: {
          deleteMany: {},
          create: data.tags.map((name) => ({
            tag: {
              connectOrCreate: {
                where: { userId_name: { name, userId } },
                create: { name, userId },
              },
            },
          })),
        },
        collections: {
          deleteMany: {},
          create: data.collectionIds.map((collectionId) => ({ collectionId })),
        },
      },
      include: {
        type: { select: { name: true, color: true } },
        tags: { include: { tag: { select: { name: true } } } },
        collections: { include: { collection: { select: { id: true, name: true } } } },
      },
    })
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === "P2025") return null
    throw e
  }

  return {
    id: updated.id,
    title: updated.title,
    description: updated.description,
    content: updated.content,
    language: updated.language,
    url: updated.url,
    fileUrl: updated.fileUrl,
    fileName: updated.fileName,
    fileSize: updated.fileSize,
    typeName: updated.type.name,
    typeColor: updated.type.color ?? "#6b7280",
    tags: updated.tags.map((t) => t.tag.name),
    collections: updated.collections.map((c) => ({ id: c.collection.id, name: c.collection.name })),
    isFavorite: updated.isFavorite,
    isPinned: updated.isPinned,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  }
}

export interface CreateItemData {
  title: string
  typeName: string
  description?: string | null
  content?: string | null
  language?: string | null
  url?: string | null
  fileUrl?: string | null
  fileName?: string | null
  fileSize?: number | null
  tags: string[]
  collectionIds: string[]
}

export async function createItemInDb(
  userId: string,
  data: CreateItemData
): Promise<ItemDetail | null> {
  const type = await prisma.itemType.findFirst({
    where: { name: { equals: data.typeName, mode: "insensitive" } },
  })
  if (!type) return null

  const item = await prisma.item.create({
    data: {
      title: data.title,
      contentType: data.fileUrl ? "file" : "text",
      description: data.description ?? null,
      content: data.content ?? null,
      language: data.language ?? null,
      url: data.url ?? null,
      fileUrl: data.fileUrl ?? null,
      fileName: data.fileName ?? null,
      fileSize: data.fileSize ?? null,
      userId,
      typeId: type.id,
      tags: {
        create: data.tags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: { userId_name: { name, userId } },
              create: { name, userId },
            },
          },
        })),
      },
      collections: {
        create: data.collectionIds.map((collectionId) => ({ collectionId })),
      },
    },
    include: {
      type: { select: { name: true, color: true } },
      tags: { include: { tag: { select: { name: true } } } },
      collections: { include: { collection: { select: { id: true, name: true } } } },
    },
  })

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    content: item.content,
    language: item.language,
    url: item.url,
    fileUrl: item.fileUrl,
    fileName: item.fileName,
    fileSize: item.fileSize,
    typeName: item.type.name,
    typeColor: item.type.color ?? "#6b7280",
    tags: item.tags.map((t) => t.tag.name),
    collections: item.collections.map((c) => ({ id: c.collection.id, name: c.collection.name })),
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

export async function deleteItemById(
  userId: string,
  itemId: string
): Promise<{ deleted: boolean; fileUrl: string | null }> {
  try {
    const deleted = await prisma.item.delete({ where: { id: itemId, userId } })
    return { deleted: true, fileUrl: deleted.fileUrl }
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === "P2025") return { deleted: false, fileUrl: null }
    throw e
  }
}

export interface SidebarItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount: number;
}

export interface SearchItem {
  id: string;
  title: string;
  typeName: string;
  typeColor: string;
  typeIcon: string;
}

export async function getItemsForSearch(userId: string): Promise<SearchItem[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      type: { select: { name: true, color: true, icon: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    typeName: item.type.name,
    typeColor: item.type.color ?? "#6b7280",
    typeIcon: item.type.icon ?? "file",
  }));
}

export interface FavoriteItem {
  id: string;
  title: string;
  typeName: string;
  typeColor: string;
  updatedAt: string;
}

export async function getFavoriteItems(userId: string): Promise<FavoriteItem[]> {
  const items = await prisma.item.findMany({
    where: { userId, isFavorite: true },
    select: {
      id: true,
      title: true,
      type: { select: { name: true, color: true } },
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    typeName: item.type.name,
    typeColor: item.type.color ?? "#6b7280",
    updatedAt: item.updatedAt.toISOString(),
  }));
}

export async function toggleItemFavorite(
  userId: string,
  itemId: string
): Promise<boolean | null> {
  const item = await prisma.item.findFirst({
    where: { id: itemId, userId },
    select: { isFavorite: true },
  });
  if (!item) return null;
  const updated = await prisma.item.update({
    where: { id: itemId, userId },
    data: { isFavorite: !item.isFavorite },
    select: { isFavorite: true },
  });
  return updated.isFavorite;
}

export async function toggleItemPin(
  userId: string,
  itemId: string
): Promise<boolean | null> {
  const item = await prisma.item.findFirst({
    where: { id: itemId, userId },
    select: { isPinned: true },
  });
  if (!item) return null;
  const updated = await prisma.item.update({
    where: { id: itemId, userId },
    data: { isPinned: !item.isPinned },
    select: { isPinned: true },
  });
  return updated.isPinned;
}

export async function getSystemItemTypes(userId: string): Promise<SidebarItemType[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    include: {
      _count: { select: { items: { where: { userId } } } },
    },
    orderBy: { name: "asc" },
  });

  return types.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon ?? "file",
    color: t.color ?? "#6b7280",
    itemCount: t._count.items,
  }));
}

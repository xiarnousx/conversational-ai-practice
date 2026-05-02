import { prisma } from "@/lib/prisma";

export interface ItemCardData {
  id: string;
  title: string;
  description: string;
  typeName: string;
  typeColor: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
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
    createdAt: item.createdAt.toISOString(),
  };
}

export async function getItemsByType(userId: string, typeName: string): Promise<ItemCardData[]> {
  const items = await prisma.item.findMany({
    where: {
      userId,
      type: { name: { equals: typeName, mode: "insensitive" } },
    },
    include: {
      type: { select: { name: true, color: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return items.map(toCardData);
}

export async function getPinnedItems(userId: string): Promise<ItemCardData[]> {
  const items = await fetchItems(userId, { pinnedOnly: true });
  return items.map(toCardData);
}

export async function getRecentItems(userId: string): Promise<ItemCardData[]> {
  const items = await fetchItems(userId, { take: 10 });
  return items.map(toCardData);
}

export interface ItemDetail {
  id: string
  title: string
  description: string | null
  content: string | null
  language: string | null
  url: string | null
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
      collection: { select: { id: true, name: true } },
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
    typeName: item.type.name,
    typeColor: item.type.color ?? "#6b7280",
    tags: item.tags.map((t) => t.tag.name),
    collections: item.collection ? [{ id: item.collection.id, name: item.collection.name }] : [],
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
}

export async function updateItem(
  userId: string,
  itemId: string,
  data: UpdateItemData
): Promise<ItemDetail | null> {
  const existing = await prisma.item.findFirst({ where: { id: itemId, userId } })
  if (!existing) return null

  const updated = await prisma.item.update({
    where: { id: itemId },
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
    },
    include: {
      type: { select: { name: true, color: true } },
      tags: { include: { tag: { select: { name: true } } } },
      collection: { select: { id: true, name: true } },
    },
  })

  return {
    id: updated.id,
    title: updated.title,
    description: updated.description,
    content: updated.content,
    language: updated.language,
    url: updated.url,
    typeName: updated.type.name,
    typeColor: updated.type.color ?? "#6b7280",
    tags: updated.tags.map((t) => t.tag.name),
    collections: updated.collection
      ? [{ id: updated.collection.id, name: updated.collection.name }]
      : [],
    isFavorite: updated.isFavorite,
    isPinned: updated.isPinned,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  }
}

export interface SidebarItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount: number;
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

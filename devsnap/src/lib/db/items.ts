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

export async function getPinnedItems(userId: string): Promise<ItemCardData[]> {
  const items = await fetchItems(userId, { pinnedOnly: true });
  return items.map(toCardData);
}

export async function getRecentItems(userId: string): Promise<ItemCardData[]> {
  const items = await fetchItems(userId, { take: 10 });
  return items.map(toCardData);
}

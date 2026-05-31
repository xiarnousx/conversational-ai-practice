import { prisma } from "@/lib/prisma"

export const FREE_ITEM_LIMIT = 50
export const FREE_COLLECTION_LIMIT = 3

export interface UserLimits {
  isPro: boolean
  itemCount: number
  collectionCount: number
  atItemLimit: boolean
  atCollectionLimit: boolean
}

export async function getUserLimits(userId: string): Promise<UserLimits> {
  const [user, itemCount, collectionCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { isPro: true } }),
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
  ])

  const isPro = user?.isPro ?? false

  return {
    isPro,
    itemCount,
    collectionCount,
    atItemLimit: !isPro && itemCount >= FREE_ITEM_LIMIT,
    atCollectionLimit: !isPro && collectionCount >= FREE_COLLECTION_LIMIT,
  }
}

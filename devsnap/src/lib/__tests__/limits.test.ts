import { describe, it, expect, vi, beforeEach } from "vitest"
import { getUserLimits, FREE_ITEM_LIMIT, FREE_COLLECTION_LIMIT } from "@/lib/db/limits"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    item: { count: vi.fn() },
    collection: { count: vi.fn() },
  },
}))

import { prisma } from "@/lib/prisma"

const mockUser = prisma.user.findUnique as ReturnType<typeof vi.fn>
const mockItemCount = prisma.item.count as ReturnType<typeof vi.fn>
const mockCollectionCount = prisma.collection.count as ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
})

describe("getUserLimits", () => {
  describe("free user", () => {
    beforeEach(() => {
      mockUser.mockResolvedValue({ isPro: false })
    })

    it("returns correct fields for a free user under limits", async () => {
      mockItemCount.mockResolvedValue(10)
      mockCollectionCount.mockResolvedValue(1)

      const result = await getUserLimits("user-1")

      expect(result).toEqual({
        isPro: false,
        itemCount: 10,
        collectionCount: 1,
        atItemLimit: false,
        atCollectionLimit: false,
      })
    })

    it("is not at item limit when count is 49", async () => {
      mockItemCount.mockResolvedValue(49)
      mockCollectionCount.mockResolvedValue(1)

      const result = await getUserLimits("user-1")
      expect(result.atItemLimit).toBe(false)
    })

    it("is at item limit when count is exactly 50", async () => {
      mockItemCount.mockResolvedValue(50)
      mockCollectionCount.mockResolvedValue(1)

      const result = await getUserLimits("user-1")
      expect(result.atItemLimit).toBe(true)
    })

    it("is at item limit when count exceeds 50", async () => {
      mockItemCount.mockResolvedValue(51)
      mockCollectionCount.mockResolvedValue(1)

      const result = await getUserLimits("user-1")
      expect(result.atItemLimit).toBe(true)
    })

    it("is not at collection limit when count is 2", async () => {
      mockItemCount.mockResolvedValue(0)
      mockCollectionCount.mockResolvedValue(2)

      const result = await getUserLimits("user-1")
      expect(result.atCollectionLimit).toBe(false)
    })

    it("is at collection limit when count is exactly 3", async () => {
      mockItemCount.mockResolvedValue(0)
      mockCollectionCount.mockResolvedValue(3)

      const result = await getUserLimits("user-1")
      expect(result.atCollectionLimit).toBe(true)
    })

    it("is at collection limit when count exceeds 3", async () => {
      mockItemCount.mockResolvedValue(0)
      mockCollectionCount.mockResolvedValue(4)

      const result = await getUserLimits("user-1")
      expect(result.atCollectionLimit).toBe(true)
    })
  })

  describe("Pro user", () => {
    beforeEach(() => {
      mockUser.mockResolvedValue({ isPro: true })
    })

    it("never hits item limit regardless of count", async () => {
      mockItemCount.mockResolvedValue(1000)
      mockCollectionCount.mockResolvedValue(0)

      const result = await getUserLimits("user-2")
      expect(result.isPro).toBe(true)
      expect(result.atItemLimit).toBe(false)
    })

    it("never hits collection limit regardless of count", async () => {
      mockItemCount.mockResolvedValue(0)
      mockCollectionCount.mockResolvedValue(100)

      const result = await getUserLimits("user-2")
      expect(result.atCollectionLimit).toBe(false)
    })

    it("returns correct counts for Pro user", async () => {
      mockItemCount.mockResolvedValue(200)
      mockCollectionCount.mockResolvedValue(50)

      const result = await getUserLimits("user-2")
      expect(result).toEqual({
        isPro: true,
        itemCount: 200,
        collectionCount: 50,
        atItemLimit: false,
        atCollectionLimit: false,
      })
    })
  })

  describe("user not found", () => {
    it("defaults isPro to false when user is null", async () => {
      mockUser.mockResolvedValue(null)
      mockItemCount.mockResolvedValue(0)
      mockCollectionCount.mockResolvedValue(0)

      const result = await getUserLimits("ghost")
      expect(result.isPro).toBe(false)
      expect(result.atItemLimit).toBe(false)
      expect(result.atCollectionLimit).toBe(false)
    })
  })

  it("exports FREE_ITEM_LIMIT as 50", () => {
    expect(FREE_ITEM_LIMIT).toBe(50)
  })

  it("exports FREE_COLLECTION_LIMIT as 3", () => {
    expect(FREE_COLLECTION_LIMIT).toBe(3)
  })
})

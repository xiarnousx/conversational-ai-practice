import { describe, it, expect, vi, beforeEach } from "vitest"
import { getItemById } from "@/lib/db/items"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    item: {
      findFirst: vi.fn(),
    },
  },
}))

import { prisma } from "@/lib/prisma"

const mockFindFirst = vi.mocked(prisma.item.findFirst)

const BASE_ITEM = {
  id: "item-1",
  title: "useAuth Hook",
  description: "Custom auth hook",
  content: "export function useAuth() {}",
  language: "typescript",
  url: null,
  isFavorite: true,
  isPinned: false,
  createdAt: new Date("2024-01-15T00:00:00Z"),
  updatedAt: new Date("2024-01-15T00:00:00Z"),
  type: { name: "Snippet", color: "#8b5cf6" },
  tags: [{ tag: { name: "react" } }, { tag: { name: "auth" } }],
  collection: { id: "col-1", name: "React Patterns" },
}

describe("getItemById", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns null when item is not found", async () => {
    mockFindFirst.mockResolvedValue(null)
    const result = await getItemById("user-1", "missing-id")
    expect(result).toBeNull()
  })

  it("maps a found item to ItemDetail shape", async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never)
    const result = await getItemById("user-1", "item-1")

    expect(result).toMatchObject({
      id: "item-1",
      title: "useAuth Hook",
      description: "Custom auth hook",
      content: "export function useAuth() {}",
      language: "typescript",
      typeName: "Snippet",
      typeColor: "#8b5cf6",
      isFavorite: true,
      isPinned: false,
    })
  })

  it("converts tags to a flat string array", async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never)
    const result = await getItemById("user-1", "item-1")
    expect(result?.tags).toEqual(["react", "auth"])
  })

  it("wraps a single collection in an array", async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never)
    const result = await getItemById("user-1", "item-1")
    expect(result?.collections).toEqual([{ id: "col-1", name: "React Patterns" }])
  })

  it("returns empty collections array when item has no collection", async () => {
    mockFindFirst.mockResolvedValue({ ...BASE_ITEM, collection: null } as never)
    const result = await getItemById("user-1", "item-1")
    expect(result?.collections).toEqual([])
  })

  it("falls back to default typeColor when color is null", async () => {
    mockFindFirst.mockResolvedValue({
      ...BASE_ITEM,
      type: { name: "Note", color: null },
    } as never)
    const result = await getItemById("user-1", "item-1")
    expect(result?.typeColor).toBe("#6b7280")
  })

  it("serializes dates to ISO strings", async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never)
    const result = await getItemById("user-1", "item-1")
    expect(result?.createdAt).toBe("2024-01-15T00:00:00.000Z")
    expect(result?.updatedAt).toBe("2024-01-15T00:00:00.000Z")
  })

  it("queries with the correct userId and itemId", async () => {
    mockFindFirst.mockResolvedValue(null)
    await getItemById("user-42", "item-99")
    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "item-99", userId: "user-42" },
      })
    )
  })
})

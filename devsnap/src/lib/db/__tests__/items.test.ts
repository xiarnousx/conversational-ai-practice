import { describe, it, expect, vi, beforeEach } from "vitest"
import { getItemById, updateItem } from "@/lib/db/items"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    item: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}))

import { prisma } from "@/lib/prisma"

const mockFindFirst = vi.mocked(prisma.item.findFirst)
const mockUpdate = vi.mocked(prisma.item.update)

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

// ─── updateItem ──────────────────────────────────────────────────────────────

const UPDATED_ITEM = {
  id: "item-1",
  title: "Updated Title",
  description: "Updated desc",
  content: "new content",
  language: "python",
  url: null,
  isFavorite: false,
  isPinned: true,
  createdAt: new Date("2024-01-15T00:00:00Z"),
  updatedAt: new Date("2024-06-01T00:00:00Z"),
  type: { name: "Snippet", color: "#8b5cf6" },
  tags: [{ tag: { name: "python" } }, { tag: { name: "files" } }],
  collection: null,
}

describe("updateItem", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns null when item does not belong to user", async () => {
    mockFindFirst.mockResolvedValue(null)
    const result = await updateItem("user-1", "item-99", { title: "X", tags: [] })
    expect(result).toBeNull()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it("calls prisma.item.update and returns ItemDetail on success", async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never)
    mockUpdate.mockResolvedValue(UPDATED_ITEM as never)

    const result = await updateItem("user-1", "item-1", {
      title: "Updated Title",
      description: "Updated desc",
      content: "new content",
      language: "python",
      url: null,
      tags: ["python", "files"],
    })

    expect(result).not.toBeNull()
    expect(result?.title).toBe("Updated Title")
    expect(result?.tags).toEqual(["python", "files"])
    expect(result?.isPinned).toBe(true)
  })

  it("maps updated item to ItemDetail shape with correct dates", async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never)
    mockUpdate.mockResolvedValue(UPDATED_ITEM as never)

    const result = await updateItem("user-1", "item-1", { title: "t", tags: [] })
    expect(result?.createdAt).toBe("2024-01-15T00:00:00.000Z")
    expect(result?.updatedAt).toBe("2024-06-01T00:00:00.000Z")
  })

  it("returns empty collections array when updated item has no collection", async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never)
    mockUpdate.mockResolvedValue({ ...UPDATED_ITEM, collection: null } as never)

    const result = await updateItem("user-1", "item-1", { title: "t", tags: [] })
    expect(result?.collections).toEqual([])
  })

  it("falls back to default typeColor when color is null", async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never)
    mockUpdate.mockResolvedValue({
      ...UPDATED_ITEM,
      type: { name: "Note", color: null },
    } as never)

    const result = await updateItem("user-1", "item-1", { title: "t", tags: [] })
    expect(result?.typeColor).toBe("#6b7280")
  })

  it("passes tags as disconnect-all + connect-or-create to prisma", async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never)
    mockUpdate.mockResolvedValue(UPDATED_ITEM as never)

    await updateItem("user-1", "item-1", { title: "t", tags: ["react"] })

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tags: expect.objectContaining({ deleteMany: {} }),
        }),
      })
    )
  })
})

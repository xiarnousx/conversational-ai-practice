import { describe, it, expect, vi, beforeEach } from "vitest"
import { getItemById, updateItem, createItemInDb, deleteItemById, getItemsByCollectionId, getItemsForSearch } from "@/lib/db/items"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    item: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    itemType: {
      findFirst: vi.fn(),
    },
  },
}))

import { prisma } from "@/lib/prisma"

const mockFindFirst = vi.mocked(prisma.item.findFirst)
const mockFindMany = vi.mocked(prisma.item.findMany)
const mockUpdate = vi.mocked(prisma.item.update)
const mockCreate = vi.mocked(prisma.item.create)
const mockDelete = vi.mocked(prisma.item.delete)
const mockTypeFindFirst = vi.mocked(prisma.itemType.findFirst)

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
  collections: [{ collection: { id: "col-1", name: "React Patterns" } }],
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

  it("maps collections from join table to id/name array", async () => {
    mockFindFirst.mockResolvedValue(BASE_ITEM as never)
    const result = await getItemById("user-1", "item-1")
    expect(result?.collections).toEqual([{ id: "col-1", name: "React Patterns" }])
  })

  it("returns empty collections array when item has no collections", async () => {
    mockFindFirst.mockResolvedValue({ ...BASE_ITEM, collections: [] } as never)
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
  collections: [],
}

describe("updateItem", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns null when item does not belong to user", async () => {
    mockUpdate.mockRejectedValue({ code: "P2025" })
    const result = await updateItem("user-1", "item-99", { title: "X", tags: [], collectionIds: [] })
    expect(result).toBeNull()
    expect(mockUpdate).toHaveBeenCalled()
  })

  it("calls prisma.item.update and returns ItemDetail on success", async () => {
    mockUpdate.mockResolvedValue(UPDATED_ITEM as never)

    const result = await updateItem("user-1", "item-1", {
      title: "Updated Title",
      description: "Updated desc",
      content: "new content",
      language: "python",
      url: null,
      tags: ["python", "files"],
      collectionIds: [],
    })

    expect(result).not.toBeNull()
    expect(result?.title).toBe("Updated Title")
    expect(result?.tags).toEqual(["python", "files"])
    expect(result?.isPinned).toBe(true)
  })

  it("maps updated item to ItemDetail shape with correct dates", async () => {
    mockUpdate.mockResolvedValue(UPDATED_ITEM as never)

    const result = await updateItem("user-1", "item-1", { title: "t", tags: [], collectionIds: [] })
    expect(result?.createdAt).toBe("2024-01-15T00:00:00.000Z")
    expect(result?.updatedAt).toBe("2024-06-01T00:00:00.000Z")
  })

  it("returns empty collections array when updated item has no collections", async () => {
    mockUpdate.mockResolvedValue({ ...UPDATED_ITEM, collections: [] } as never)

    const result = await updateItem("user-1", "item-1", { title: "t", tags: [], collectionIds: [] })
    expect(result?.collections).toEqual([])
  })

  it("maps collections from join table rows", async () => {
    mockUpdate.mockResolvedValue({
      ...UPDATED_ITEM,
      collections: [{ collection: { id: "col-1", name: "React Patterns" } }],
    } as never)

    const result = await updateItem("user-1", "item-1", { title: "t", tags: [], collectionIds: ["col-1"] })
    expect(result?.collections).toEqual([{ id: "col-1", name: "React Patterns" }])
  })

  it("falls back to default typeColor when color is null", async () => {
    mockUpdate.mockResolvedValue({
      ...UPDATED_ITEM,
      type: { name: "Note", color: null },
    } as never)

    const result = await updateItem("user-1", "item-1", { title: "t", tags: [], collectionIds: [] })
    expect(result?.typeColor).toBe("#6b7280")
  })

  it("passes tags as disconnect-all + connect-or-create to prisma", async () => {
    mockUpdate.mockResolvedValue(UPDATED_ITEM as never)

    await updateItem("user-1", "item-1", { title: "t", tags: ["react"], collectionIds: [] })

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tags: expect.objectContaining({ deleteMany: {} }),
        }),
      })
    )
  })

  it("passes collections as deleteMany + create to prisma", async () => {
    mockUpdate.mockResolvedValue(UPDATED_ITEM as never)

    await updateItem("user-1", "item-1", { title: "t", tags: [], collectionIds: ["col-1", "col-2"] })

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          collections: expect.objectContaining({ deleteMany: {} }),
        }),
      })
    )
  })
})

// ─── createItemInDb ───────────────────────────────────────────────────────────

const MOCK_TYPE = { id: "type-1", name: "Snippet", color: "#8b5cf6" }

const CREATED_ITEM = {
  id: "item-new",
  title: "New Snippet",
  description: "A new item",
  content: "const x = 1;",
  language: "typescript",
  url: null,
  isFavorite: false,
  isPinned: false,
  contentType: "text",
  createdAt: new Date("2024-06-01T00:00:00Z"),
  updatedAt: new Date("2024-06-01T00:00:00Z"),
  type: { name: "Snippet", color: "#8b5cf6" },
  tags: [{ tag: { name: "react" } }],
  collections: [],
}

describe("createItemInDb", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns null when the item type is not found", async () => {
    mockTypeFindFirst.mockResolvedValue(null)
    const result = await createItemInDb("user-1", {
      title: "X",
      typeName: "snippet",
      tags: [],
      collectionIds: [],
    })
    expect(result).toBeNull()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it("creates the item and returns ItemDetail on success", async () => {
    mockTypeFindFirst.mockResolvedValue(MOCK_TYPE as never)
    mockCreate.mockResolvedValue(CREATED_ITEM as never)

    const result = await createItemInDb("user-1", {
      title: "New Snippet",
      typeName: "snippet",
      description: "A new item",
      content: "const x = 1;",
      language: "typescript",
      tags: ["react"],
      collectionIds: [],
    })

    expect(result).not.toBeNull()
    expect(result?.title).toBe("New Snippet")
    expect(result?.typeName).toBe("Snippet")
    expect(result?.typeColor).toBe("#8b5cf6")
    expect(result?.tags).toEqual(["react"])
  })

  it("returns empty collections when item has no collections", async () => {
    mockTypeFindFirst.mockResolvedValue(MOCK_TYPE as never)
    mockCreate.mockResolvedValue({ ...CREATED_ITEM, collections: [] } as never)

    const result = await createItemInDb("user-1", { title: "X", typeName: "snippet", tags: [], collectionIds: [] })
    expect(result?.collections).toEqual([])
  })

  it("maps collections from join table rows", async () => {
    mockTypeFindFirst.mockResolvedValue(MOCK_TYPE as never)
    mockCreate.mockResolvedValue({
      ...CREATED_ITEM,
      collections: [{ collection: { id: "col-1", name: "React Patterns" } }],
    } as never)

    const result = await createItemInDb("user-1", { title: "X", typeName: "snippet", tags: [], collectionIds: ["col-1"] })
    expect(result?.collections).toEqual([{ id: "col-1", name: "React Patterns" }])
  })

  it("falls back to default typeColor when color is null", async () => {
    mockTypeFindFirst.mockResolvedValue(MOCK_TYPE as never)
    mockCreate.mockResolvedValue({
      ...CREATED_ITEM,
      type: { name: "Note", color: null },
    } as never)

    const result = await createItemInDb("user-1", { title: "X", typeName: "note", tags: [], collectionIds: [] })
    expect(result?.typeColor).toBe("#6b7280")
  })

  it("serializes dates to ISO strings", async () => {
    mockTypeFindFirst.mockResolvedValue(MOCK_TYPE as never)
    mockCreate.mockResolvedValue(CREATED_ITEM as never)

    const result = await createItemInDb("user-1", { title: "X", typeName: "snippet", tags: [], collectionIds: [] })
    expect(result?.createdAt).toBe("2024-06-01T00:00:00.000Z")
    expect(result?.updatedAt).toBe("2024-06-01T00:00:00.000Z")
  })

  it("passes typeId from the looked-up type to prisma.item.create", async () => {
    mockTypeFindFirst.mockResolvedValue(MOCK_TYPE as never)
    mockCreate.mockResolvedValue(CREATED_ITEM as never)

    await createItemInDb("user-1", { title: "X", typeName: "snippet", tags: [], collectionIds: [] })

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ typeId: "type-1", userId: "user-1" }),
      })
    )
  })

  it("sets contentType to 'file' when fileUrl is provided", async () => {
    mockTypeFindFirst.mockResolvedValue(MOCK_TYPE as never)
    mockCreate.mockResolvedValue({ ...CREATED_ITEM, contentType: "file" } as never)

    await createItemInDb("user-1", {
      title: "My PDF",
      typeName: "file",
      fileUrl: "https://bucket.s3.us-east-1.amazonaws.com/uploads/user-1/file.pdf",
      fileName: "file.pdf",
      fileSize: 2048,
      tags: [],
      collectionIds: [],
    })

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ contentType: "file" }),
      })
    )
  })

  it("sets contentType to 'text' when fileUrl is not provided", async () => {
    mockTypeFindFirst.mockResolvedValue(MOCK_TYPE as never)
    mockCreate.mockResolvedValue(CREATED_ITEM as never)

    await createItemInDb("user-1", { title: "X", typeName: "snippet", tags: [], collectionIds: [] })

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ contentType: "text" }),
      })
    )
  })

  it("passes fileUrl, fileName, fileSize to prisma.item.create", async () => {
    mockTypeFindFirst.mockResolvedValue(MOCK_TYPE as never)
    mockCreate.mockResolvedValue(CREATED_ITEM as never)

    await createItemInDb("user-1", {
      title: "My Image",
      typeName: "image",
      fileUrl: "https://bucket.s3.us-east-1.amazonaws.com/uploads/user-1/photo.png",
      fileName: "photo.png",
      fileSize: 102400,
      tags: [],
      collectionIds: [],
    })

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          fileUrl: "https://bucket.s3.us-east-1.amazonaws.com/uploads/user-1/photo.png",
          fileName: "photo.png",
          fileSize: 102400,
        }),
      })
    )
  })
})

// ─── deleteItemById ───────────────────────────────────────────────────────────

const DELETABLE_ITEM = {
  id: "item-1",
  userId: "user-1",
  fileUrl: null,
}

const DELETABLE_FILE_ITEM = {
  id: "item-2",
  userId: "user-1",
  fileUrl: "https://bucket.s3.us-east-1.amazonaws.com/uploads/user-1/file.pdf",
}

describe("deleteItemById", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns { deleted: false, fileUrl: null } when item is not found", async () => {
    mockDelete.mockRejectedValue({ code: "P2025" })
    const result = await deleteItemById("user-1", "missing-id")
    expect(result).toEqual({ deleted: false, fileUrl: null })
    expect(mockDelete).toHaveBeenCalled()
  })

  it("returns { deleted: true, fileUrl: null } when item has no file", async () => {
    mockDelete.mockResolvedValue(DELETABLE_ITEM as never)

    const result = await deleteItemById("user-1", "item-1")
    expect(result).toEqual({ deleted: true, fileUrl: null })
  })

  it("returns { deleted: true, fileUrl } when item has a file", async () => {
    mockDelete.mockResolvedValue(DELETABLE_FILE_ITEM as never)

    const result = await deleteItemById("user-1", "item-2")
    expect(result).toEqual({
      deleted: true,
      fileUrl: "https://bucket.s3.us-east-1.amazonaws.com/uploads/user-1/file.pdf",
    })
  })

  it("calls prisma.item.delete with the correct item id and userId", async () => {
    mockDelete.mockResolvedValue(DELETABLE_ITEM as never)

    await deleteItemById("user-1", "item-1")
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "item-1", userId: "user-1" } })
  })
})

describe("getItemsByCollectionId", () => {
  beforeEach(() => vi.clearAllMocks())

  const COLLECTION_ITEM = {
    ...BASE_ITEM,
    fileUrl: null,
    fileName: null,
    fileSize: null,
  }

  it("returns empty array when collection has no items", async () => {
    mockFindMany.mockResolvedValue([])
    const result = await getItemsByCollectionId("user-1", "col-1")
    expect(result).toEqual([])
  })

  it("maps items to ItemCardData shape", async () => {
    mockFindMany.mockResolvedValue([COLLECTION_ITEM] as never)
    const [item] = await getItemsByCollectionId("user-1", "col-1")

    expect(item).toMatchObject({
      id: "item-1",
      title: "useAuth Hook",
      description: "Custom auth hook",
      typeName: "Snippet",
      typeColor: "#8b5cf6",
      tags: ["react", "auth"],
      isPinned: false,
    })
  })

  it("queries with correct userId and collectionId filter", async () => {
    mockFindMany.mockResolvedValue([])
    await getItemsByCollectionId("user-1", "col-1")

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1", collections: { some: { collectionId: "col-1" } } },
      })
    )
  })

  it("returns multiple items", async () => {
    const second = { ...COLLECTION_ITEM, id: "item-2", title: "Second Item" }
    mockFindMany.mockResolvedValue([COLLECTION_ITEM, second] as never)
    const result = await getItemsByCollectionId("user-1", "col-1")
    expect(result).toHaveLength(2)
    expect(result[1].id).toBe("item-2")
  })

  it("falls back to #6b7280 when typeColor is null", async () => {
    mockFindMany.mockResolvedValue([
      { ...COLLECTION_ITEM, type: { name: "Note", color: null } },
    ] as never)
    const [item] = await getItemsByCollectionId("user-1", "col-1")
    expect(item.typeColor).toBe("#6b7280")
  })
})

// ─── getItemsForSearch ────────────────────────────────────────────────────────

describe("getItemsForSearch", () => {
  beforeEach(() => vi.clearAllMocks())

  const SEARCH_ITEM = {
    id: "item-1",
    title: "useAuth Hook",
    type: { name: "Snippet", color: "#8b5cf6", icon: "code" },
  }

  it("returns empty array when user has no items", async () => {
    mockFindMany.mockResolvedValue([])
    const result = await getItemsForSearch("user-1")
    expect(result).toEqual([])
  })

  it("maps items to SearchItem shape", async () => {
    mockFindMany.mockResolvedValue([SEARCH_ITEM] as never)
    const [item] = await getItemsForSearch("user-1")

    expect(item).toEqual({
      id: "item-1",
      title: "useAuth Hook",
      typeName: "Snippet",
      typeColor: "#8b5cf6",
      typeIcon: "code",
    })
  })

  it("falls back to #6b7280 when typeColor is null", async () => {
    mockFindMany.mockResolvedValue([
      { ...SEARCH_ITEM, type: { name: "Note", color: null, icon: "file-text" } },
    ] as never)
    const [item] = await getItemsForSearch("user-1")
    expect(item.typeColor).toBe("#6b7280")
  })

  it("falls back to 'file' when typeIcon is null", async () => {
    mockFindMany.mockResolvedValue([
      { ...SEARCH_ITEM, type: { name: "Snippet", color: "#8b5cf6", icon: null } },
    ] as never)
    const [item] = await getItemsForSearch("user-1")
    expect(item.typeIcon).toBe("file")
  })

  it("queries with the correct userId", async () => {
    mockFindMany.mockResolvedValue([])
    await getItemsForSearch("user-42")
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-42" } })
    )
  })

  it("returns multiple items", async () => {
    const second = { id: "item-2", title: "fetchData", type: { name: "Command", color: "#f97316", icon: "terminal" } }
    mockFindMany.mockResolvedValue([SEARCH_ITEM, second] as never)
    const result = await getItemsForSearch("user-1")
    expect(result).toHaveLength(2)
    expect(result[1].id).toBe("item-2")
  })
})

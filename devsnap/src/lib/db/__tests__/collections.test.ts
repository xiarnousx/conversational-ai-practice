import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getCollectionsForUser,
  getSidebarCollections,
  getCollectionById,
  updateCollectionInDb,
  deleteCollectionInDb,
  getCollectionsForSearch,
  getCollectionsForUserPaginated,
} from "@/lib/db/collections"

vi.mock("@/lib/prisma", () => ({
  prisma: {
    collection: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

import { prisma } from "@/lib/prisma"

const mockFindMany = vi.mocked(prisma.collection.findMany)
const mockFindFirst = vi.mocked(prisma.collection.findFirst)
const mockCount = vi.mocked(prisma.collection.count)
const mockUpdate = vi.mocked(prisma.collection.update)
const mockDeleteMany = vi.mocked(prisma.collection.deleteMany)

const SNIPPET_TYPE = { name: "Snippet", color: "#3b82f6" }
const PROMPT_TYPE = { name: "Prompt", color: "#8b5cf6" }
const NOTE_TYPE = { name: "Note", color: null }

function makeCollection(overrides: Record<string, unknown> = {}) {
  return {
    id: "col-1",
    name: "React Patterns",
    description: "Useful patterns",
    isFavorite: false,
    userId: "user-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-06-01"),
    items: [],
    ...overrides,
  }
}

function makeItemCollection(type: { name: string; color: string | null }) {
  return { item: { type } }
}

describe("getCollectionsForUser", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns empty array when user has no collections", async () => {
    mockFindMany.mockResolvedValue([])
    const result = await getCollectionsForUser("user-1")
    expect(result).toEqual([])
  })

  it("maps a collection with no items to correct shape", async () => {
    mockFindMany.mockResolvedValue([makeCollection()] as never)
    const [col] = await getCollectionsForUser("user-1")

    expect(col).toMatchObject({
      id: "col-1",
      name: "React Patterns",
      description: "Useful patterns",
      itemCount: 0,
      isFavorite: false,
      icons: [],
      borderColor: "#6b7280",
    })
  })

  it("sets itemCount from join table length", async () => {
    mockFindMany.mockResolvedValue([
      makeCollection({
        items: [
          makeItemCollection(SNIPPET_TYPE),
          makeItemCollection(SNIPPET_TYPE),
          makeItemCollection(PROMPT_TYPE),
        ],
      }),
    ] as never)

    const [col] = await getCollectionsForUser("user-1")
    expect(col.itemCount).toBe(3)
  })

  it("derives unique type icons from join table items", async () => {
    mockFindMany.mockResolvedValue([
      makeCollection({
        items: [
          makeItemCollection(SNIPPET_TYPE),
          makeItemCollection(SNIPPET_TYPE),
          makeItemCollection(PROMPT_TYPE),
        ],
      }),
    ] as never)

    const [col] = await getCollectionsForUser("user-1")
    expect(col.icons).toEqual(["Snippet", "Prompt"])
  })

  it("caps icons at 4 unique types", async () => {
    const types = [
      { name: "Snippet", color: "#3b82f6" },
      { name: "Prompt", color: "#8b5cf6" },
      { name: "Note", color: "#fde047" },
      { name: "Command", color: "#f97316" },
      { name: "Link", color: "#10b981" },
    ]
    mockFindMany.mockResolvedValue([
      makeCollection({ items: types.map(makeItemCollection) }),
    ] as never)

    const [col] = await getCollectionsForUser("user-1")
    expect(col.icons).toHaveLength(4)
  })

  it("sets borderColor to the dominant type color", async () => {
    mockFindMany.mockResolvedValue([
      makeCollection({
        items: [
          makeItemCollection(PROMPT_TYPE),
          makeItemCollection(SNIPPET_TYPE),
          makeItemCollection(PROMPT_TYPE),
        ],
      }),
    ] as never)

    const [col] = await getCollectionsForUser("user-1")
    expect(col.borderColor).toBe(PROMPT_TYPE.color)
  })

  it("falls back to #6b7280 when dominant type color is null", async () => {
    mockFindMany.mockResolvedValue([
      makeCollection({ items: [makeItemCollection(NOTE_TYPE)] }),
    ] as never)

    const [col] = await getCollectionsForUser("user-1")
    expect(col.borderColor).toBe("#6b7280")
  })

  it("returns empty description string when description is null", async () => {
    mockFindMany.mockResolvedValue([makeCollection({ description: null })] as never)
    const [col] = await getCollectionsForUser("user-1")
    expect(col.description).toBe("")
  })
})

describe("getSidebarCollections", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns empty array when user has no collections", async () => {
    mockFindMany.mockResolvedValue([])
    const result = await getSidebarCollections("user-1")
    expect(result).toEqual([])
  })

  it("maps a collection to SidebarCollection shape", async () => {
    mockFindMany.mockResolvedValue([
      makeCollection({
        items: [makeItemCollection(SNIPPET_TYPE)],
      }),
    ] as never)

    const [col] = await getSidebarCollections("user-1")
    expect(col).toMatchObject({
      id: "col-1",
      name: "React Patterns",
      itemCount: 1,
      isFavorite: false,
      dominantColor: SNIPPET_TYPE.color,
    })
  })

  it("sorts collections by updatedAt descending", async () => {
    const older = makeCollection({
      id: "col-old",
      name: "Old",
      updatedAt: new Date("2024-01-01"),
    })
    const newer = makeCollection({
      id: "col-new",
      name: "New",
      updatedAt: new Date("2024-06-01"),
    })
    mockFindMany.mockResolvedValue([older, newer] as never)

    const result = await getSidebarCollections("user-1")
    expect(result[0].id).toBe("col-new")
    expect(result[1].id).toBe("col-old")
  })

  it("sets dominantColor to #6b7280 for empty collection", async () => {
    mockFindMany.mockResolvedValue([makeCollection()] as never)
    const [col] = await getSidebarCollections("user-1")
    expect(col.dominantColor).toBe("#6b7280")
  })
})

describe("getCollectionById", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns null when collection is not found", async () => {
    mockFindFirst.mockResolvedValue(null)
    const result = await getCollectionById("user-1", "missing-id")
    expect(result).toBeNull()
  })

  it("maps a found collection to CollectionCardData shape", async () => {
    mockFindFirst.mockResolvedValue(
      makeCollection({ items: [makeItemCollection(SNIPPET_TYPE)] }) as never
    )
    const result = await getCollectionById("user-1", "col-1")

    expect(result).toMatchObject({
      id: "col-1",
      name: "React Patterns",
      description: "Useful patterns",
      itemCount: 1,
      isFavorite: false,
      icons: ["Snippet"],
      borderColor: SNIPPET_TYPE.color,
    })
  })

  it("returns null description as empty string", async () => {
    mockFindFirst.mockResolvedValue(makeCollection({ description: null }) as never)
    const result = await getCollectionById("user-1", "col-1")
    expect(result?.description).toBe("")
  })

  it("returns borderColor #6b7280 for empty collection", async () => {
    mockFindFirst.mockResolvedValue(makeCollection() as never)
    const result = await getCollectionById("user-1", "col-1")
    expect(result?.borderColor).toBe("#6b7280")
  })

  it("derives borderColor from dominant type", async () => {
    mockFindFirst.mockResolvedValue(
      makeCollection({
        items: [
          makeItemCollection(PROMPT_TYPE),
          makeItemCollection(PROMPT_TYPE),
          makeItemCollection(SNIPPET_TYPE),
        ],
      }) as never
    )
    const result = await getCollectionById("user-1", "col-1")
    expect(result?.borderColor).toBe(PROMPT_TYPE.color)
  })

  it("caps icons at 4 unique types", async () => {
    const types = [
      { name: "Snippet", color: "#3b82f6" },
      { name: "Prompt", color: "#8b5cf6" },
      { name: "Note", color: "#fde047" },
      { name: "Command", color: "#f97316" },
      { name: "Link", color: "#10b981" },
    ]
    mockFindFirst.mockResolvedValue(
      makeCollection({ items: types.map(makeItemCollection) }) as never
    )
    const result = await getCollectionById("user-1", "col-1")
    expect(result?.icons).toHaveLength(4)
  })
})

describe("updateCollectionInDb", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns mapped CollectionCardData on success", async () => {
    mockUpdate.mockResolvedValue(
      makeCollection({
        name: "Updated Name",
        description: "Updated desc",
        items: [makeItemCollection(SNIPPET_TYPE)],
      }) as never
    )

    const result = await updateCollectionInDb("user-1", "col-1", {
      name: "Updated Name",
      description: "Updated desc",
    })

    expect(result).toMatchObject({
      id: "col-1",
      name: "Updated Name",
      description: "Updated desc",
      itemCount: 1,
      isFavorite: false,
    })
  })

  it("returns null when collection is not found (P2025)", async () => {
    mockUpdate.mockRejectedValue({ code: "P2025" })
    const result = await updateCollectionInDb("user-1", "missing-id", { name: "X" })
    expect(result).toBeNull()
  })

  it("rethrows unexpected errors", async () => {
    const err = new Error("DB connection lost")
    mockUpdate.mockRejectedValue(err)
    await expect(updateCollectionInDb("user-1", "col-1", { name: "X" })).rejects.toThrow(
      "DB connection lost"
    )
  })

  it("coerces null description to empty string in returned data", async () => {
    mockUpdate.mockResolvedValue(makeCollection({ description: null }) as never)
    const result = await updateCollectionInDb("user-1", "col-1", { name: "X" })
    expect(result?.description).toBe("")
  })
})

describe("deleteCollectionInDb", () => {
  beforeEach(() => vi.clearAllMocks())

  it("calls deleteMany with correct userId and collectionId", async () => {
    mockDeleteMany.mockResolvedValue({ count: 1 })
    await deleteCollectionInDb("user-1", "col-1")
    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: { id: "col-1", userId: "user-1" },
    })
  })

  it("resolves without error when collection does not exist", async () => {
    mockDeleteMany.mockResolvedValue({ count: 0 })
    await expect(deleteCollectionInDb("user-1", "missing-id")).resolves.toBeUndefined()
  })
})

// ─── getCollectionsForSearch ──────────────────────────────────────────────────

describe("getCollectionsForSearch", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns empty array when user has no collections", async () => {
    mockFindMany.mockResolvedValue([])
    const result = await getCollectionsForSearch("user-1")
    expect(result).toEqual([])
  })

  it("maps collections to SearchCollection shape", async () => {
    mockFindMany.mockResolvedValue([
      makeCollection({ items: [makeItemCollection(SNIPPET_TYPE), makeItemCollection(PROMPT_TYPE)] }),
    ] as never)

    const [col] = await getCollectionsForSearch("user-1")
    expect(col).toEqual({ id: "col-1", name: "React Patterns", itemCount: 2 })
  })

  it("sets itemCount to 0 for empty collection", async () => {
    mockFindMany.mockResolvedValue([makeCollection()] as never)
    const [col] = await getCollectionsForSearch("user-1")
    expect(col.itemCount).toBe(0)
  })

  it("returns multiple collections", async () => {
    const second = makeCollection({ id: "col-2", name: "Python Scripts", items: [makeItemCollection(SNIPPET_TYPE)] })
    mockFindMany.mockResolvedValue([makeCollection(), second] as never)
    const result = await getCollectionsForSearch("user-1")
    expect(result).toHaveLength(2)
    expect(result[1].id).toBe("col-2")
  })
})

// ─── getCollectionsForUserPaginated ──────────────────────────────────────────

describe("getCollectionsForUserPaginated", () => {
  beforeEach(() => vi.clearAllMocks())

  it("returns empty collections and total 0 when user has no collections", async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)
    const result = await getCollectionsForUserPaginated("user-1", 1)
    expect(result).toEqual({ collections: [], total: 0 })
  })

  it("maps a collection to CollectionCardData shape", async () => {
    mockFindMany.mockResolvedValue([makeCollection({ items: [makeItemCollection(SNIPPET_TYPE)] })] as never)
    mockCount.mockResolvedValue(1)
    const { collections } = await getCollectionsForUserPaginated("user-1", 1)
    expect(collections[0]).toMatchObject({
      id: "col-1",
      name: "React Patterns",
      description: "Useful patterns",
      itemCount: 1,
      isFavorite: false,
    })
  })

  it("returns correct total from count query", async () => {
    mockFindMany.mockResolvedValue([makeCollection()] as never)
    mockCount.mockResolvedValue(15)
    const { total } = await getCollectionsForUserPaginated("user-1", 1)
    expect(total).toBe(15)
  })

  it("uses skip and take for pagination on page 2", async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(10)
    await getCollectionsForUserPaginated("user-1", 2)
    const call = mockFindMany.mock.calls[0][0] as { skip: number; take: number }
    expect(call.skip).toBeGreaterThan(0)
    expect(call.take).toBeGreaterThan(0)
  })

  it("uses skip 0 on page 1", async () => {
    mockFindMany.mockResolvedValue([])
    mockCount.mockResolvedValue(0)
    await getCollectionsForUserPaginated("user-1", 1)
    const call = mockFindMany.mock.calls[0][0] as { skip: number }
    expect(call.skip).toBe(0)
  })

  it("derives borderColor from dominant item type", async () => {
    mockFindMany.mockResolvedValue([
      makeCollection({ items: [makeItemCollection(SNIPPET_TYPE), makeItemCollection(SNIPPET_TYPE), makeItemCollection(PROMPT_TYPE)] }),
    ] as never)
    mockCount.mockResolvedValue(1)
    const { collections } = await getCollectionsForUserPaginated("user-1", 1)
    expect(collections[0].borderColor).toBe(SNIPPET_TYPE.color)
  })

  it("falls back to #6b7280 when collection has no items", async () => {
    mockFindMany.mockResolvedValue([makeCollection()] as never)
    mockCount.mockResolvedValue(1)
    const { collections } = await getCollectionsForUserPaginated("user-1", 1)
    expect(collections[0].borderColor).toBe("#6b7280")
  })

  it("returns multiple collections", async () => {
    const second = makeCollection({ id: "col-2", name: "Python Scripts" })
    mockFindMany.mockResolvedValue([makeCollection(), second] as never)
    mockCount.mockResolvedValue(2)
    const { collections } = await getCollectionsForUserPaginated("user-1", 1)
    expect(collections).toHaveLength(2)
    expect(collections[1].id).toBe("col-2")
  })
})

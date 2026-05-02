import { describe, it, expect, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db/items", () => ({ updateItem: vi.fn() }));

import { updateItemSchema } from "@/actions/items";

describe("updateItemSchema", () => {
  it("accepts a minimal valid payload", () => {
    const result = updateItemSchema.safeParse({ title: "My item" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.tags).toEqual([]);
  });

  it("rejects an empty title", () => {
    const result = updateItemSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Title is required");
    }
  });

  it("rejects a whitespace-only title after trim", () => {
    const result = updateItemSchema.safeParse({ title: "   " });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from title", () => {
    const result = updateItemSchema.safeParse({ title: "  My item  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.title).toBe("My item");
  });

  it("accepts a valid URL", () => {
    const result = updateItemSchema.safeParse({
      title: "t",
      url: "https://example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid URL", () => {
    const result = updateItemSchema.safeParse({ title: "t", url: "not-a-url" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Must be a valid URL");
    }
  });

  it("accepts null for optional fields", () => {
    const result = updateItemSchema.safeParse({
      title: "t",
      description: null,
      content: null,
      language: null,
      url: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeNull();
      expect(result.data.url).toBeNull();
    }
  });

  it("filters empty strings out of tags array", () => {
    const result = updateItemSchema.safeParse({
      title: "t",
      tags: ["react", "", "typescript"],
    });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from tags", () => {
    const result = updateItemSchema.safeParse({
      title: "t",
      tags: ["  react  ", " typescript "],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.tags).toEqual(["react", "typescript"]);
  });

  it("defaults tags to empty array when omitted", () => {
    const result = updateItemSchema.safeParse({ title: "t" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.tags).toEqual([]);
  });
});

import { describe, it, expect } from "vitest";
import { createCollectionSchema } from "@/lib/validations/collections";

describe("createCollectionSchema", () => {
  it("accepts a minimal valid payload (name only)", () => {
    const result = createCollectionSchema.safeParse({ name: "My Collection" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("My Collection");
  });

  it("accepts a full valid payload with description", () => {
    const result = createCollectionSchema.safeParse({
      name: "React Patterns",
      description: "Useful React patterns and hooks",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("React Patterns");
      expect(result.data.description).toBe("Useful React patterns and hooks");
    }
  });

  it("accepts null description", () => {
    const result = createCollectionSchema.safeParse({
      name: "My Collection",
      description: null,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.description).toBeNull();
  });

  it("trims whitespace from name", () => {
    const result = createCollectionSchema.safeParse({ name: "  Snippets  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Snippets");
  });

  it("trims whitespace from description", () => {
    const result = createCollectionSchema.safeParse({
      name: "My Collection",
      description: "  some desc  ",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.description).toBe("some desc");
  });

  it("rejects an empty name", () => {
    const result = createCollectionSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is required");
    }
  });

  it("rejects a whitespace-only name after trim", () => {
    const result = createCollectionSchema.safeParse({ name: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is required");
    }
  });

  it("rejects a name longer than 100 characters", () => {
    const result = createCollectionSchema.safeParse({ name: "a".repeat(101) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Name is too long");
    }
  });

  it("accepts a name exactly 100 characters long", () => {
    const result = createCollectionSchema.safeParse({ name: "a".repeat(100) });
    expect(result.success).toBe(true);
  });

  it("rejects a description longer than 500 characters", () => {
    const result = createCollectionSchema.safeParse({
      name: "My Collection",
      description: "a".repeat(501),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Description is too long");
    }
  });

  it("accepts a description exactly 500 characters long", () => {
    const result = createCollectionSchema.safeParse({
      name: "My Collection",
      description: "a".repeat(500),
    });
    expect(result.success).toBe(true);
  });

  it("omitted description defaults to undefined (optional)", () => {
    const result = createCollectionSchema.safeParse({ name: "My Collection" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.description).toBeUndefined();
  });
});

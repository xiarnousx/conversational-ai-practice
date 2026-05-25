import { describe, it, expect } from "vitest"
import { cn, formatShortDate } from "@/lib/utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })

  it("ignores falsy values", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar")
  })

  it("returns empty string for no args", () => {
    expect(cn()).toBe("")
  })
})

describe("formatShortDate", () => {
  it("formats an ISO string as 'Mon DD'", () => {
    expect(formatShortDate("2024-06-01T00:00:00.000Z")).toBe("Jun 1")
  })

  it("formats a mid-year date correctly", () => {
    expect(formatShortDate("2024-01-15T00:00:00.000Z")).toBe("Jan 15")
  })
})

import { describe, it, expect, vi } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));

import { auth } from "@/auth";
import { requireUserId } from "@/lib/auth-guard";
import { fail } from "@/types/action-result";

describe("requireUserId", () => {
  it("returns ok: true with userId when session is valid", async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: "user-123" } } as never);

    const result = await requireUserId();
    expect(result).toEqual({ ok: true, userId: "user-123" });
  });

  it("returns ok: false when session is null", async () => {
    vi.mocked(auth).mockResolvedValueOnce(null);

    const result = await requireUserId();
    expect(result).toEqual({ ok: false, error: "Unauthorized" });
  });

  it("returns ok: false when user.id is missing", async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: {} } as never);

    const result = await requireUserId();
    expect(result).toEqual({ ok: false, error: "Unauthorized" });
  });

  it("returns ok: false when user is null", async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: null } as never);

    const result = await requireUserId();
    expect(result).toEqual({ ok: false, error: "Unauthorized" });
  });

  it("returns ok: false when session has no user property", async () => {
    vi.mocked(auth).mockResolvedValueOnce({} as never);

    const result = await requireUserId();
    expect(result).toEqual({ ok: false, error: "Unauthorized" });
  });
});

describe("fail", () => {
  it("returns a failure object with the given error message", () => {
    expect(fail("Something went wrong")).toEqual({
      success: false,
      error: "Something went wrong",
    });
  });

  it("always sets success to false", () => {
    expect(fail("any error").success).toBe(false);
  });

  it("preserves the exact error string", () => {
    const msg = "Free plan limit reached (50 items). Upgrade to Pro for unlimited items.";
    expect(fail(msg).error).toBe(msg);
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { getIp, rateLimitResponse } from "@/lib/rate-limit"

describe("getIp", () => {
  it("returns first IP from x-forwarded-for header", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    })
    expect(getIp(req)).toBe("1.2.3.4")
  })

  it("returns fallback IP when header is missing", () => {
    const req = new Request("http://localhost")
    expect(getIp(req)).toBe("127.0.0.1")
  })
})

describe("rateLimitResponse", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z")) // now = 0s unix offset
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns a 429 response", async () => {
    const reset = Math.floor(Date.now() / 1000) + 60 // 60s from now
    const res = rateLimitResponse(reset)
    expect(res.status).toBe(429)
  })

  it("sets Retry-After header", async () => {
    const reset = Math.floor(Date.now() / 1000) + 120
    const res = rateLimitResponse(reset)
    expect(Number(res.headers.get("Retry-After"))).toBe(120)
  })

  it("includes error message in body", async () => {
    const reset = Math.floor(Date.now() / 1000) + 60
    const res = rateLimitResponse(reset)
    const body = await res.json()
    expect(body.error).toMatch(/try again/i)
  })
})

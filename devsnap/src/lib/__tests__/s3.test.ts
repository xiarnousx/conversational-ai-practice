import { describe, it, expect, beforeAll, vi } from "vitest";

beforeAll(() => {
  vi.stubEnv("S3_BUCKET_NAME", "test-bucket");
  vi.stubEnv("S3_REGION", "us-east-1");
  vi.stubEnv("S3_ACCESS_KEY_ID", "test-key");
  vi.stubEnv("S3_SECRET_ACCESS_KEY", "test-secret");
});

const S3_PREFIX = "https://test-bucket.s3.us-east-1.amazonaws.com/";

describe("keyFromUrl", () => {
  it("strips the S3 bucket prefix and returns just the key", async () => {
    const { keyFromUrl } = await import("@/lib/s3");
    const key = keyFromUrl(`${S3_PREFIX}uploads/user-1/abc.png`);
    expect(key).toBe("uploads/user-1/abc.png");
  });

  it("returns the input unchanged when it does not start with the bucket prefix", async () => {
    const { keyFromUrl } = await import("@/lib/s3");
    const raw = "uploads/user-1/abc.png";
    expect(keyFromUrl(raw)).toBe(raw);
  });

  it("handles a key with nested path segments", async () => {
    const { keyFromUrl } = await import("@/lib/s3");
    const key = keyFromUrl(`${S3_PREFIX}uploads/user-1/2024/01/file.pdf`);
    expect(key).toBe("uploads/user-1/2024/01/file.pdf");
  });

  it("returns empty string when the URL is exactly the bucket prefix", async () => {
    const { keyFromUrl } = await import("@/lib/s3");
    expect(keyFromUrl(S3_PREFIX)).toBe("");
  });
});

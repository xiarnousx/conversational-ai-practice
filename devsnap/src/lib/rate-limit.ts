import Redis from "ioredis"

let redis: Redis | null = null

function getRedis(): Redis | null {
  if (redis) return redis

  const url = process.env.REDIS_URL
  if (!url) return null

  try {
    redis = new Redis(url, {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 0,
    })
    return redis
  } catch {
    return null
  }
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number // Unix timestamp (seconds)
}

interface RateLimitConfig {
  key: string
  limit: number
  windowSeconds: number
}

export async function rateLimit({
  key,
  limit,
  windowSeconds,
}: RateLimitConfig): Promise<RateLimitResult> {
  const client = getRedis()

  // Fail open if Redis is unavailable
  if (!client) return { success: true, remaining: limit, reset: 0 }

  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const windowStart = now - windowMs
  const resetAt = Math.ceil((now + windowMs) / 1000)
  const redisKey = `rl:${key}`

  try {
    const pipe = client.pipeline()
    // Sliding window: remove entries older than the window
    pipe.zremrangebyscore(redisKey, "-inf", windowStart.toString())
    // Add current request with timestamp as score
    pipe.zadd(redisKey, now.toString(), `${now}-${Math.random()}`)
    // Count requests in window
    pipe.zcard(redisKey)
    // Expire the key after window duration
    pipe.pexpire(redisKey, windowMs)

    const results = await pipe.exec()
    const count = (results?.[2]?.[1] as number) ?? 0

    const remaining = Math.max(0, limit - count)
    const success = count <= limit

    return { success, remaining, reset: resetAt }
  } catch {
    // Fail open on Redis errors
    return { success: true, remaining: limit, reset: 0 }
  }
}

export function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return "127.0.0.1"
}

export function rateLimitResponse(reset: number): Response {
  const retryAfter = Math.max(0, reset - Math.floor(Date.now() / 1000))
  const minutes = Math.ceil(retryAfter / 60)
  return new Response(
    JSON.stringify({
      error: `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": retryAfter.toString(),
      },
    }
  )
}

import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
  limit: number
}

export function rateLimit(options: Options) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  })

  return {
    check: async (token: string): Promise<{
      success: boolean
      limit: number
      remaining: number
      reset: number
    }> => {
      const now = Date.now()
      const interval = options.interval || 60000
      const limit = options.limit
      
      // Get token timestamps from cache or create a new empty array
      const tokenTimestamps: number[] = tokenCache.get(token) || []
      
      // Filter out timestamps older than the current interval
      const validTimestamps = tokenTimestamps.filter(
        (timestamp: number) => now - timestamp < interval
      )
      
      // Check if the number of valid timestamps is less than the limit
      const remaining = Math.max(0, limit - validTimestamps.length)
      const success = remaining > 0
      
      // Add the current timestamp and update the cache
      if (success) {
        validTimestamps.push(now)
        tokenCache.set(token, validTimestamps)
      }
      
      // Calculate reset time (when the oldest timestamp expires)
      const oldestTimestamp = validTimestamps.length > 0 ? validTimestamps[0] : now
      const reset = Math.ceil((oldestTimestamp + interval - now) / 1000)
      
      return {
        success,
        limit,
        remaining,
        reset,
      }
    },
  }
} 
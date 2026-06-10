interface CacheEntry {
  value: string | null
  expiry: number
}

const cache = new Map<string, CacheEntry>()
const MAX_CACHE_SIZE = 500
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in ms

export function clearCache(): void {
  cache.clear()
}

function getFromCache(key: string): string | null | undefined {
  const entry = cache.get(key)
  if (!entry) return undefined

  if (Date.now() > entry.expiry) {
    cache.delete(key)
    return undefined
  }

  // LRU Refresh: Move to end by re-inserting
  cache.delete(key)
  cache.set(key, entry)

  return entry.value
}

function setToCache(key: string, value: string | null): void {
  if (cache.has(key)) {
    cache.delete(key)
  } else if (cache.size >= MAX_CACHE_SIZE) {
    // Evict least recently used (first item)
    const oldestKey = cache.keys().next().value
    if (oldestKey !== undefined) {
      cache.delete(oldestKey)
    }
  }

  cache.set(key, {
    value,
    expiry: Date.now() + CACHE_TTL,
  })
}

function normalizePath(pathname: string): string {
  if (pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

export async function lookupRedirect(pathname: string, spoke: string | null): Promise<string | null> {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return null
  }
  const normalizedPath = normalizePath(pathname)
  const legacyUrl = spoke ? `/${spoke}${normalizedPath}` : normalizedPath

  // 1. Check in-memory cache
  const cachedValue = getFromCache(legacyUrl)
  if (cachedValue !== undefined) {
    return cachedValue
  }

  // 2. Query database using absolute and relative variations
  const host = spoke ? `${spoke}.sentradaya.com` : 'sentradaya.com'
  const variations = [
    legacyUrl,
    `http://${host}${normalizedPath}`,
    `https://${host}${normalizedPath}`,
  ]

  try {
    const { prisma } = await import('../db/prisma')
    const record = await prisma.redirectMap.findFirst({
      where: {
        OR: variations.map((url) => ({ legacyUrl: url })),
      },
    })

    if (record) {
      // Increment hitCount asynchronously without blocking response
      const updatePromise = prisma.redirectMap.update({
        where: { legacyUrl: record.legacyUrl },
        data: { hitCount: { increment: 1 } },
      })
      
      if (updatePromise && typeof updatePromise.catch === 'function') {
        updatePromise.catch((err) => {
          console.error('Failed to increment hitCount:', err)
        })
      }

      setToCache(legacyUrl, record.targetUrl)
      return record.targetUrl
    } else {
      // Cache misses (negative caching)
      setToCache(legacyUrl, null)
      return null
    }
  } catch (error) {
    console.error('Redirect lookup database query failed:', error)
    return null
  }
}

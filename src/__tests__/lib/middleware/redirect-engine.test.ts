import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals'
import { prisma } from '../../../lib/db/prisma'
import { lookupRedirect, clearCache } from '../../../lib/middleware/redirect-engine'

// Mock the Prisma client
jest.mock('../../../lib/db/prisma', () => ({
  prisma: {
    redirectMap: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}))

const mockFindFirst = prisma.redirectMap.findFirst as any
const mockFindUnique = prisma.redirectMap.findUnique as any
const mockUpdate = prisma.redirectMap.update as any

describe('Redirect Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearCache()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-06-04T09:00:00.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('lookupRedirect', () => {
    it('normalizes trailing slashes correctly', async () => {
      mockFindFirst.mockResolvedValue({
        legacyUrl: '/pju/test-path',
        targetUrl: '/products/test-path',
        spoke: 'pju',
        hitCount: 0,
      })

      // Path with trailing slash should match the normalized relative key
      const result = await lookupRedirect('/test-path/', 'pju')
      expect(result).toBe('/products/test-path')
      expect(mockFindFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ legacyUrl: '/pju/test-path' })
          ])
        })
      }))
    })

    it('keeps root slash unchanged', async () => {
      mockFindFirst.mockResolvedValue(null)
      const result = await lookupRedirect('/', null)
      expect(result).toBeNull()
    })

    it('returns targetUrl and increments hitCount asynchronously on match', async () => {
      mockFindFirst.mockResolvedValue({
        legacyUrl: '/about-legacy',
        targetUrl: '/about',
        spoke: 'hub',
        hitCount: 10,
      })

      const result = await lookupRedirect('/about-legacy', null)
      expect(result).toBe('/about')
      
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { legacyUrl: '/about-legacy' },
        data: { hitCount: { increment: 1 } },
      })
    })

    it('handles HTTP and HTTPS legacy URLs uniformly by querying variations', async () => {
      mockFindFirst.mockResolvedValue({
        legacyUrl: 'https://solarcell.sentradaya.com/panel-surya',
        targetUrl: '/products/solar-panel',
        spoke: 'solarcell',
        hitCount: 5,
      })

      const result = await lookupRedirect('/panel-surya', 'solarcell')
      expect(result).toBe('/products/solar-panel')

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { legacyUrl: '/solarcell/panel-surya' },
            { legacyUrl: 'http://solarcell.sentradaya.com/panel-surya' },
            { legacyUrl: 'https://solarcell.sentradaya.com/panel-surya' },
          ]
        }
      })
    })

    it('implements negative caching for missing redirect maps', async () => {
      mockFindFirst.mockResolvedValue(null)

      // First call: DB hit (miss)
      const firstResult = await lookupRedirect('/non-existent', null)
      expect(firstResult).toBeNull()
      expect(mockFindFirst).toHaveBeenCalledTimes(1)

      // Second call: Cache hit (should not query DB again)
      const secondResult = await lookupRedirect('/non-existent', null)
      expect(secondResult).toBeNull()
      expect(mockFindFirst).toHaveBeenCalledTimes(1)
    })

    it('caches redirect matches to avoid DB queries on subsequent requests', async () => {
      mockFindFirst.mockResolvedValue({
        legacyUrl: '/faq-old',
        targetUrl: '/faq',
        spoke: 'hub',
        hitCount: 2,
      })

      // First call: DB hit
      const firstResult = await lookupRedirect('/faq-old', null)
      expect(firstResult).toBe('/faq')
      expect(mockFindFirst).toHaveBeenCalledTimes(1)

      // Second call: Cache hit
      const secondResult = await lookupRedirect('/faq-old', null)
      expect(secondResult).toBe('/faq')
      expect(mockFindFirst).toHaveBeenCalledTimes(1)
    })

    it('expires cache entries after 5 minutes TTL', async () => {
      mockFindFirst.mockResolvedValue({
        legacyUrl: '/expired-path',
        targetUrl: '/new-path',
        spoke: 'hub',
        hitCount: 0,
      })

      // First call: DB hit
      await lookupRedirect('/expired-path', null)
      expect(mockFindFirst).toHaveBeenCalledTimes(1)

      // Fast forward 4 minutes (under 5m TTL) -> should hit cache
      jest.advanceTimersByTime(4 * 60 * 1000)
      await lookupRedirect('/expired-path', null)
      expect(mockFindFirst).toHaveBeenCalledTimes(1)

      // Fast forward another 2 minutes (total 6m) -> cache should expire, triggering a new DB lookup
      jest.advanceTimersByTime(2 * 60 * 1000)
      await lookupRedirect('/expired-path', null)
      expect(mockFindFirst).toHaveBeenCalledTimes(2)
    })

    it('evicts Least Recently Used entries when exceeding size limit of 500', async () => {
      // Seed first redirect entry
      mockFindFirst.mockResolvedValue({
        legacyUrl: '/item-0',
        targetUrl: '/target-0',
        spoke: 'hub',
        hitCount: 0,
      })
      await lookupRedirect('/item-0', null)

      // Fill cache to limit (total 500 entries)
      for (let i = 1; i < 500; i++) {
        mockFindFirst.mockResolvedValue({
          legacyUrl: `/item-${i}`,
          targetUrl: `/target-${i}`,
          spoke: 'hub',
          hitCount: 0,
        })
        await lookupRedirect(`/item-${i}`, null)
      }

      expect(mockFindFirst).toHaveBeenCalledTimes(500)
      mockFindFirst.mockClear()

      // Access item-0 to make it recently used
      await lookupRedirect('/item-0', null)
      expect(mockFindFirst).not.toHaveBeenCalled() // Loaded from cache

      // Add 501st entry, which should trigger eviction of item-1 (LRU)
      mockFindFirst.mockResolvedValue({
        legacyUrl: '/item-500',
        targetUrl: '/target-500',
        spoke: 'hub',
        hitCount: 0,
      })
      await lookupRedirect('/item-500', null)
      
      // Clear the mock call history to verify that item-0 retrieval does not query the DB
      mockFindFirst.mockClear()
      
      // Accessing item-0 (should still be in cache since it was refreshed)
      await lookupRedirect('/item-0', null)
      expect(mockFindFirst).not.toHaveBeenCalled()

      // Accessing item-1 (should have been evicted, triggering DB query)
      mockFindFirst.mockResolvedValue({
        legacyUrl: '/item-1',
        targetUrl: '/target-1',
        spoke: 'hub',
        hitCount: 0,
      })
      await lookupRedirect('/item-1', null)
      expect(mockFindFirst).toHaveBeenCalledTimes(1)
    })
  })
})

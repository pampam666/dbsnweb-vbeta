import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { NextRequest, NextResponse } from 'next/server'
import { isHubDomain } from '../config'

// Mock the redirect engine
jest.mock('../../../lib/middleware/redirect-engine', () => ({
  lookupRedirect: jest.fn(() => Promise.resolve(null)),
}))

describe('Hub Routing Tests', () => {
  const originalEnv = process.env
  let middleware: (request: NextRequest) => NextResponse | Promise<NextResponse>

  beforeEach(async () => {
    jest.resetModules()
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = 'sentradaya.com'
    const mwModule = await import('../../../middleware')
    middleware = mwModule.default
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('isHubDomain()', () => {
    it('should return true for dbsn-test01.vercel.app', () => {
      expect(isHubDomain('dbsn-test01.vercel.app')).toBe(true)
    })

    it('should return true for some-preview-abc123.vercel.app', () => {
      expect(isHubDomain('some-preview-abc123.vercel.app')).toBe(true)
    })
  })

  describe('middleware() - Hub Resolution', () => {
    it('should rewrite dbsn-test01.vercel.app/about to /(hub)/about', async () => {
      const req = new NextRequest('https://dbsn-test01.vercel.app/about', {
        headers: { host: 'dbsn-test01.vercel.app' },
      })
      const res = await middleware(req)
      expect(res).toBeDefined()
      const rewriteHeader = res.headers.get('x-middleware-rewrite')
      expect(rewriteHeader).toContain('/(hub)/about')
      expect(rewriteHeader).not.toContain('/404')
    })

    it('should rewrite dbsn-test01.vercel.app/products to /(hub)/products', async () => {
      const req = new NextRequest('https://dbsn-test01.vercel.app/products', {
        headers: { host: 'dbsn-test01.vercel.app' },
      })
      const res = await middleware(req)
      expect(res).toBeDefined()
      const rewriteHeader = res.headers.get('x-middleware-rewrite')
      expect(rewriteHeader).toContain('/(hub)/products')
      expect(rewriteHeader).not.toContain('/404')
    })

    it('should rewrite dbsn-test01.vercel.app/certifications to /(hub)/certifications', async () => {
      const req = new NextRequest('https://dbsn-test01.vercel.app/certifications', {
        headers: { host: 'dbsn-test01.vercel.app' },
      })
      const res = await middleware(req)
      expect(res).toBeDefined()
      const rewriteHeader = res.headers.get('x-middleware-rewrite')
      expect(rewriteHeader).toContain('/(hub)/certifications')
    })

    it('should rewrite dbsn-test01.vercel.app/portfolio/test-slug to /(hub)/portfolio/test-slug', async () => {
      const req = new NextRequest('https://dbsn-test01.vercel.app/portfolio/test-slug', {
        headers: { host: 'dbsn-test01.vercel.app' },
      })
      const res = await middleware(req)
      expect(res).toBeDefined()
      const rewriteHeader = res.headers.get('x-middleware-rewrite')
      expect(rewriteHeader).toContain('/(hub)/portfolio/test-slug')
    })

    it('should rewrite dbsn-test01.vercel.app/articles/test-article to /(hub)/articles/test-article', async () => {
      const req = new NextRequest('https://dbsn-test01.vercel.app/articles/test-article', {
        headers: { host: 'dbsn-test01.vercel.app' },
      })
      const res = await middleware(req)
      expect(res).toBeDefined()
      const rewriteHeader = res.headers.get('x-middleware-rewrite')
      expect(rewriteHeader).toContain('/(hub)/articles/test-article')
    })
  })

  describe('middleware() - Negative Tests', () => {
    it('should return 404 for spoke path on hub domain (dbsn-test01.vercel.app/pju)', async () => {
      const req = new NextRequest('https://dbsn-test01.vercel.app/pju', {
        headers: { host: 'dbsn-test01.vercel.app' },
      })
      const res = await middleware(req)
      expect(res).toBeDefined()
      const rewriteHeader = res.headers.get('x-middleware-rewrite')
      expect(rewriteHeader).toContain('/404')
    })

    it('should pass through (rewrite to /(hub)/nonexistent) and let Next.js handle 404 for nonexistent pages', async () => {
      const req = new NextRequest('https://dbsn-test01.vercel.app/nonexistent', {
        headers: { host: 'dbsn-test01.vercel.app' },
      })
      const res = await middleware(req)
      expect(res).toBeDefined()
      const rewriteHeader = res.headers.get('x-middleware-rewrite')
      expect(rewriteHeader).toContain('/(hub)/nonexistent')
    })
  })

  describe('middleware() - Regression Tests', () => {
    it('should rewrite dashboard requests correctly', async () => {
      const req = new NextRequest('https://dashboard.sentradaya.com/profile', {
        headers: {
          host: 'dashboard.sentradaya.com',
          cookie: 'next-auth.session-token=dummy-token-value',
        },
      })
      const res = await middleware(req)
      expect(res).toBeDefined()
      expect(res.headers.get('x-middleware-rewrite')).toContain('/dashboard/profile')
    })

    it('should rewrite spoke requests correctly', async () => {
      const req = new NextRequest('https://solarcell.sentradaya.com/products', {
        headers: { host: 'solarcell.sentradaya.com' },
      })
      const res = await middleware(req)
      expect(res).toBeDefined()
      expect(res.headers.get('x-middleware-rewrite')).toContain('/solarcell/products')
    })
  })
})

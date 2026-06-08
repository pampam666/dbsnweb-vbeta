import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { NextRequest } from 'next/server'

// Mock the redirect engine
jest.mock('../../../lib/middleware/redirect-engine', () => ({
  lookupRedirect: jest.fn(() => Promise.resolve(null)),
}))

describe('Hub Domain Explicit Routing (TDD)', () => {
  const originalEnv = process.env
  let middleware: any

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

  it('should rewrite hub domain to /(hub) group explicitly', async () => {
    const req = new NextRequest('http://sentradaya.com/about', {
      headers: { host: 'sentradaya.com' },
    })

    const res = await middleware(req)
    expect(res).toBeDefined()
    
    // Check if rewrite header contains /(hub)/about
    const rewriteHeader = res.headers.get('x-middleware-rewrite')
    expect(rewriteHeader).toContain('/(hub)/about')
    
    expect(res.headers.get('x-middleware-subdomain')).toBe('hub')
    expect(res.headers.get('x-middleware-matched-route')).toBe('/(hub)')
  })

  it('should short-circuit if the path is already rewritten to /(hub)', async () => {
    const req = new NextRequest('http://sentradaya.com/(hub)/about', {
      headers: { host: 'sentradaya.com' },
    })

    const res = await middleware(req)
    expect(res).toBeDefined()
    
    // Should NOT be a rewrite (no x-middleware-rewrite header if it's NextResponse.next())
    expect(res.headers.get('x-middleware-rewrite')).toBeNull()
    expect(res.headers.get('x-middleware-subdomain')).toBe('hub')
    expect(res.headers.get('x-middleware-matched-route')).toBe('/(hub)')
  })

  it('should maintain query parameters during Hub rewrite', async () => {
    const req = new NextRequest('http://sentradaya.com/products?category=solar', {
      headers: { host: 'sentradaya.com' },
    })

    const res = await middleware(req)
    const rewriteHeader = res.headers.get('x-middleware-rewrite')
    expect(rewriteHeader).toContain('/(hub)/products?category=solar')
  })
})

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getClientIp, createRateLimiter } from '@/lib/rate-limiter'

const limiter = createRateLimiter({
  interval: 60 * 1000,
  maxRequests: 30,
})

export const runtime = 'nodejs' // Use standard Node.js serverless runtime (not edge)

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  const rateLimitResult = limiter.check(ip)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, error: 'Too Many Requests' },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  try {
    const { searchParams } = request.nextUrl
    const pathname = searchParams.get('pathname')
    const spoke = searchParams.get('spoke') || null

    if (!pathname) {
      return NextResponse.json({ success: false, error: 'pathname is required' }, { status: 400 })
    }

    const normalizedPath = pathname === '/' ? '/' : (pathname.endsWith('/') ? pathname.slice(0, -1) : pathname)
    const legacyUrl = spoke ? `/${spoke}${normalizedPath}` : normalizedPath

    const host = spoke ? `${spoke}.dayaberkah.id` : 'dayaberkah.id'
    const variations = [
      legacyUrl,
      `http://${host}${normalizedPath}`,
      `https://${host}${normalizedPath}`,
    ]

    const record = await prisma.redirectMap.findFirst({
      where: {
        OR: variations.map((url) => ({ legacyUrl: url })),
      },
    })

    if (record) {
      // Increment hitCount asynchronously without blocking response
      prisma.redirectMap.update({
        where: { legacyUrl: record.legacyUrl },
        data: { hitCount: { increment: 1 } },
      }).catch((err) => {
        console.error('Failed to increment hitCount in lookup route:', err)
      })

      return NextResponse.json({ success: true, targetUrl: record.targetUrl })
    }

    return NextResponse.json({ success: true, targetUrl: null })
  } catch (error) {
    console.error('GET /api/redirects/lookup failed:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

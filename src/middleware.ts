import { NextRequest, NextResponse } from 'next/server'
import {
  cleanHostname,
  isHubDomain,
  isDashboardDomain,
  isSpokeDomain,
  SPOKE_SUBDOMAINS,
} from './lib/middleware/config'
import { lookupRedirect } from './lib/middleware/redirect-engine'
import { getToken } from 'next-auth/jwt'

/**
 * DBSN Subdomain Middleware Routing.
 * Maps hostnames to their corresponding Next.js Route Groups.
 * - dayaberkah.id / www.dayaberkah.id -> /(hub) (next.js transparent group)
 * - dashboard.dayaberkah.id -> /dashboard
 * - [spoke].dayaberkah.id -> /[spoke] (maps to /(spokes)/[spoke] internally)
 * 
 * Runs on the V8 Edge Runtime.
 */
export default async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const hostname = request.headers.get('host')

  // 1. Short-circuit for API, _next static files, and files with extensions
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const cleanHost = cleanHostname(hostname)
  const spoke = isSpokeDomain(cleanHost)

  // Look up redirection mapping from legacy URLs
  const redirectTarget = await lookupRedirect(pathname, spoke, request.nextUrl.origin)
  if (redirectTarget) {
    const redirectUrl = new URL(redirectTarget + search, request.url)
    return NextResponse.redirect(redirectUrl, 301)
  }

  const isDash = isDashboardDomain(cleanHost)

  // 2. Short-circuit for already rewritten paths (to prevent infinite loops)
  // Secure against direct access to /dashboard paths
  if (pathname.startsWith('/dashboard') && isDash) {
    const isPublicRoute =
      pathname === '/dashboard/login' ||
      pathname === '/dashboard/lupa-kata-sandi' ||
      pathname === '/dashboard/konfirmasi-reset'

    if (!isPublicRoute) {
      let token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET })
      if (!token && process.env.NODE_ENV === 'development' && request.cookies.get('next-auth.session-token')?.value === 'mock-e2e-admin-token') {
        token = {
          email: 'admin@dbsn.co.id',
          name: 'System Admin',
          role: 'ADMIN',
          isActive: true,
        } as any
      }
      if (!token) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
      }
    }

    const response = NextResponse.next()
    response.headers.set('x-middleware-subdomain', 'dashboard')
    response.headers.set('x-middleware-matched-route', '/dashboard')
    return response
  }

  if (
    pathname.startsWith('/(hub)') ||
    pathname.startsWith('/404') ||
    (spoke && pathname.startsWith(`/${spoke}`))
  ) {
    const response = NextResponse.next()
    if (pathname.startsWith('/(hub)')) {
      response.headers.set('x-middleware-subdomain', 'hub')
      response.headers.set('x-middleware-matched-route', '/(hub)')
    } else if (spoke) {
      response.headers.set('x-middleware-subdomain', spoke)
      response.headers.set('x-middleware-matched-route', `/(spokes)/${spoke}`)
    }
    return response
  }

  // 3. Hub Domain Routing
  if (isHubDomain(cleanHost)) {
    // If requesting a spoke path directly on the Hub domain, return 404
    if (SPOKE_SUBDOMAINS.some(spoke => pathname.startsWith(`/${spoke}`))) {
      return new NextResponse(null, { status: 404 })
    }

    console.log(`[Middleware] Hub domain detected: ${pathname}`)
    const response = NextResponse.next()
    response.headers.set('x-middleware-subdomain', 'hub')
    response.headers.set('x-middleware-matched-route', '/(hub)')
    return response
  }

  // 4. Dashboard Domain Routing
  if (isDashboardDomain(cleanHost)) {
    const isPublicRoute =
      pathname === '/login' ||
      pathname === '/lupa-kata-sandi' ||
      pathname === '/konfirmasi-reset'

    if (!isPublicRoute) {
      let token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET })
      if (!token && process.env.NODE_ENV === 'development' && request.cookies.get('next-auth.session-token')?.value === 'mock-e2e-admin-token') {
        token = {
          email: 'admin@dbsn.co.id',
          name: 'System Admin',
          role: 'ADMIN',
          isActive: true,
        } as any
      }
      if (!token) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
      }
    }

    const url = new URL(`/dashboard${pathname}${search}`, request.url)
    const response = NextResponse.rewrite(url)
    response.headers.set('x-middleware-subdomain', 'dashboard')
    response.headers.set('x-middleware-matched-route', '/dashboard')
    return response
  }

  // 5. Spoke Domain Routing
  if (spoke) {
    const url = new URL(`/${spoke}${pathname}${search}`, request.url)
    const response = NextResponse.rewrite(url)
    response.headers.set('x-middleware-subdomain', spoke)
    response.headers.set('x-middleware-matched-route', `/(spokes)/${spoke}`)
    return response
  }

  // 6. Fallback: unknown domains return 404
  return new NextResponse(null, { status: 404 })
}

// Limit the middleware to run only on page requests (exclude static assets, api, etc.)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}


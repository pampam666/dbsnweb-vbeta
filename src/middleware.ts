import { NextRequest, NextResponse } from 'next/server'
import {
  cleanHostname,
  isHubDomain,
  isDashboardDomain,
  isSpokeDomain,
  SPOKE_SUBDOMAINS,
} from './lib/middleware/config'
import { lookupRedirect } from './lib/middleware/redirect-engine'

/**
 * DBSN Subdomain Middleware Routing.
 * Maps hostnames to their corresponding Next.js Route Groups.
 * - sentradaya.com / www.sentradaya.com -> /(hub) (next.js transparent group)
 * - dashboard.sentradaya.com -> /dashboard
 * - [spoke].sentradaya.com -> /[spoke] (maps to /(spokes)/[spoke] internally)
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
  const redirectTarget = await lookupRedirect(pathname, spoke)
  if (redirectTarget) {
    const redirectUrl = new URL(redirectTarget + search, request.url)
    return NextResponse.redirect(redirectUrl, 301)
  }

  // 2. Short-circuit for already rewritten paths (to prevent infinite loops)
  const isDash = isDashboardDomain(cleanHost)

  if (
    (pathname.startsWith('/dashboard') && isDash) ||
    pathname.startsWith('/404') ||
    (spoke && pathname.startsWith(`/${spoke}`))
  ) {
    const response = NextResponse.next()
    if (isDash) {
      response.headers.set('x-middleware-subdomain', 'dashboard')
      response.headers.set('x-middleware-matched-route', '/dashboard')
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
      const url = new URL(`/404`, request.url)
      return NextResponse.rewrite(url)
    }
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
      const sessionToken =
        request.cookies.get('next-auth.session-token')?.value ||
        request.cookies.get('__Secure-next-auth.session-token')?.value ||
        request.cookies.get('authjs.session-token')?.value ||
        request.cookies.get('__Secure-authjs.session-token')?.value

      if (!sessionToken) {
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

  // 6. Fallback: unknown domains rewrite to 404
  const url = new URL(`/404`, request.url)
  return NextResponse.rewrite(url)
}

// Limit the middleware to run only on page requests (exclude static assets, api, etc.)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}


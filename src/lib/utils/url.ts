import { getWindowLocation } from './location'

/**
 * Dynamically builds a URL targeting a spoke subdomain based on the current environment.
 * Handles local development (lvh.me), staging (vercel.app), and production (dayaberkah.id).
 *
 * @param spoke - Spoke subdomain name (e.g. 'pju', 'solarcell', 'alatpetir', 'baterai')
 * @param path - Routing path (e.g. '/products' or '/products/slug')
 */
export function buildSpokeUrl(spoke: string, path: string = ''): string {
  const location = getWindowLocation()
  if (!location) {
    // SSR Fallback: return relative path
    return `/${spoke}${path}`
  }

  const { hostname, port, protocol } = location

  const isLocal = hostname === 'lvh.me' || hostname.endsWith('.lvh.me') || hostname === 'localhost' || hostname === '127.0.0.1'
  const isVercel = hostname.endsWith('.vercel.app')

  let rootDomain: string

  if (isLocal) {
    rootDomain = 'lvh.me'
  } else if (isVercel) {
    const parts = hostname.split('.')
    if (parts.length >= 4) {
      rootDomain = parts.slice(-3).join('.')
    } else {
      rootDomain = hostname
    }
  } else {
    // Fallback or production root domain
    rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'dayaberkah.id'
  }

  const portSuffix = port ? `:${port}` : ''
  return `${protocol}//${spoke}.${rootDomain}${portSuffix}${path}`
}

import { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { extractSubdomain, isSpokeDomain } from '../lib/middleware/config'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers()
  const host = headersList.get('host') || 'sentradaya.com'
  const subdomain = extractSubdomain(host)
  const isSpoke = isSpokeDomain(host)

  let sitemapUrl = 'https://sentradaya.com/sitemap.xml'
  if (isSpoke) {
    sitemapUrl = `https://${subdomain}.sentradaya.com/sitemap.xml`
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/_next/'],
    },
    sitemap: sitemapUrl,
  }
}

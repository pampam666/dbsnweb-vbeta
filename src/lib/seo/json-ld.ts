import { getOptimizedImageUrl } from '../api/sanity/image'

const ROOT_DOMAIN = 'sentradaya.com'

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DBSN Sentradaya',
    url: `https://${ROOT_DOMAIN}`,
    logo: `https://${ROOT_DOMAIN}/logo.png`,
    sameAs: [
      'https://www.facebook.com/dbsnsentradaya',
      'https://www.instagram.com/dbsnsentradaya',
      'https://www.linkedin.com/company/dbsnsentradaya',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-31-xxxxxx',
      contactType: 'customer service',
      areaServed: 'ID',
      availableLanguage: ['id', 'en'],
    },
  }
}

interface ProductImage {
  _type?: 'image'
  asset?: { _ref: string }
}

interface ProductSpec {
  key: string
  value: string
}

interface ProductData {
  title: string
  shortDescription?: string
  images?: ProductImage[]
  specifications?: ProductSpec[]
}

export function createProductSchema(product: ProductData, spoke: string) {
  let imageUrl = `https://${ROOT_DOMAIN}/og-default.png`
  if (product.images?.[0]) {
    try {
      const src = {
        _type: 'image' as const,
        ...product.images[0],
      }
      const optimized = getOptimizedImageUrl(src, 800)
      if (optimized) {
        imageUrl = optimized
      }
    } catch {
      // safe fallback
    }
  }

  // Format specifications as simple key-value description if present
  const specsDescription = product.specifications?.map(s => `${s.key}: ${s.value}`).join(', ') || ''
  const fullDescription = product.shortDescription 
    ? `${product.shortDescription}${specsDescription ? ` (${specsDescription})` : ''}`
    : `Produk berkualitas dari DBSN Sentradaya.`

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortDescription || fullDescription,
    image: imageUrl,
    brand: {
      '@type': 'Brand',
      name: 'DBSN Sentradaya',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
    },
  }
}

export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function createLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'DBSN Sentradaya',
    image: `https://${ROOT_DOMAIN}/logo.png`,
    telephone: '+62-31-xxxxxx',
    email: 'info@sentradaya.com',
    url: `https://${ROOT_DOMAIN}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Rungkut Industri No. XX',
      addressLocality: 'Surabaya',
      addressRegion: 'Jawa Timur',
      postalCode: '60290',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -7.32345,
      longitude: 112.75678,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  }
}

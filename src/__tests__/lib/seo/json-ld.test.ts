import { describe, it, expect } from '@jest/globals'
import {
  createOrganizationSchema,
  createProductSchema,
  createBreadcrumbSchema,
  createLocalBusinessSchema,
} from '../../../lib/seo/json-ld'

describe('SEO JSON-LD Schemas', () => {
  describe('createOrganizationSchema', () => {
    it('returns valid Organization schema', () => {
      const schema = createOrganizationSchema()
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Organization')
      expect(schema.name).toBe('DBSN Sentradaya')
      expect(schema.url).toBe('https://sentradaya.com')
      expect(schema.logo).toBe('https://sentradaya.com/logo.png')
    })
  })

  describe('createProductSchema', () => {
    it('returns valid Product schema', () => {
      const product = {
        title: 'Solar Panel 100Wp',
        shortDescription: 'Panel surya efisiensi tinggi',
        images: [{ asset: { _ref: 'image-ref' } }], // sanity image
        specifications: [
          { key: 'Daya Maksimum', value: '100Wp' },
          { key: 'Efisiensi', value: '18%' },
        ],
      }
      const schema = createProductSchema(product, 'solarcell')
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Product')
      expect(schema.name).toBe('Solar Panel 100Wp')
      expect(schema.description).toBe('Panel surya efisiensi tinggi')
      expect(schema.brand?.name).toBe('DBSN Sentradaya')
      expect(schema.offers?.priceCurrency).toBe('IDR')
      expect(schema.offers?.availability).toBe('https://schema.org/InStock')
    })
  })

  describe('createBreadcrumbSchema', () => {
    it('returns valid BreadcrumbList schema', () => {
      const items = [
        { name: 'Home', url: 'https://sentradaya.com' },
        { name: 'Products', url: 'https://sentradaya.com/products' },
      ]
      const schema = createBreadcrumbSchema(items)
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('BreadcrumbList')
      expect(schema.itemListElement).toHaveLength(2)
      expect(schema.itemListElement[0].position).toBe(1)
      expect(schema.itemListElement[0].name).toBe('Home')
      expect(schema.itemListElement[0].item).toBe('https://sentradaya.com')
      expect(schema.itemListElement[1].position).toBe(2)
    })
  })

  describe('createLocalBusinessSchema', () => {
    it('returns valid LocalBusiness schema', () => {
      const schema = createLocalBusinessSchema()
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('LocalBusiness')
      expect(schema.name).toBe('DBSN Sentradaya')
      expect(schema.address?.addressLocality).toBe('Surabaya')
      expect(schema.telephone).toBe('+62-31-xxxxxx')
    })
  })
})

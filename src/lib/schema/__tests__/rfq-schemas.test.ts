import { describe, it, expect } from '@jest/globals'
import { z } from 'zod'

// Import the schemas we will implement
import { rfqB2GSchema, rfqB2BSchema, sharedRfqFieldsSchema } from '../rfq-schemas'

describe('Shared RFQ Fields Schema', () => {
  it('should validate shared required fields', () => {
    const validData = {
      contact_name: 'John Doe',
      contact_email: 'john@example.com',
      contact_phone: '+6281234567890',
      company_name: 'PT Example',
      product_category: 'PJU Solar Cell',
      quantity: 100,
      project_scope: 'Street lighting for Jakarta area',
      timeline: '2024-12-31',
    }

    const result = sharedRfqFieldsSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject missing required contact_email', () => {
    const invalidData = {
      contact_name: 'John Doe',
      product_category: 'PJU Solar Cell',
      quantity: 100,
    }

    const result = sharedRfqFieldsSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ path: ['contact_email'] })
      )
    }
  })

  it('should reject invalid email format', () => {
    const invalidData = {
      contact_name: 'John Doe',
      contact_email: 'invalid-email',
      product_category: 'PJU Solar Cell',
      quantity: 100,
    }

    const result = sharedRfqFieldsSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['contact_email'],
          code: 'invalid_format',
        })
      )
    }
  })

  it('should validate Indonesian phone format (+62...)', () => {
    const validData = {
      contact_name: 'John Doe',
      contact_email: 'john@example.com',
      contact_phone: '+6281234567890',
      product_category: 'PJU Solar Cell',
      quantity: 100,
    }

    const result = sharedRfqFieldsSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should allow optional fields', () => {
    const minimalData = {
      contact_name: 'John Doe',
      contact_email: 'john@example.com',
      product_category: 'PJU Solar Cell',
      quantity: 100,
      // Optional fields omitted
    }

    const result = sharedRfqFieldsSchema.safeParse(minimalData)
    expect(result.success).toBe(true)
  })

  it('should enforce minimum quantity of 1', () => {
    const invalidData = {
      contact_name: 'John Doe',
      contact_email: 'john@example.com',
      product_category: 'PJU Solar Cell',
      quantity: 0,
    }

    const result = sharedRfqFieldsSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ path: ['quantity'] })
      )
    }
  })

  it('should enforce maximum quantity of 100000', () => {
    const invalidData = {
      contact_name: 'John Doe',
      contact_email: 'john@example.com',
      product_category: 'PJU Solar Cell',
      quantity: 100001,
    }

    const result = sharedRfqFieldsSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ path: ['quantity'] })
      )
    }
  })

  it('should sanitize and trim whitespace from text fields', () => {
    const dataWithWhitespace = {
      contact_name: '  John Doe  ',
      contact_email: 'john@example.com',
      company_name: '  PT Example  ',
      product_category: 'PJU Solar Cell',
      quantity: 100,
    }

    const result = sharedRfqFieldsSchema.safeParse(dataWithWhitespace)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.contact_name).toBe('John Doe')
      expect(result.data.company_name).toBe('PT Example')
    }
  })

  it('should accept valid timeline in YYYY-MM-DD format', () => {
    const validData = {
      contact_name: 'John Doe',
      contact_email: 'john@example.com',
      product_category: 'PJU Solar Cell',
      quantity: 100,
      timeline: '2025-06-30',
    }

    const result = sharedRfqFieldsSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid date format', () => {
    const invalidData = {
      contact_name: 'John Doe',
      contact_email: 'john@example.com',
      product_category: 'PJU Solar Cell',
      quantity: 100,
      timeline: '30-06-2025',
    }

    const result = sharedRfqFieldsSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('B2G RFQ Schema', () => {
  it('should validate complete B2G RFQ with all required fields', () => {
    const validB2G = {
      segment: 'B2G',
      source_domain: 'sentradaya.com',
      source_page_path: '/pju/rfq',
      contact_name: 'PPK Officer',
      contact_email: 'ppk@gov.id',
      contact_phone: '+6281234567890',
      company_name: 'Dinas PUPR Jakarta',
      product_category: 'PJU Solar Cell',
      quantity: 500,
      project_scope: 'Renovasi PJU 100 titik',
      timeline: '2025-03-31',
      procurement_type: 'Tender Langsung',
      dipa_reference: 'DIPA-2025-12345',
      notes: 'Membutuhkan sertifikasi TKDN',
    }

    const result = rfqB2GSchema.safeParse(validB2G)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.segment).toBe('B2G')
      expect(result.data.procurement_type).toBe('Tender Langsung')
    }
  })

  it('should require procurement_type for B2G', () => {
    const invalidB2G = {
      segment: 'B2G',
      source_domain: 'sentradaya.com',
      contact_name: 'PPK Officer',
      contact_email: 'ppk@gov.id',
      product_category: 'PJU Solar Cell',
      quantity: 500,
      // Missing procurement_type
    }

    const result = rfqB2GSchema.safeParse(invalidB2G)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({ path: ['procurement_type'] })
      )
    }
  })

  it('should validate against allowed procurement types', () => {
    const allowedTypes = [
      'Tender Langsung',
      'Tender Umum',
      'Penunjukan Langsung',
      'E-Purchasing',
    ]

    allowedTypes.forEach((type) => {
      const data = {
        segment: 'B2G',
        source_domain: 'sentradaya.com',
        contact_name: 'PPK Officer',
        contact_email: 'ppk@gov.id',
        product_category: 'PJU Solar Cell',
        quantity: 100,
        procurement_type: type,
      }

      const result = rfqB2GSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  it('should reject invalid procurement_type', () => {
    const invalidB2G = {
      segment: 'B2G',
      source_domain: 'sentradaya.com',
      contact_name: 'PPK Officer',
      contact_email: 'ppk@gov.id',
      product_category: 'PJU Solar Cell',
      quantity: 100,
      procurement_type: 'Invalid Type',
    }

    const result = rfqB2GSchema.safeParse(invalidB2G)
    expect(result.success).toBe(false)
  })

  it('should validate DIPA reference format', () => {
    const validData = {
      segment: 'B2G',
      source_domain: 'sentradaya.com',
      contact_name: 'PPK Officer',
      contact_email: 'ppk@gov.id',
      product_category: 'PJU Solar Cell',
      quantity: 100,
      procurement_type: 'Tender Langsung',
      dipa_reference: 'DIPA-2025-12345',
    }

    const result = rfqB2GSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should allow DIPA reference to be optional', () => {
    const dataWithoutDipa = {
      segment: 'B2G',
      source_domain: 'sentradaya.com',
      contact_name: 'PPK Officer',
      contact_email: 'ppk@gov.id',
      product_category: 'PJU Solar Cell',
      quantity: 100,
      procurement_type: 'Tender Langsung',
      // dipa_reference omitted
    }

    const result = rfqB2GSchema.safeParse(dataWithoutDipa)
    expect(result.success).toBe(true)
  })

  it('should include source tracking fields', () => {
    const dataWithTracking = {
      segment: 'B2G',
      source_domain: 'pju.sentradaya.com',
      source_page_path: '/products/street-light',
      source_campaign_tag: 'google-ads',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'pju-promo',
      contact_name: 'PPK Officer',
      contact_email: 'ppk@gov.id',
      product_category: 'PJU Solar Cell',
      quantity: 100,
      procurement_type: 'Tender Langsung',
    }

    const result = rfqB2GSchema.safeParse(dataWithTracking)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.source_domain).toBe('pju.sentradaya.com')
      expect(result.data.source_page_path).toBe('/products/street-light')
      expect(result.data.utm_source).toBe('google')
    }
  })
})

describe('B2B RFQ Schema', () => {
  it('should validate complete B2B RFQ with all required fields', () => {
    const validB2B = {
      segment: 'B2B',
      source_domain: 'sentradaya.com',
      source_page_path: '/solarcell/rfq',
      contact_name: 'Procurement Manager',
      contact_email: 'procurement@company.com',
      contact_phone: '+6281234567890',
      company_name: 'PT Solar Indonesia',
      product_category: 'Solar Cell Panel',
      quantity: 200,
      project_scope: 'Installation for warehouse',
      timeline: '2025-04-30',
      notes: 'Need datasheets and installation guide',
    }

    const result = rfqB2BSchema.safeParse(validB2B)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.segment).toBe('B2B')
    }
  })

  it('should not require procurement_type for B2B', () => {
    const b2bWithoutProcurementType = {
      segment: 'B2B',
      source_domain: 'sentradaya.com',
      contact_name: 'Procurement Manager',
      contact_email: 'procurement@company.com',
      product_category: 'Solar Cell Panel',
      quantity: 200,
      // procurement_type not included
    }

    const result = rfqB2BSchema.safeParse(b2bWithoutProcurementType)
    expect(result.success).toBe(true)
  })

  it('should allow company_name to be optional for B2B', () => {
    const b2bWithoutCompany = {
      segment: 'B2B',
      source_domain: 'sentradaya.com',
      contact_name: 'Individual Buyer',
      contact_email: 'buyer@gmail.com',
      product_category: 'Solar Cell Panel',
      quantity: 10,
      // company_name omitted
    }

    const result = rfqB2BSchema.safeParse(b2bWithoutCompany)
    expect(result.success).toBe(true)
  })

  it('should reject B2B with procurement_type (B2G-only field)', () => {
    const b2bWithProcurementType = {
      segment: 'B2B',
      source_domain: 'sentradaya.com',
      contact_name: 'Procurement Manager',
      contact_email: 'procurement@company.com',
      product_category: 'Solar Cell Panel',
      quantity: 200,
      procurement_type: 'Tender Langsung',
    }

    const result = rfqB2BSchema.safeParse(b2bWithProcurementType)
    expect(result.success).toBe(false)
  })

  it('should include source tracking fields', () => {
    const dataWithTracking = {
      segment: 'B2B',
      source_domain: 'solarcell.sentradaya.com',
      source_page_path: '/products/panel-300w',
      source_campaign_tag: 'linkedin-ad',
      utm_source: 'linkedin',
      contact_name: 'Procurement Manager',
      contact_email: 'procurement@company.com',
      product_category: 'Solar Cell Panel',
      quantity: 50,
    }

    const result = rfqB2BSchema.safeParse(dataWithTracking)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.source_domain).toBe('solarcell.sentradaya.com')
      expect(result.data.utm_source).toBe('linkedin')
    }
  })
})

describe('Segment Validation', () => {
  it('should accept B2G segment', () => {
    const data = {
      segment: 'B2G',
      source_domain: 'sentradaya.com',
      contact_name: 'Test User',
      contact_email: 'test@example.com',
      product_category: 'Test Product',
      quantity: 100,
      procurement_type: 'Tender Langsung',
    }

    const result = rfqB2GSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should accept B2B segment', () => {
    const data = {
      segment: 'B2B',
      source_domain: 'sentradaya.com',
      contact_name: 'Test User',
      contact_email: 'test@example.com',
      product_category: 'Test Product',
      quantity: 100,
    }

    const result = rfqB2BSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should reject invalid segment', () => {
    const data = {
      segment: 'B2C',
      source_domain: 'sentradaya.com',
      contact_name: 'Test User',
      contact_email: 'test@example.com',
      product_category: 'Test Product',
      quantity: 100,
    }

    const resultB2G = rfqB2GSchema.safeParse(data)
    const resultB2B = rfqB2BSchema.safeParse(data)
    expect(resultB2G.success).toBe(false)
    expect(resultB2B.success).toBe(false)
  })
})
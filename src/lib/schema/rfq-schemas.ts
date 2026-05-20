import { z } from 'zod'

// Indonesian phone number regex: +62 followed by 8-12 digits
const indonesianPhoneRegex = /^\+62[1-9]\d{8,12}$/

// Allowed procurement types for B2G
const PROCUREMENT_TYPES = [
  'Tender Langsung',
  'Tender Umum',
  'Penunjukan Langsung',
  'E-Purchasing',
] as const

// Segment types
const SEGMENT_TYPES = ['B2G', 'B2B'] as const

// Source tracking schema
const sourceTrackingSchema = z.object({
  source_domain: z.string().min(1).max(255),
  source_page_path: z.string().min(1).max(512).optional(),
  source_campaign_tag: z.string().min(1).max(255).optional(),
  utm_source: z.string().min(1).max(255).optional(),
  utm_medium: z.string().min(1).max(255).optional(),
  utm_campaign: z.string().min(1).max(255).optional(),
})

// Shared RFQ fields used by both B2G and B2B
export const sharedRfqFieldsSchema = z.object({
  // Contact information
  contact_name: z.string().min(1).max(255).trim(),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string()
    .regex(indonesianPhoneRegex, 'Phone number must be in +62 format')
    .optional(),
  company_name: z.string().min(1).max(255).trim().optional(),

  // RFQ details
  product_category: z.string().min(1).max(255),
  quantity: z.number().int().min(1).max(100000),
  project_scope: z.string().min(1).max(5000).trim().optional(),
  timeline: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Timeline must be in YYYY-MM-DD format')
    .optional(),
  notes: z.string().max(2000).trim().optional(),
})

// B2G-specific fields
const b2GSpecificFieldsSchema = z.object({
  procurement_type: z.enum(PROCUREMENT_TYPES, {
    errorMap: () => ({ message: 'Invalid procurement type' }),
  }),
  dipa_reference: z.string().min(1).max(255).trim().optional(),
})

// B2G RFQ schema
export const rfqB2GSchema = sourceTrackingSchema
  .merge(sharedRfqFieldsSchema)
  .merge(b2GSpecificFieldsSchema)
  .extend({
    segment: z.literal('B2G'),
  })
  .strict()

// B2B RFQ schema
export const rfqB2BSchema = sourceTrackingSchema
  .merge(sharedRfqFieldsSchema)
  .extend({
    segment: z.literal('B2B'),
  })
  .strict()

// Type exports for TypeScript
export type RfqSharedFields = z.infer<typeof sharedRfqFieldsSchema>
export type RfqB2GInput = z.infer<typeof rfqB2GSchema>
export type RfqB2BInput = z.infer<typeof rfqB2BSchema>
export type SourceTracking = z.infer<typeof sourceTrackingSchema>

// Procurement type enum
export type ProcurementType = (typeof PROCUREMENT_TYPES)[number]
export type SegmentType = (typeof SEGMENT_TYPES)[number]
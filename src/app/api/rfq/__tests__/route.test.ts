import { describe, it, expect, beforeEach } from '@jest/globals'
import { NextRequest } from 'next/server'

const mockNextRequest = jest.fn()
const mockNextResponse = { json: jest.fn() }
jest.mock('next/server', () => ({
  NextRequest: mockNextRequest,
  NextResponse: mockNextResponse,
}))

describe('GET /api/rfq', () => {
  let GET: () => Promise<unknown>

  beforeEach(async () => {
    jest.clearAllMocks()
    jest.isolateModules(async () => {
      const route = await import('../route')
      GET = route.GET as () => Promise<unknown>
    })
  })

  it('should return health check status', async () => {
    await GET()
    expect(mockNextResponse.json).toHaveBeenCalledWith({
      status: 'ok',
      api: 'rfq-ingestion',
      version: '1.0.0',
    })
  })
})

describe('POST /api/rfq', () => {
  let POST: (request: NextRequest) => Promise<unknown>

  beforeEach(async () => {
    jest.clearAllMocks()
    jest.isolateModules(async () => {
      const route = await import('../route')
      POST = route.POST as (request: NextRequest) => Promise<unknown>
    })
  })

  it('should return 400 when request body contains malformed JSON', async () => {
    const mockRequest = {
      text: jest.fn().mockRejectedValue(new Error('JSON parse error')),
      json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
    } as unknown as NextRequest

    await POST(mockRequest)

    expect(mockNextResponse.json).toHaveBeenCalledWith(
      {
        error: {
          code: 'invalid_json',
          message: 'Malformed JSON payload',
        },
      },
      { status: 400 }
    )
  })

  it('should return 400 when segment is missing or invalid', async () => {
    const payload = { contact_name: 'Test Buyer' }
    const mockRequest = {
      text: jest.fn().mockResolvedValue(JSON.stringify(payload)),
      json: jest.fn().mockResolvedValue(payload),
    } as unknown as NextRequest

    await POST(mockRequest)

    expect(mockNextResponse.json).toHaveBeenCalledWith(
      {
        error: {
          code: 'invalid_segment',
          message: 'Segment must be B2B or B2G',
        },
      },
      { status: 400 }
    )
  })

  it('should accept valid B2B payload and return 201 Created', async () => {
    const validB2BPayload = {
      segment: 'B2B',
      source_domain: 'solarcell.sentradaya.com',
      source_page_path: '/products',
      contact_name: 'Test Buyer',
      contact_email: 'buyer@example.com',
      contact_phone: '+6281234567890',
      company_name: 'PT Solar Power',
      items: [
        {
          product_id: 'sanity-id-1',
          product_name: 'Solar Module 100W',
          quantity: 25,
          variant: 'Mono',
          item_notes: 'Needs mounting brackets',
        },
      ],
      project_scope: 'Building rooftop solar installation',
      timeline: '2026-12-31',
    }

    const mockRequest = {
      text: jest.fn().mockResolvedValue(JSON.stringify(validB2BPayload)),
      json: jest.fn().mockResolvedValue(validB2BPayload),
    } as unknown as NextRequest

    await POST(mockRequest)

    expect(mockNextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          id: expect.stringMatching(/^lead_/),
          submission_status: 'received',
          dashboard_access_status: 'not_eligible',
        }),
      }),
      expect.objectContaining({
        status: 201,
      })
    )
  })

  it('should accept valid B2G payload and return 201 Created', async () => {
    const validB2GPayload = {
      segment: 'B2G',
      source_domain: 'sentradaya.com',
      source_page_path: '/pju',
      contact_name: 'Gov Officer',
      contact_email: 'officer@gov.id',
      contact_phone: '+6281234567890',
      company_name: 'Dinas Perhubungan',
      items: [
        {
          product_id: 'sanity-pju-1',
          product_name: 'PJU Street Light',
          quantity: 100,
        },
      ],
      procurement_type: 'Tender Langsung',
      dipa_reference: 'DIPA-2026-1122',
    }

    const mockRequest = {
      text: jest.fn().mockResolvedValue(JSON.stringify(validB2GPayload)),
      json: jest.fn().mockResolvedValue(validB2GPayload),
    } as unknown as NextRequest

    await POST(mockRequest)

    expect(mockNextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          id: expect.stringMatching(/^lead_/),
          submission_status: 'received',
          dashboard_access_status: 'not_eligible',
        }),
      }),
      expect.objectContaining({
        status: 201,
      })
    )
  })

  it('should return 422 validation_error when fields are malformed or missing', async () => {
    const invalidPayload = {
      segment: 'B2G',
      source_domain: 'sentradaya.com',
      contact_name: 'Gov Officer',
      contact_email: 'invalid-email-format',
      contact_phone: '08123456789', // Invalid phone format (+62)
      company_name: '',
      items: [], // At least 1 item is required
      // Missing procurement_type
    }

    const mockRequest = {
      text: jest.fn().mockResolvedValue(JSON.stringify(invalidPayload)),
      json: jest.fn().mockResolvedValue(invalidPayload),
    } as unknown as NextRequest

    await POST(mockRequest)

    expect(mockNextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'validation_error',
          message: 'Request validation failed',
          details: expect.arrayContaining([
            expect.objectContaining({
              field: 'contact_email',
              code: 'invalid_format',
            }),
            expect.objectContaining({
              field: 'contact_phone',
              code: 'invalid_format',
            }),
            expect.objectContaining({
              field: 'items',
              code: 'too_small',
            }),
            expect.objectContaining({
              field: 'procurement_type',
              code: 'invalid_value',
            }),
          ]),
        }),
      }),
      { status: 422 }
    )
  })
})

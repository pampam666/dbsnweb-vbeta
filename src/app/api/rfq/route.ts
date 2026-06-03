import { NextRequest, NextResponse } from 'next/server'
import { rfqB2BSchema, rfqB2GSchema } from '@/lib/schema/rfq-schemas'

/**
 * POST /api/rfq
 *
 * Handles RFQ form submissions for B2B and B2G segments.
 * Validates request payload against Zod schemas, returning structured
 * errors for validation failures or a 201 response envelope on success.
 */
export async function POST(request: NextRequest) {
  try {
    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        {
          error: {
            code: 'invalid_json',
            message: 'Malformed JSON payload',
          },
        },
        { status: 400 }
      )
    }

    const { segment } = body || {}

    if (segment !== 'B2B' && segment !== 'B2G') {
      return NextResponse.json(
        {
          error: {
            code: 'invalid_segment',
            message: 'Segment must be B2B or B2G',
          },
        },
        { status: 400 }
      )
    }

    const schema = segment === 'B2B' ? rfqB2BSchema : rfqB2GSchema
    const parseResult = schema.safeParse(body)

    if (!parseResult.success) {
      const details = parseResult.error.issues.map((issue) => {
        let code: string = issue.code
        // Map common Zod codes to business-friendly codes
        if (issue.code === 'invalid_type' && issue.received === 'undefined') {
          code = 'required_field'
        } else if (issue.code === 'invalid_string' && (issue as any).validation === 'email') {
          code = 'invalid_format'
        }
        return {
          field: issue.path.join('.'),
          message: issue.message,
          code,
        }
      })

      return NextResponse.json(
        {
          error: {
            code: 'validation_error',
            message: 'Request validation failed',
            details,
          },
        },
        { status: 422 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const validatedData = parseResult.data

    // ─── Phase 2 / Integration Placeholders ─────────────────────────────
    // TODO: Ingest lead into Neon Postgres via Prisma Client:
    // const lead = await prisma.lead.create({ data: { ... } })
    //
    // TODO: Trigger Resend transactional emails:
    // await resendQueue.enqueue({ type: 'email', payload: { ... } })
    //
    // TODO: Trigger Telegram operations alert bot:
    // await telegramQueue.enqueue({ type: 'telegram', payload: { ... } })
    // ────────────────────────────────────────────────────────────────────

    // Generate a unique lead ID (cuid-like mock prefix)
    const mockId = `lead_${Math.random().toString(36).substring(2, 15)}`

    return NextResponse.json(
      {
        data: {
          id: mockId,
          submission_status: 'received',
          dashboard_access_status: 'not_eligible',
          created_at: new Date().toISOString(),
        },
      },
      {
        status: 201,
        headers: {
          Location: `/api/rfq/${mockId}`,
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_error',
          message: error instanceof Error ? error.message : 'Unknown internal server error',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/rfq
 *
 * Health-check endpoint for the RFQ ingestion route.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    api: 'rfq-ingestion',
    version: '1.0.0',
  })
}

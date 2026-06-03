import { NextResponse } from 'next/server'
import { NotificationQueue } from '../../../../lib/api/notifications/queue'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await NotificationQueue.processAllPending()
    return NextResponse.json({
      success: true,
      message: 'Notification queue processed successfully',
    })
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    console.error('Notification queue processing failed:', errorObj)
    return NextResponse.json(
      {
        success: false,
        error: errorObj.message,
      },
      { status: 500 }
    )
  }
}

import { Lead } from '@prisma/client'

export async function alertNewRfq(lead: Lead): Promise<void> {
  // Stub
}

export async function alertRfqFailure(error: Error, payload: unknown): Promise<void> {
  // Stub
}

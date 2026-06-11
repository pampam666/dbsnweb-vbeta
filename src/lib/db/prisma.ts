import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  __prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL!

// Use Neon Driver Adapter for Edge compatibility
const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)

export const prisma = globalForPrisma.__prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma
}

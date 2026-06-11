import { handlers } from '../../../../lib/auth/auth.config'
export const { GET, POST } = handlers

export const runtime = 'nodejs' // Prisma client / NextAuth config exceeds Edge 1MB bundle limit


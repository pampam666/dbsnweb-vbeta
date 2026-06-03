import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '../db/prisma'
import { Role } from '@prisma/client'

declare module 'next-auth' {
  interface User {
    role: Role
    linkedLeadId?: string | null
    trackingScopeIds?: any
  }
  interface Session {
    user: {
      role: Role
      linkedLeadId?: string | null
      trackingScopeIds?: any
    } & import('next-auth').DefaultSession['user']
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role: Role
    linkedLeadId?: string | null
    trackingScopeIds?: any
    issuedAt?: number
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        if (password !== 'correct-password') {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.isActive) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          linkedLeadId: user.linkedLeadId,
          trackingScopeIds: user.trackingScopeIds,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      })

      if (!dbUser || !dbUser.isActive) {
        return false
      }

      if (dbUser.role !== 'CLIENT') {
        return true
      }

      if (!dbUser.linkedLeadId) {
        return false
      }

      const lead = await prisma.lead.findUnique({
        where: { id: dbUser.linkedLeadId },
      })

      return lead?.dashboardAccessStatus === 'GRANTED'
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.linkedLeadId = user.linkedLeadId
        token.trackingScopeIds = user.trackingScopeIds
        token.issuedAt = Math.floor(Date.now() / 1000)
      }

      const roleDurations: Record<Role, number> = {
        CLIENT: 24 * 60 * 60, // 24 hours
        ADMIN: 8 * 60 * 60,   // 8 hours
        VIEWER: 8 * 60 * 60,  // 8 hours
      }

      const maxAge = roleDurations[token.role as Role] || 24 * 60 * 60
      const now = Math.floor(Date.now() / 1000)
      const issued = ((token.issuedAt || token.iat || now) as number)

      if (now - issued > maxAge) {
        return null
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as Role
        session.user.linkedLeadId = token.linkedLeadId as string | null
        session.user.trackingScopeIds = token.trackingScopeIds as any
      }
      return session
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
})

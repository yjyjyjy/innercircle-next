import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
import prisma from '../../../lib/prisma'

export default NextAuth({
   adapter: PrismaAdapter(prisma),
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
   ],
   secret: process.env.SECRET,
   callbacks: {
      session: async ({ session, token }) => {
         if (session?.user) {
            session.userID = token.uid
         }
         return session
      },
      jwt: async ({ user, token }) => {
         if (user) {
            token.uid = user.id
         }
         return token
      },
   },
   session: {
      strategy: 'jwt',
   },
   theme: {
      colorScheme: 'light',
      // brandColor: '#58AAEA'
   }
})

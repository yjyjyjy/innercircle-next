import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import DiscordProvider from 'next-auth/providers/discord'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default NextAuth({
   adapter: PrismaAdapter(prisma),
   providers: [
      DiscordProvider({
         clientId: '981540021863600148',
         clientSecret: 'BOQUntwFr7mLsGtDFmjpmLdMPcZ-FBzF',
         authorization:
            'https://discord.com/api/oauth2/authorize?client_id=981540021863600148&redirect_uri=http%3A%2F%2Fwww.google.com&response_type=code&scope=identify',
      }),
      GoogleProvider({
         clientId:
            '1008494238652-vned4rr72j9vh3u7g8ql27nuulgqiuq9.apps.googleusercontent.com',
         clientSecret: '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',
      }),
   ],
   secret: '244642dc9eb49958c0501bbeb197e83b',
   callbacks: {
      session: async ({ session, token }) => {
         if (session?.user) {
            session.id = token.uid
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
})

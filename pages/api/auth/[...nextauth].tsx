import NextAuth, { NextAuthOptions } from "next-auth"
// import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prisma"

export const AuthOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        // GoogleProvider({
        //    clientId: process.env.GOOGLE_CLIENT_ID!,
        //    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // }),
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
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
        strategy: "jwt",
    },
    theme: {
        colorScheme: "light",
    },
}

export default NextAuth(AuthOptions)

import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { getSession } from "next-auth/react"


export default async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req })

    if (!session || !session.userID || !session.user?.email) {
        res.status(500).json({ error: 'UnAuthorized!!!' })
        return
    }

    if (req.method === 'POST') {
        const { type } = req.headers
        // adding email so the database constraint is satisfied
        const payload_data = {
            ...JSON.parse(req.body),
            email: session.user.email // attch the curent user's email
        }

        const existing_profile = await prisma.user_profile.findUnique({
            where: {
                email: session.user.email
            }
        })

        if (!existing_profile) {
            // create a profile
            await prisma.user_profile.create({
                data: payload_data
            })
        } else {
            await prisma.user_profile.update({
                where: {
                    email: session.user.email,
                },
                data: payload_data
            })
        }
        res.status(200).json({ message: 'Profile create/update successful' })

    } else {
        // Handle any other HTTP method
        res.status(200).json({ name: 'Nothing happened.' })
    }
}




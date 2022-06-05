import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { getSession } from "next-auth/react"


export default async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req })

    if (!session || !session.userID || !session.user?.email) {
        res.status(500).json({ error: 'UnAuthorized!!!' })
        return
    }

    console.log('SERVER SIDE SESSION', session)

    const userID = session.userID as string // current logged in user's id

    const user = await prisma.user.findUnique({
        where: {
            id: userID
        },
    })

    console.log('useruseruser', user)

    if (req.method === 'POST') {
        const { type } = req.headers
        // adding email so the database constraint is satisfied
        const payload_data = {
            ...JSON.parse(req.body),
            email: session.user.email
        }
        if (type === 'create') {
            // Process a POST request
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
        res.status(200).json({ name: 'John Doe' })
    }
}




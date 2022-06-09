import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/react'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })

    if (!session || !session.userID || !session.user?.email) {
        res.status(500).json({ message: 'Please log in first' })
        return
    }

    if (req.method === 'POST') {
        // adding email so the database constraint is satisfied
        let payloadData = {
            ...JSON.parse(req.body),
            email: session.user.email, // attach the curent user's email
        }

        const existingProfileWithEmail = await prisma.user_profile.findUnique({
            where: {
                email: session.user.email as string,
            },
        })

        // clean up the payloadData handle
        payloadData = { ...payloadData, handle: payloadData.handle.toLowerCase().replace(/\s/g, '') }

        //Check if handle is already in use by other user
        const existingProfileWithHandle = await prisma.user_profile.findUnique({
            where: {
                handle: payloadData.handle,
            },
        })

        if (existingProfileWithHandle && existingProfileWithHandle.email.toLowerCase() !== payloadData.email) {
            res.status(500).json({ message: 'Profile handle has been taken. Please choose a different one.' })
            return
        }

        //Create new profile if email is new
        if (!existingProfileWithEmail) {
            // create a profile
            await prisma.user_profile.create({
                data: payloadData,
            })
            res.status(200).json({ message: 'Profile successfully created!' })

        } else {

            await prisma.user_profile.update({
                where: {
                    email: session.user.email,
                },
                data: payloadData,
            })
            res.status(200).json({ message: 'Profile successfully updated!' })
        }
    } else {
        // Handle any other HTTP method
        res.status(200).json({ message: 'Nothing happened.' })
    }
}

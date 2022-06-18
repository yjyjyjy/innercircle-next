import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/react'
import { mailer } from '../../lib/mailer'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // make sure user is signed in
    const session = await getSession({ req })

    if (!session || !session.userID || !session.user?.email) {
        res.status(500).json({ message: 'Please log in first' })
        return
    }

    // use Email to find the authUser's userProfile
    const authUserEmail: string = session.user.email

    const existingProfileWithEmail = await prisma.user_profile.findUnique({
        where: {
            email: authUserEmail,
        },
    })

    if (!existingProfileWithEmail?.id) {
        res.status(500).json({ message: 'User session error. Cannot find your own profile.' })
        return
    }

    const authUserProfileId = existingProfileWithEmail.id

    // extract targetUserProfileId
    let targetUserProfileId
    let requestedOperation
    try {
        const payloadData = JSON.parse(req.body)
        targetUserProfileId = payloadData.targetUserProfileId
        requestedOperation = payloadData.requestedOperation
        if (!targetUserProfileId) {
            res.status(500).json({ message: 'Invalidate request to connection api. Missing data or wrong format' })
            return
        }
    } catch (error) {
        res.status(500).json({ message: 'Invalidate request to connection api. Missing data or wrong format', error })
        return
    }

    const acceptConnectionRequest = async () => {
        await prisma.connection_request.updateMany({
            where: {
                initiator_id: targetUserProfileId,
                requested_id: authUserProfileId,
            },
            data: {
                confirmed_at: new Date(),
            },
        })
        await prisma.connection.createMany({
            data: [
                { user_profile_start: authUserProfileId, user_profile_end: targetUserProfileId, created_at: new Date() },
                { user_profile_start: targetUserProfileId, user_profile_end: authUserProfileId, created_at: new Date() }
            ]
        })
        res.status(200).json({ message: 'Connect Request Accepted' })
    }

    // POST -- connection request
    if (req.method === 'POST') {



        // check if it's connecting your own.
        if (authUserProfileId === targetUserProfileId) {
            res.status(500).json({ message: 'Invalidate request to connection api. you cannot request connect to yourself' })
            return
        }

        // check if it's already requested.
        const existingConnectionRequest = await prisma.connection_request.findFirst({
            where: {
                initiator_id: authUserProfileId,
                requested_id: targetUserProfileId,
            }
        })

        if (existingConnectionRequest) {
            res.status(500).json({ message: 'Invalidate request to connection api. Request has already been made' })
            return
        }

        // TODO check if there has been too many requests from this person

        // when there is already a request from teh targetedUserProfile
        const existingReverseConnectionRequest = await prisma.connection_request.findFirst({
            where: {
                initiator_id: targetUserProfileId,
                requested_id: authUserProfileId,
            }
        })

        if (existingReverseConnectionRequest) {
            acceptConnectionRequest()
            return
        }

        // 🚀 Make a new connection request
        // step 1. add a row in the db
        await prisma.connection_request.create({
            data: {
                initiator_id: authUserProfileId,
                requested_id: targetUserProfileId,
                created_at: new Date(),
                confirmed_at: null
            }
        })

        // TODO send an email


        res.status(200).json({ message: 'Connect Request Sent' })
        return
    }

    // PATCH -- when connection request accepted or rejected

    if (req.method === 'PATCH') {
        // There should be a pending request
        const pendingRequest = await prisma.connection_request.findFirst({
            where: {
                initiator_id: targetUserProfileId,
                requested_id: authUserProfileId,
                confirmed_at: null
            }
        })
        if (!pendingRequest) {
            res.status(500).json({ message: 'Invalidate request to connection api. No existing request to accept' })
            return
        }
        // There should not be records in connection table
        const existingConnections = await prisma.connection.findMany({
            where: {
                OR: [
                    {
                        user_profile_start: authUserProfileId,
                        user_profile_end: targetUserProfileId
                    },
                    {
                        user_profile_start: targetUserProfileId,
                        user_profile_end: authUserProfileId
                    }
                ]
            }
        })
        if (existingConnections.length > 0) {
            res.status(500).json({ message: 'Invalidate request to connection api. Connections between members already exist' })
            return
        }

        // requestedOperation shouldn't be null
        if (!requestedOperation || !['accept', 'reject'].includes(requestedOperation)) {
            res.status(500).json({ message: 'Invalidate request to connection api. requestedOperation not specified or is neither accept nor reject' })
            return
        }

        if (requestedOperation === 'accept') {
            // Accept the connection request
            acceptConnectionRequest()
            return

        } else {
            // Reject the connection request
            await prisma.connection_request.updateMany({
                where: {
                    initiator_id: targetUserProfileId,
                    requested_id: authUserProfileId,
                },
                data: {
                    rejected_at: new Date(),
                },
            })
            res.status(200).json({ message: 'Connect Request Rejected' })
        }
        return
    }

    // DELETE -- when connection was removed
    if (req.method === 'DELETE') {

    }

    // Handle any other HTTP method
    res.status(200).json({ message: 'Nothing happened.' })
}

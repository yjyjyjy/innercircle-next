import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { mailer, Email } from '../../lib/mailer'
import { defaultProfilePicture, inviteMessageMaxLength } from '../../lib/const'
import { dmEmailTemplate } from '../../lib/email-template/dmEmailTemplate'
import { getSession } from 'next-auth/react'

const Messenger = async (req: NextApiRequest, res: NextApiResponse) => {
    // make sure user is signed in
    const session = await getSession({ req })

    if (!session || !session.userID || !session.user?.email) {
        res.status(500).json({ message: 'Please log in first' })
        return
    }

    // use Email to find the authUser's userProfile
    const authUserEmail: string = session.user.email

    const authUserProfileWithEmail = await prisma.user_profile.findUnique({
        where: {
            email: authUserEmail,
        },
    })

    if (!authUserProfileWithEmail?.id) {
        res.status(500).json({
            message: 'User session error. Cannot find your own profile.',
        })
        return
    }
    if (req.method === 'POST') {
        const authUserProfileId = authUserProfileWithEmail.id

        // extract targetUserProfileId
        let targetUserProfileId
        let message

        try {
            const payloadData = JSON.parse(req.body)
            targetUserProfileId = payloadData.targetUserProfileId
            message = payloadData?.message

            if (!targetUserProfileId) {
                res.status(500).json({
                    message:
                        'Invalidate request to messenger api. Missing targetUserProfileId in request body',
                })
                return
            }

            const existingConnection = await prisma.connection.findFirst({
                where: {
                    user_profile_start: authUserProfileId,
                    user_profile_end: targetUserProfileId,
                },
            })

            if (!existingConnection) {
                res.status(500).json({
                    message:
                        'Invalidate request to messenger api. Sender needs to connect with receiver first',
                })
                return
            }

            if (!message || message.length === 0) {
                res.status(500).json({
                    message:
                        'Invalidate request to messenger api. Message is empty or did not pass through',
                })
                return
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message:
                    'Invalidate request to connection api. Missing data or wrong format',
                error,
            })
            return
        }

        // Target user should exist
        const targetUserProfile = await prisma.user_profile.findUnique({
            where: { id: targetUserProfileId },
        })

        if (!targetUserProfile) {
            res.status(500).json({
                message:
                    'Invalidate request to connection api. Target user does not exist.',
            })
            return
        }

        // send the message
        const sendMessage = async () => {
            mailer({
                to: targetUserProfile.email,
                subject: `[innerCircle.ooo Notification] message from ${authUserProfileWithEmail.profile_name}`,
                html: dmEmailTemplate({
                    recipientName: targetUserProfile.profile_name,
                    userProfileName: authUserProfileWithEmail.profile_name,
                    userProfilePicture:
                        authUserProfileWithEmail.profile_picture ||
                        defaultProfilePicture,
                    message: message,
                }),
            })

            res.status(200).json({ message: 'Message Sent' })
            return
        }

        sendMessage()
    }

    // Handle any other HTTP method
    res.status(200).json({ message: 'Nothing happened.' })
}

export default Messenger

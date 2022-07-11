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
        return res.status(500).json({ message: 'Please log in first' })
    }

    // use Email to find the authUser's userProfile
    const authUserEmail: string = session.user.email

    const authUserProfileWithEmail = await prisma.user_profile.findUnique({
        where: {
            email: authUserEmail,
        },
    })

    if (!authUserProfileWithEmail?.id) {
        return res.status(500).json({
            message: 'User session error. Cannot find your own profile.',
        })
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
                return res.status(500).json({
                    message:
                        'Invalidate request to messenger api. Missing targetUserProfileId in request body',
                })
            }

            const existingConnection = await prisma.connection.findFirst({
                where: {
                    user_profile_start: authUserProfileId,
                    user_profile_end: targetUserProfileId,
                },
            })

            if (!existingConnection) {
                return res.status(500).json({
                    message:
                        'Invalidate request to messenger api. Sender needs to connect with receiver first',
                })
            }

            if (!message || message.length === 0) {
                return res.status(500).json({
                    message:
                        'Invalidate request to messenger api. Message is empty or did not pass through',
                })
            }
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message:
                    'Invalidate request to connection api. Missing data or wrong format',
                error,
            })
        }

        // Target user should exist
        const targetUserProfile = await prisma.user_profile.findUnique({
            where: { id: targetUserProfileId },
        })

        if (!targetUserProfile) {
            return res.status(500).json({
                message:
                    'Invalidate request to connection api. Target user does not exist.',
            })

        }

        // send the message
        const sendMessage = async () => {
            await mailer({
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

            return res.status(200).json({ message: 'Message Sent' })

        }

        sendMessage()
    }

    // Handle any other HTTP method
    return res.status(200).json({ message: 'Nothing happened.' })

}

export default Messenger

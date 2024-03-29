import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { mailer, Email } from '../../lib/mailer'
import { connectRequestEmailTemplate } from '../../lib/email-template/connectRequestEmailTemplate'
import { defaultProfilePicture, inviteMessageMaxLength } from '../../lib/const'
import { connectRequestAcceptTemplate } from '../../lib/email-template/connectAcceptedEmailTemplate'
import { getSession } from 'next-auth/react'

const Connection = async (req: NextApiRequest, res: NextApiResponse) => {
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

   const authUserProfileId = authUserProfileWithEmail.id

   // extract targetUserProfileId
   let targetUserProfileId
   let requestedOperation
   let inviteMessage

   try {
      const payloadData = JSON.parse(req.body)
      targetUserProfileId = payloadData.targetUserProfileId
      requestedOperation = payloadData.requestedOperation
      inviteMessage = payloadData?.inviteMessage

      if (!targetUserProfileId) {
         return res.status(500).json({
            message:
               'Invalidate request to connection api. Missing targetUserProfileId in request body',
         })
      }

      if (inviteMessage && inviteMessage.length > inviteMessageMaxLength) {
         return res.status(500).json({
            message:
               'Invalidate request to connection api. Invite message too long',
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
            {
               user_profile_start: authUserProfileId,
               user_profile_end: targetUserProfileId,
               created_at: new Date(),
            },
            {
               user_profile_start: targetUserProfileId,
               user_profile_end: authUserProfileId,
               created_at: new Date(),
            },
         ],
      })

      const targetUserProfile = await prisma.user_profile.findUnique({
         where: { id: targetUserProfileId },
      })

      if (!targetUserProfile?.email) {
         return res.status(500).json({
            message:
               'Invalidate request to connection api. Requestor email does not exists',
         })
      }

      mailer({
         to: targetUserProfile.email,
         subject: `[innerCircle.ooo Notification] new connection with ${authUserProfileWithEmail.profile_name}!`,
         html: connectRequestAcceptTemplate({
            recipientName: targetUserProfile.profile_name,
            userProfileName: authUserProfileWithEmail.profile_name,
            userProfilePicture:
               authUserProfileWithEmail.profile_picture ||
               defaultProfilePicture,
            shortBio: authUserProfileWithEmail.bio_short || '',
            bio: authUserProfileWithEmail.bio || '',
            ctaCallbackURL: `https://innercircle.ooo/in/${authUserProfileWithEmail.handle}`,
            ctaLabel: 'See Profile',
         }),
      })

      return res.status(200).json({ message: 'Connect Request Accepted' })
   }

   // POST -- connection request
   if (req.method === 'POST') {
      // check if it's connecting your own.
      if (authUserProfileId === targetUserProfileId) {
         return res.status(500).json({
            message:
               'Invalidate request to connection api. you cannot request connect to yourself',
         })
      }

      // check if it's already requested.
      const existingConnectionRequest =
         await prisma.connection_request.findFirst({
            where: {
               initiator_id: authUserProfileId,
               requested_id: targetUserProfileId,
            },
         })

      if (existingConnectionRequest) {
         return res.status(500).json({
            message:
               'Invalidate request to connection api. Request has already been made',
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

      // TODO check if there has been too many requests from this person

      // when there is already a request from teh targetedUserProfile
      const existingReverseConnectionRequest =
         await prisma.connection_request.findFirst({
            where: {
               initiator_id: targetUserProfileId,
               requested_id: authUserProfileId,
            },
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
            invitation_message: inviteMessage,
            created_at: new Date(),
            confirmed_at: null,
         },
      })

      // step 2. send an email
      const html = connectRequestEmailTemplate({
         recipientName: targetUserProfile.profile_name,
         userProfileName: authUserProfileWithEmail.profile_name,
         userProfilePicture:
            authUserProfileWithEmail.profile_picture || defaultProfilePicture,
         shortBio: authUserProfileWithEmail.bio_short || '',
         bio: authUserProfileWithEmail.bio || '',
         inviteMessage: inviteMessage || '',
         ctaCallbackURL: 'https://innerCircle.ooo/mynetwork',
      })

      const msg: Email = {
         to: targetUserProfile.email,
         subject: `[innerCircle.ooo Notification] member ${authUserProfileWithEmail.profile_name} requests to connect`,
         html: html,
      }

      const response = await mailer(msg)

      if (response.statusCode === 202) {
         return res.status(200).json({ message: 'Connect Request Sent' })
      }
      else {
         return res.status(500).json({ message: 'Mailer Error' })
      }
   }

   // PATCH -- when connection request accepted or rejected

   if (req.method === 'PATCH') {
      // There should be a pending request
      const pendingRequest = await prisma.connection_request.findFirst({
         where: {
            initiator_id: targetUserProfileId,
            requested_id: authUserProfileId,
            confirmed_at: null,
         },
      })
      if (!pendingRequest) {
         return res.status(500).json({
            message:
               'Invalidate request to connection api. No existing request to accept',
         })
      }
      // There should not be records in connection table
      const existingConnections = await prisma.connection.findMany({
         where: {
            OR: [
               {
                  user_profile_start: authUserProfileId,
                  user_profile_end: targetUserProfileId,
               },
               {
                  user_profile_start: targetUserProfileId,
                  user_profile_end: authUserProfileId,
               },
            ],
         },
      })
      if (existingConnections.length > 0) {
         return res.status(500).json({
            message:
               'Invalidate request to connection api. Connections between members already exist',
         })
      }

      // requestedOperation shouldn't be null
      if (
         !requestedOperation ||
         !['accept', 'reject'].includes(requestedOperation)
      ) {
         return res.status(500).json({
            message:
               'Invalidate request to connection api. requestedOperation not specified or is neither accept nor reject',
         })
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
         return res.status(200).json({ message: 'Connect Request Rejected' })
      }
   }

   // DELETE -- when connection was removed
   if (req.method === 'DELETE') {
   }

   // Handle any other HTTP method
   return res.status(200).json({ message: 'Nothing happened.' })
}

export default Connection

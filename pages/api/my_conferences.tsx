import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/react'

const MyConferences = async (req: NextApiRequest, res: NextApiResponse) => {
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

   const authUserProfileId = authUserProfileWithEmail.id

   // income Request should be stored as confState
   const confState = JSON.parse(req.body)
   try {
      await prisma.user_profile_to_conference_mapping.deleteMany({
         where: {
            user_profile_id: authUserProfileId,
            conference_id: {
               in: Object.keys(confState).map((key) => parseInt(key)),
            },
         },
      })

      await prisma.user_profile_to_conference_mapping.createMany({
         data: Object.keys(confState)
            .filter((key) => confState[key])
            .map((key) => ({
               user_profile_id: authUserProfileId,
               conference_id: parseInt(key),
            })),
      })
   } catch (error) {
      res.status(500).json({ message: error })
   }

   res.status(200).json({ message: 'Connect Request Sent' })
   return
}

export default MyConferences

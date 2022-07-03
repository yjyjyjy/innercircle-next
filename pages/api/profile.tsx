import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../lib/prisma'

const regex = /^[a-zA-Z0-9_]*$/

const Profile = async (req: NextApiRequest, res: NextApiResponse) => {
   const session = await getSession({ req })

   if (!session || !session.userID || !session.user?.email) {
      res.status(500).json({ message: 'Please log in first' })
      return
   }

   if (req.method === 'POST') {
      // adding email so the database constraint is satisfied
      const authUserEmail: string = session.user.email

      let payloadData = {
         ...JSON.parse(req.body),
         email: authUserEmail, // attach the curent user's email
      }

      const existingProfileWithEmail = await prisma.user_profile.findUnique({
         where: {
            email: authUserEmail,
         },
      })

      // clean up the payloadData handle
      payloadData = {
         ...payloadData,
         handle: payloadData.handle.replace(/\s/g, ''),
      }

      if (!payloadData.handle.match(regex)) {
         res.status(500).json({
            message: 'Handle can only contain a-z A-Z 0-9 or _',
         })
         return
      }

      const skills = Object.keys(payloadData).filter(
         (datakey) => payloadData[`${datakey}`] && datakey.startsWith('skill_')
      )
      const labels = Object.keys(payloadData).filter(
         (datakey) => payloadData[`${datakey}`] && datakey.startsWith('label_')
      )

      if (skills.length > 5) {
         res.status(500).json({
            message: 'Can only select up to 5 skills',
         })
         return
      }

      if (labels.length > 5) {
         res.status(500).json({
            message: 'Can only select up to 5 labels',
         })
         return
      }

      //Check if handle is already in use by other user
      const existingProfileWithHandle = await prisma.user_profile.findUnique({
         where: {
            handle: payloadData.handle.toLowerCase(),
         },
      })

      if (
         existingProfileWithHandle &&
         existingProfileWithHandle.email.toLowerCase() !==
         payloadData.email.toLowerCase()
      ) {
         res.status(500).json({
            message:
               'Profile handle has been taken. Please choose a different one.',
         })
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

export default Profile

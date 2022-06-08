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
      const payload_data = {
         ...JSON.parse(req.body),
         email: session.user.email, // attch the curent user's email
      }

      const existing_profile = await prisma.user_profile.findUnique({
         where: {
            email: session.user.email,
         },
      })

      //Create new profile if email is new
      if (!existing_profile) {
         //Check if handle is already in use by other user
         const handleTaken = await isHandleUnique(payload_data.handle)
         if (handleTaken) {
            res.status(500).json({
               message: 'Handle is already in use',
            })
            return
         }

         // create a profile
         await prisma.user_profile.create({
            data: payload_data,
         })
         res.status(200).json({ message: 'Profile successfully created!' })
      } else {
         //If user wants to change handle
         if (existing_profile?.handle !== payload_data.handle) {
            //Check new handle is unique
            const handleTaken = await isHandleUnique(payload_data.handle)
            if (handleTaken) {
               res.status(500).json({
                  message: 'Handle is already in use',
               })
               return
            }
         }

         await prisma.user_profile.update({
            where: {
               email: session.user.email,
            },
            data: payload_data,
         })
         res.status(200).json({ message: 'Profile successfully updated!' })
      }
   } else {
      // Handle any other HTTP method
      res.status(200).json({ message: 'Nothing happened.' })
   }
}

const isHandleUnique = async (handle: string): Promise<boolean> => {
   const usersWithHandle = await prisma.user_profile.count({
      where: {
         handle: handle,
      },
   })
   return usersWithHandle === 0 ? false : true
}

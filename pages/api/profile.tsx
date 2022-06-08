import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/react'

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
         id: userID,
      },
   })

   console.log('useruseruser', user)

   if (req.method === 'POST') {
      const { type } = req.headers
      // adding email so the database constraint is satisfied
      const payload_data = {
         ...JSON.parse(req.body),
         email: session.user.email,
      }
      if (type === 'create') {
         // Check that their handle is unique
         const handleTaken = await isHandleUnique(payload_data.handle)
         if (handleTaken) {
            res.status(500).json({ error: 'Create: Handle is already in use' })
            return
         }
         // Process a POST request
         await prisma.user_profile.create({
            data: payload_data,
         })
      } else {
         //If handle supplied in form is different to curernt handle, check that new handle is available
         const userProfile = await prisma.user_profile.findUnique({
            where: {
               email: session.user.email,
            },
         })
         //If user wants a new handle
         if (userProfile?.handle !== payload_data.handle) {
            //Check new handle is unique
            const handleTaken = await isHandleUnique(payload_data.handle)
            if (handleTaken) {
               res.status(500).json({
                  error: 'Update: Handle is already in use',
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
      }
      res.status(200).json({ message: 'Profile create/update successful' })
   } else {
      // Handle any other HTTP method
      res.status(200).json({ name: 'John Doe' })
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

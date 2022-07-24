import type { NextApiRequest, NextApiResponse } from 'next'

const Connection = async (req: NextApiRequest, res: NextApiResponse) => {
   const { userIdA, userIdB } = req.body
   const appId = process.env.SEND_BIRD_APP_ID
   if (!appId) {
      console.error('Send bird App Id not found')
   }
   // POST -- connection request
   if (req.method === 'POST') {
      // check if it's connecting your own.
      const body = {
         users: [`${userIdA}`, `${userIdA}`],
         // name: '<string>',
         // channel_url: '<string>',
         // cover_url: '<string>',
         // cover_file: '<binary>',
         // data: '<string>',
         is_distinct: true,
         is_ephemeral: true,
         // strict: '<boolean>',
         // invitation_status: ['<string>', '<string>'],
      }

      const response = await fetch(
         `https://api-${appId}.sendbird.com/v3/group_channels`,
         {
            method: 'post',
            // @ts-ignore
            body: body,
         }
      )
   }

   // DELETE -- when connection was removed
   if (req.method === 'DELETE') {
   }

   // Handle any other HTTP method
   return res.status(200).json({ message: 'Nothing happened.' })
}

export default Connection

import type { NextApiRequest, NextApiResponse } from 'next'

export interface user {
   id: string
   name: string
   profile_photo: string
}

const USER_ENDPOINT = process.env.SEND_BIRD_GROUP_CHANNEL_ENDPOINT!
const SEND_BIRD_GROUP_CHANNELS_ENDPOINT =
   process.env.SEND_BIRD_GROUP_CHANNEL_ENDPOINT!
const APP_ID = process.env.SEND_BIRD_APP_ID!

const SendBirdRequestHeader = {
   Accept: 'application/json',
   'Content-Type': 'application/json',
   'Api-Token': process.env.SEND_BIRD_API_TOKEN!,
}

const CreateConnectChat = async (req: NextApiRequest, res: NextApiResponse) => {
   const { userA, userB }: { userA: user; userB: user } = JSON.parse(req.body)

   if (!APP_ID) {
      console.error('Send bird App Id not found')
      return res.status(500).json('Direct Message App Id unavailable')
   }

   // POST -- connection request
   try {
      if (req.method === 'POST') {
         // Check if both users exists
         await createUserIfNonExistant(userA)
         await createUserIfNonExistant(userB)

         // Create the group channel
         await createGroupChannel(userA, userB)
      }

      // Handle any other HTTP method
      return res.status(200).json({
         message: `Group Channel Created between ${userA.id} and ${userB.id}`,
      })
   } catch (error) {
      return res.status(400).json({ message: error })
   }

   //TODO DELETE -- when connection was removed
   if (req.method === 'DELETE') {
   }
}

const createUserIfNonExistant = async (user: user) => {
   const userExistsRequest = `${USER_ENDPOINT}/${user.id}`
   let response: Response
   let sendBirdResponse
   try {
      // Check if usesr exists
      let response = await fetch(userExistsRequest, {
         method: 'get',
         headers: SendBirdRequestHeader,
      })
      sendBirdResponse = await response.json()
   } catch (error) {
      const errorMessage = `Failed to check if user ${user.id} exists: `
      console.error(`${errorMessage}`, error)
      throw new Error(errorMessage)
   }

   //Create User if doesn't exist
   if (
      sendBirdResponse.message.match(/"User" not found./) ||
      sendBirdResponse.code === 400201
   )
      try {
         {
            console.log(
               `Creating SendBird user for ${user.name} (id: ${user.id})`
            )
            response = await fetch(USER_ENDPOINT, {
               method: 'post',
               headers: SendBirdRequestHeader,
               body: JSON.stringify({
                  user_id: user.id,
                  nickname: user.name,
                  profile_url: user.profile_photo,
               }),
            })
            console.log(
               `Created SendBird user for ${user.name} (id: ${user.id})`
            )
         }
      } catch (error) {
         const errorMessage = `Failed to create user ${user.id}: `
         console.error(`${errorMessage}`, error)
         throw new Error(errorMessage)
      }
}

const createGroupChannel = async (userA: user, userB: user) => {
   try {
      const res = await fetch(SEND_BIRD_GROUP_CHANNELS_ENDPOINT, {
         method: 'post',
         headers: SendBirdRequestHeader,
         body: JSON.stringify({
            user_ids: [userA.id, userB.id],
            is_distinct: true,
         }),
      })
      const data = await res.json()
      console.log('Created Group Channel: ', data)
   } catch (error) {
      const errorMessage = `Failed to create group channel between ${userA.id} and ${userB.id}: `
      console.error(`${errorMessage}`, error)
      throw new Error(errorMessage)
   }
}

export default CreateConnectChat

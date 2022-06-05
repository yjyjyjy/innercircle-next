import { Flex, Text, Stack, Heading } from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import ProfilePicture from '../../components/profile/ProfilePicture'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { any } from 'prop-types'

// DB design:
// user to profile mapping should be many to one. Each log in creates a new user. But multiple users can be tied to the same profile.
// We will provide email log in and Google log in only. So they are both tied to email. and that will serve as a join key to find profiles.

// TODO
// 1. query the profiles table for the profile that is tied to the current logged in user.
// 2. create a profile if there is none. redirect to the profile editing page.
// 3. create the editing page. See design at page 1 in https://www.figma.com/file/Lkv9SVkA7wSKVYBEiMO5OI/Untitled?node-id=0%3A1
// 4. Auto save or submit to update the profile page in the backend.

interface ESession extends Session {
   userID: string
}

// server side data fetch
export async function getServerSideProps(context) {
   const session = (await getSession(context)) as ESession

   //If you haven't logged in, you can't view your profile
   // TODO This is not properly protected.
   if (!session) {
      return {
         props: {
            user: {},
         },
      }
   }

   const userID = session.userID
   console.log('session from my_profile: ', session)

   const user = await prisma.user.findUnique({
      where: {
         id: userID
      },
      include: {
         user_to_user_profile_mapping: {
            include: {
               user_profile: true
            }
         }
      }
   })

   return {
      props: {
         user: user,
      },
   }
}

const User = ({ user }) => {
   const {
      id,
      name,
      email,
      emailVerified,
      image,
      user_to_user_profile_mapping
   } = user

   type Profile = {
      handle: string
      , profile_name: string
      , twitter: string
      , linkedin: string
      , bio: string
      , look_for: string
      , skills: string
      , hiring: boolean
      , open_to_work: boolean
      , open_to_invest: boolean
      , on_core_team: boolean
      , profile_picture: string
      , resume: string
   }

   let profile = {}
   if (user_to_user_profile_mapping && user_to_user_profile_mapping.lenghth > 0) {
      profile = user_to_user_profile_mapping[0]
   }



   return (
      <Stack direction={'row'} maxW={'100%'}>
         <Stack direction={'column'} p={5}>
            <ProfilePicture image_url={image} />
            {/* <Flex ml={3} direction="column">
               <Heading as={'h2'}>
                  {profile_name} ({handle})
               </Heading>
               <Text fontSize={15} pt={2}>
                  {email} | {twitter} | {linkedin}
               </Text>
               <Text fontSize={15} pt={2}>
                  {bio}
               </Text>
            </Flex> */}
         </Stack>
      </Stack>
   )
}

export default User

import { Flex, Text, Stack, Heading } from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import ProfilePicture from '../../components/profile/ProfilePicture'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'

interface ESession extends Session {
   userID: string
}

type EGetSession = ESession | null

// server side data fetch
export async function getServerSideProps(context) {
   console.log('On My Profile')

   const session = (await getSession(context)) as EGetSession
   console.log('session from my_profile: ', session)

   //If you haven't logged in, you can't view your profile
   if (!session) {
      return {
         props: {
            users: [],
         },
      }
   }

   const userID = session.userID ? session.userID : ''
   console.log('session from my_profile: ', session)

   const user = await prisma.user_profile.findUnique({
      where: {
         user_id: userID,
      },
   })

   return {
      props: {
         user: user,
      },
   }
}

const User = ({ user }) => {
   const {
      user_id,
      handle,
      profile_name,
      email,
      twitter,
      linkedin,
      bio,
      look_for,
      skills,
      hiring,
      open_to_work,
      on_core_team,
      open_to_invest,
      profile_picture,
      resume,
   } = user

   return (
      <Stack direction={'column'} maxW={'100%'}>
         <Flex h="120px" w="100%" direction={'row'} p={5}>
            <ProfilePicture image_url={profile_picture} />
            <Flex ml={3} direction="column">
               <Heading as={'h2'}>
                  {profile_name} ({handle})
               </Heading>
               <Text fontSize={15} pt={2}>
                  {email} | {twitter} | {linkedin}
               </Text>
               <Text fontSize={15} pt={2}>
                  {bio}
               </Text>
            </Flex>
         </Flex>
      </Stack>
   )
}

export default User

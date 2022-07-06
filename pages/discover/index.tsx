import { Session } from 'next-auth'
import prisma from '../../lib/prisma'
import { getSession, useSession } from 'next-auth/react'
import AuthenticatedUser from '../../components/AuthenticatedUser'
import { UserProfileWithMetaData } from '../../components/profile/MemberProfileCard'
import Spinner from '../../components/Spinner'

export interface ESession extends Session {
   userID: string
}

export async function getServerSideProps(context) {
   // If you haven't logged in, you can't use the tool yet.
   // TODO can look to use getSession on client side instead, as its not intended for server time. Its known to be slow
   const session = (await getSession(context)) as ESession

   // if (!session) {
   //    return {
   //       redirect: {
   //          permanent: false,
   //          destination: '/',
   //       },
   //    }
   // }

   // If userID doesn't have a userprofile redirect
   let authUserWithProfile
   if (session) {
      authUserWithProfile = await prisma.user.findUnique({
         where: { id: session.userID },
         include: { user_profile: true },
      })
   }

   if (authUserWithProfile?.id && !authUserWithProfile.user_profile?.handle) {
      return {
         redirect: {
            permanent: false,
            destination: '/profile/my_profile',
         },
      }
   }

   // Can be statically generated
   const profiles: UserProfileWithMetaData[] =
      await prisma.user_profile.findMany({
         include: {
            user_profile_to_conference_mapping: {
               include: { conference: true },
            },
            connection_connection_user_profile_startTouser_profile: true,
            connection_request_connection_request_requested_idTouser_profile:
               true,
         },
      })

   // Can be statically generated
   const conferences = await prisma.conference.findMany({
      where: {
         end_date: { gte: new Date() },
      },
      orderBy: { start_date: 'asc' },
      take: 6,
   })

   // Attaching the current user's profile id to 'authUserProfileId' field so the profile card component know who is logged in.
   const profilesWithAuthUserProfileId = profiles.map((p) => {
      p['authUserProfileId'] = authUserWithProfile?.user_profile?.id
      return p
   })

   return {
      props: {
         userProfiles: JSON.parse(
            JSON.stringify(profilesWithAuthUserProfileId)
         ),
         conferences: JSON.parse(JSON.stringify(conferences)),
      },
   }
}

const Home = ({ userProfiles, conferences }) => {
   const { status } = useSession()

   switch (status) {
      case 'loading':
         return <Spinner />
      default:
         return (
            <AuthenticatedUser
               conferences={conferences}
               userProfiles={userProfiles}
            />
         )
   }
}

export default Home
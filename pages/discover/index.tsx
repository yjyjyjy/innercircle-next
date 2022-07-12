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
   const profiles =
      await prisma.user_profile.findMany({
         select: {
            id: true,
            user_id: true,
            handle: true,
            profile_name: true,
            bio_short: true,
            bio: true,
            label_hiring: true,
            label_open_to_work: true,
            label_open_to_cofounder_matching: true,
            label_need_product_feedback: true,
            label_open_to_discover_new_project: true,
            label_fundraising: true,
            label_open_to_invest: true,
            label_on_core_team: true,
            label_text_hiring: true,
            label_text_open_to_work: true,
            label_text_open_to_discover_new_project: true,
            skill_founder: true,
            skill_web3_domain_expert: true,
            skill_artist: true,
            skill_frontend_eng: true,
            skill_backend_eng: true,
            skill_fullstack_eng: true,
            skill_blockchain_eng: true,
            skill_data_eng: true,
            skill_data_science: true,
            skill_hareware_dev: true,
            skill_game_dev: true,
            skill_dev_ops: true,
            skill_product_manager: true,
            skill_product_designer: true,
            skill_token_designer: true,
            skill_technical_writer: true,
            skill_social_media_influencer: true,
            skill_i_bring_capital: true,
            skill_community_manager: true,
            skill_marketing_growth: true,
            skill_business_development: true,
            skill_developer_relations: true,
            skill_influencer_relations: true,
            skill_investor_relations: true,
            user_profile_to_conference_mapping: {
               select: { conference: true }
            },
            connection_connection_user_profile_startTouser_profile: true,
            connection_request_connection_request_requested_idTouser_profile: true,
         },
      })

   // Can be statically generated
   const conferences = await prisma.conference.findMany({
      where: {
         end_date: { gte: new Date() },
      },
      orderBy: { start_date: 'asc' },
      take: 8,
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

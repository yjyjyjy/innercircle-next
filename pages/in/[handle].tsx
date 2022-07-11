import { Center } from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import { GetServerSideProps } from 'next'
import MemberProfileCard from '../../components/profile/MemberProfileCard'

// server side data fetch
export const getServerSideProps: GetServerSideProps = async (context) => {
   const { handle } = context.query
   const user_profile = await prisma.user_profile.findFirst({
      where: {
         handle: {
            equals: handle as string,
            mode: 'insensitive'
         }
      },
      select: {
         id: true,
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
      }
   })
   return {
      props: {
         user_profile: JSON.parse(JSON.stringify(user_profile)),
      },
   }
}

const User = ({ user_profile }) => {
   return (
      <Center>
         {user_profile && (
            <MemberProfileCard userProfile={user_profile} mini={false} />
         )}
      </Center>
   )
}

export default User

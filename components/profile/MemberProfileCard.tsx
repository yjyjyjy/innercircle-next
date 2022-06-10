import {
   Box,
   Flex,
   Text,
   Image,
   Button,
   IconButton,
   Tag,
   Stack,
   TagLeftIcon,
   TagLabel,
} from '@chakra-ui/react'
import React from 'react'
import ProfilePicture from './ProfilePicture'
import { AiOutlineMail } from 'react-icons/ai'
import { user_profile as UserProfile } from '@prisma/client'

export interface Conference {
   id: number,
   year: number,
   conference_name: string,
   location: string,
   start_date: Date,
   end_date: Date
}

type Props = {
   user_profile: UserProfile
}

const MemberProfileCard: React.FC<Props> = ({ user_profile }) => {
   const {
      handle,
      profile_name,
      profile_picture,
      twitter,
      linkedin,
      bio_short,
      bio,
      label_hiring,
      label_open_to_work,
      label_open_to_cofounder_matching,
      label_need_product_feedback,
      label_open_to_discover_new_project,
      label_fundraising,
      label_open_to_invest,
      label_on_core_team,
      label_text_hiring,
      label_text_open_to_work,
      label_text_open_to_discover_new_project,
      skill_founder,
      skill_web3_domain_expert,
      skill_artist,
      skill_frontend_eng,
      skill_backend_eng,
      skill_fullstack_eng,
      skill_blockchain_eng,
      skill_data_eng,
      skill_data_science,
      skill_hareware_dev,
      skill_game_dev,
      skill_dev_ops,
      skill_product_manager,
      skill_product_designer,
      skill_token_designer,
      skill_technical_writer,
      skill_social_media_influencer,
      skill_i_bring_capital,
      skill_community_manager,
      skill_marketing_growth,
      skill_business_development,
      skill_developer_relations,
      skill_influencer_relations,
      skill_investor_relations,
   } = user_profile

   const tagTextMapping = {
      label_hiring: "I'm hiring",
      label_open_to_work: 'Open to work',
      label_open_to_cofounder_matching: 'Cofounder Searching',
      label_need_product_feedback: 'Need Feedback',
      label_open_to_discover_new_project: 'Discovering',
      label_fundraising: 'Fundraising',
      label_open_to_invest: 'Open To Invest',
      label_on_core_team: 'On Core Team',
      skill_founder: 'Founder',
      skill_web3_domain_expert: 'Web3 Expert',
      skill_artist: 'Artist',
      skill_frontend_eng: 'Frontend Eng',
      skill_backend_eng: 'Backend Eng',
      skill_fullstack_eng: 'Full Stack Eng',
      skill_blockchain_eng: 'Blockchain Eng',
      skill_data_eng: 'Data Eng',
      skill_data_science: 'Data Scientist',
      skill_game_dev: 'Game Dev',
      skill_dev_ops: 'DevOps Eng',
      skill_product_manager: 'Prod Mgr.',
      skill_product_designer: 'Prod Designer',
      skill_token_designer: 'Token Designer',
      skill_technical_writer: 'Technical Writer',
      skill_social_media_influencer: 'Social Influencer',
      skill_i_bring_capital: 'I Bring Capital',
      skill_community_manager: 'Community Mgr.',
      skill_marketing_growth: 'Marketing/Growth',
      skill_business_development: 'Biz Dev',
      skill_developer_relations: 'Dev Relations',
      skill_influencer_relations: 'Influencer Relations',
      skill_investor_relations: 'Investor Relations',
   }

   const ProfileTag: React.FC<{ dataKey: string }> = ({ dataKey }) => (
      <Tag
         size={'lg'}
         bgGradient={
            dataKey.startsWith('skill_')
               ? 'linear(to-l, #4292ff,  #177aff)'
               : 'linear(to-l, #d83f91, #ae4bb8)'
         }
         variant={'solid'}
         m={1}
      >
         <TagLabel>{tagTextMapping[dataKey]}</TagLabel>
      </Tag>
   )

   return (
      <Stack
         direction={'column'}
         p={6}
         maxW={'450px'}
         maxH={'1100px'}
         boxShadow={'xl'}
         rounded={'lg'}
      >
         <ProfilePicture
            image_url={
               'https://en.gravatar.com/userimage/67165895/bd41f3f601291d2f313b1d8eec9f8a4d.jpg?size=200'
            }
         />
         <Flex direction={'row'} pt={4}>
            <Flex direction={'column'} w="60%" overflow={'hidden'}>
               <Text fontSize={'xl'} fontWeight={'bold'}>
                  {profile_name}
               </Text>
               <Text fontSize={'sm'}>@{handle}</Text>
            </Flex>
            <Tag variant={'outline'}>
               <TagLeftIcon as={AiOutlineMail} />
               <TagLabel>Message</TagLabel>
            </Tag>
         </Flex>
         <Text fontWeight="bold">{bio_short}</Text>
         <Text>{bio}</Text>
         <Text fontWeight={'bold'}>I need:</Text>
         <Flex direction={'row'} wrap={'wrap'}>
            {Object.keys(tagTextMapping)
               .filter((dataKey) => dataKey.startsWith('label_'))
               .map((dataKey) =>
                  user_profile[dataKey] ? (
                     <ProfileTag key={dataKey} dataKey={dataKey} />
                  ) : undefined
               )}
         </Flex>
         <Text fontWeight={'bold'}>I can offer:</Text>
         <Flex direction={'row'} wrap={'wrap'}>
            {Object.keys(tagTextMapping)
               .filter((dataKey) => dataKey.startsWith('skill_'))
               .map((dataKey) =>
                  user_profile[dataKey] ? (
                     <ProfileTag key={dataKey} dataKey={dataKey} />
                  ) : undefined
               )}
         </Flex>
         <Text fontWeight={'bold'}>You may find me at:</Text>
         <Flex direction={'row'} wrap={'wrap'}>
            {/* <Text>{user_profile_to_conference_mapping && user_profile_to_conference_mapping.length.toString()}</Text> */}
         </Flex>
      </Stack >
   )
}

export default MemberProfileCard

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
   useToast,
   useMediaQuery,
} from '@chakra-ui/react'
import React from 'react'
import ProfilePicture from './ProfilePicture'
import { AiOutlineMail } from 'react-icons/ai'
import { user_profile as UserProfile, user_profile_to_conference_mapping as UserProfileToConferenceMapping, conference as Conference } from '@prisma/client'
import { useRouter } from 'next/router'
import { UserProfileWithMetaData } from './MemberProfileCard'


type Props = {
   user_profile: UserProfileWithMetaData,
   primaryLabel?: string,
   primaryOnClick?: any,
   secondaryLabel?: string,
   secondaryOnClick?: any,
}



const MemberProfileListItem: React.FC<Props> = ({ user_profile, primaryLabel, primaryOnClick, secondaryLabel, secondaryOnClick }) => {
   const router = useRouter()
   const [isDesktop] = useMediaQuery('(min-width: 1290px)')
   const {
      id,
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
      user_profile_to_conference_mapping,
   } = user_profile
   return (
      <Flex
         direction={'row'}
         py={2}
         px={isDesktop ? 4 : 1}
         w={'100%'}
         maxH={'800px'}
         borderTop={1}
         bg='gray.50'
         justifyContent={'space-between'}
         borderStyle={'solid'}
         borderColor={'gray.100'}
         _hover={{ cursor: 'pointer' }}
      >
         <Flex
            direction={'row'}
            onClick={
               () => router.push(`/in/${handle}`)}
            mr={'7px'}
            w={'100%'}
         >
            <Flex direction={'column'} display={''}>
               <Text fontWeight={'bold'} noOfLines={1}>
                  {profile_name}
               </Text>
               <Text noOfLines={1}>{bio_short}</Text>
            </Flex>
         </Flex>
         <Flex direction={'row'} transform={isDesktop ? "translateY(10%)" : "translateY(20%)"}>
            {secondaryLabel && secondaryOnClick &&
               <Button
                  variant={'ghost'}
                  size={isDesktop ? 'md' : 'sm'}
                  onClick={secondaryOnClick}
               >{secondaryLabel}</Button>
            }
            {primaryLabel && primaryOnClick &&
               <Button
                  colorScheme={'twitter'}
                  rounded={'3xl'}
                  size={isDesktop ? 'md' : 'sm'}
                  onClick={primaryOnClick}
               >{primaryLabel}</Button>
            }
         </Flex>
         {/* <ProfilePicture
            image_url={
               'https://en.gravatar.com/userimage/67165895/bd41f3f601291d2f313b1d8eec9f8a4d.jpg?size=200'
            }
         /> */}
      </Flex >

   )
}

export default MemberProfileListItem

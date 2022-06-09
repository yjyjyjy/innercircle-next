import {
   Flex,
   Text,
   Stack,
   FormControl,
   FormLabel,
   Input,
   Textarea,
   Button,
   Checkbox,
   Grid,
   GridItem,
   Center,
   useMediaQuery,
   useToast,
} from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/react'

import { User, user_profile as UserProfile } from '@prisma/client'
import { useState } from 'react'
import MemberProfileCard, {
   UserProfileData,
} from '../../components/profile/MemberProfileCard'
import { ESession } from '../index'

// DB design:
// user to profile mapping should be many to one. Each log in creates a new user. But multiple users can be tied to the same profile.
// We will provide email log in and Google log in only. So they are both tied to email. and that will serve as a join key to find profiles.

// TODO

// P0
// check handle against special chars (FE and BE) (1)
// handle, Name, bio, bio_short length (1)
// Super power count (FE, BE) (1)
// Conference tags (FE, BE) (3)
// Discovery Filters (3)
// Email sign up (2)
// I offer / I need (.1)
// Headers and Nav (.5)
// Messaging (10)

// P1
// Mini profile vs. full profile (2)
// Implement Auto Save an more obvious Save button (.5)
// Social Links: input txt box. regex check. show logo in Profile (3)
// Wallet connection (2)
// Search (Elastic Search and it's database) (10)
// Image Uploader (5)

// P2
// Pagination
// Performance diagnositic tool
// Client Side Rendering

// Done
// Auth Guard FE and BE

// server side data fetch
export async function getServerSideProps(context) {
   const session = (await getSession(context)) as ESession

   //If you haven't logged in, you can't view your profile
   if (!session) {
      return {
         redirect: {
            permanent: false,
            destination: '/',
         },
         props: {},
      }
   }

   // current logged in user's id
   const userID = session.userID

   const user = await prisma.user.findUnique({
      where: {
         id: userID,
      },
      include: {
         user_profile: true,
      },
   })

   return {
      props: {
         user: JSON.parse(JSON.stringify(user)),
      },
   }
}

type UserJoinUserProfile = User & {
   user_profile: UserProfile | null
}

const MyProfile = ({ user }: { user: UserJoinUserProfile }) => {
   const { id, name, email, emailVerified, image, user_profile } = user

   // initializing formData which will be binded to the the form
   const [formData, setFormData] = useState<UserProfileData>({
      profile_name: user_profile?.profile_name
         ? user_profile.profile_name
         : name
         ? name
         : '',
      handle: user_profile?.handle ? user_profile.handle : '',
      bio_short: user_profile?.bio_short ? user_profile?.bio_short : '',
      bio: user_profile?.bio ? user_profile.bio : '',
      label_hiring: user_profile?.label_hiring
         ? user_profile?.label_hiring
         : false,
      label_open_to_work: user_profile?.label_open_to_work
         ? user_profile?.label_open_to_work
         : false,
      label_open_to_cofounder_matching:
         user_profile?.label_open_to_cofounder_matching
            ? user_profile.label_open_to_cofounder_matching
            : false,
      label_need_product_feedback: user_profile?.label_need_product_feedback
         ? user_profile.label_need_product_feedback
         : false,
      label_open_to_discover_new_project:
         user_profile?.label_open_to_discover_new_project
            ? user_profile.label_open_to_discover_new_project
            : false,
      label_fundraising: user_profile?.label_fundraising
         ? user_profile.label_fundraising
         : false,
      label_open_to_invest: user_profile?.label_open_to_invest
         ? user_profile.label_open_to_invest
         : false,
      label_on_core_team: user_profile?.label_on_core_team
         ? user_profile.label_on_core_team
         : false,
      skill_founder: user_profile?.skill_founder
         ? user_profile.skill_founder
         : false,
      skill_web3_domain_expert: user_profile?.skill_web3_domain_expert
         ? user_profile.skill_web3_domain_expert
         : false,
      skill_artist: user_profile?.skill_artist
         ? user_profile.skill_artist
         : false,
      skill_frontend_eng: user_profile?.skill_frontend_eng
         ? user_profile.skill_frontend_eng
         : false,
      skill_backend_eng: user_profile?.skill_backend_eng
         ? user_profile.skill_backend_eng
         : false,
      skill_fullstack_eng: user_profile?.skill_fullstack_eng
         ? user_profile.skill_fullstack_eng
         : false,
      skill_blockchain_eng: user_profile?.skill_blockchain_eng
         ? user_profile.skill_blockchain_eng
         : false,
      skill_data_eng: user_profile?.skill_data_eng
         ? user_profile.skill_data_eng
         : false,
      skill_data_science: user_profile?.skill_data_science
         ? user_profile.skill_data_science
         : false,
      skill_hareware_dev: user_profile?.skill_hareware_dev
         ? user_profile.skill_hareware_dev
         : false,
      skill_game_dev: user_profile?.skill_game_dev
         ? user_profile.skill_game_dev
         : false,
      skill_dev_ops: user_profile?.skill_dev_ops
         ? user_profile.skill_dev_ops
         : false,
      skill_product_manager: user_profile?.skill_product_manager
         ? user_profile.skill_product_manager
         : false,
      skill_product_designer: user_profile?.skill_product_designer
         ? user_profile.skill_product_designer
         : false,
      skill_token_designer: user_profile?.skill_token_designer
         ? user_profile.skill_token_designer
         : false,
      skill_technical_writer: user_profile?.skill_technical_writer
         ? user_profile.skill_technical_writer
         : false,
      skill_social_media_influencer: user_profile?.skill_social_media_influencer
         ? user_profile.skill_social_media_influencer
         : false,
      skill_i_bring_capital: user_profile?.skill_i_bring_capital
         ? user_profile.skill_i_bring_capital
         : false,
      skill_community_manager: user_profile?.skill_community_manager
         ? user_profile.skill_community_manager
         : false,
      skill_marketing_growth: user_profile?.skill_marketing_growth
         ? user_profile.skill_marketing_growth
         : false,
      skill_business_development: user_profile?.skill_business_development
         ? user_profile.skill_business_development
         : false,
      skill_developer_relations: user_profile?.skill_developer_relations
         ? user_profile.skill_developer_relations
         : false,
      skill_influencer_relations: user_profile?.skill_influencer_relations
         ? user_profile.skill_influencer_relations
         : false,
      skill_investor_relations: user_profile?.skill_investor_relations
         ? user_profile.skill_investor_relations
         : false,
   })

   const onSubmitHandler = (e) => {
      e.preventDefault()
      createOrUpdateUserProfile(formData)
   }

   const toast = useToast()
   const createOrUpdateUserProfile = async (formData) => {
      const res = await fetch('/api/profile', {
         method: 'POST',
         body: JSON.stringify(formData),
      })
      const { message } = await res.json()
      toast({
         title: message,
         status: res.status === 200 ? 'success' : 'error',
         duration: 4000,
         isClosable: true,
      })
   }

   const onChangeHandler = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
   }

   const onBooleanChangeHandler = (e) => {
      console.log(e.target.name)
      console.log(formData[e.target.name])
      setFormData({ ...formData, [e.target.name]: !formData[e.target.name] })
   }

   const onSkillCheckBoxChangeHandler = (dataKey: string) => {
      setFormData({ ...formData, [dataKey]: !formData[dataKey] })
   }

   const OpenToCheckBox: React.FC<{ dataKey: string; text: string }> = ({
      dataKey,
      text,
   }) => {
      return (
         <Checkbox
            p={1}
            isChecked={formData[dataKey]}
            name={dataKey}
            onChange={onBooleanChangeHandler}
         >
            {text}
         </Checkbox>
      )
   }

   const SkillCheckBox: React.FC<{
      dataKey: string
      skill_text: string
   }> = ({ dataKey, skill_text }) => {
      return (
         <GridItem
            h={'50px'}
            onClick={() => onSkillCheckBoxChangeHandler(dataKey)}
         >
            <Center
               borderWidth={'1px'}
               borderRadius="md"
               overflow={'hidden'}
               borderColor="blue.300"
               w={'100%'}
               h={'100%'}
               bg={formData[dataKey] ? 'blue.300' : 'white'}
               _hover={{ cursor: 'pointer' }}
            >
               <Text
                  color={formData[dataKey] ? 'white' : 'blue.300'}
                  fontSize={'md'}
                  fontWeight={'medium'}
               >
                  {skill_text}
               </Text>
            </Center>
         </GridItem>
      )
   }

   const [isLargerThan1280] = useMediaQuery('(min-width: 1290px)')

   return (
      <Stack direction={isLargerThan1280 ? 'row' : 'column'} maxW={'100%'}>
         <Stack
            direction={'column'}
            py={10}
            w={isLargerThan1280 ? '60%' : '100%'}
         >
            <form onSubmit={onSubmitHandler}>
               <Flex direction={'column'} fontWeight="bold">
                  <FormControl isRequired maxW={'450px'} pt={3}>
                     <FormLabel fontSize={'lg'} fontWeight={'bold'}>
                        Name
                     </FormLabel>
                     <Input
                        value={formData.profile_name}
                        name="profile_name"
                        placeholder="Gavin Belson or ethtomato"
                        onChange={(e) => onChangeHandler(e)}
                     />
                  </FormControl>
                  <FormControl isRequired maxW={'450px'} pt={3}>
                     <FormLabel fontSize={'lg'} fontWeight={'bold'}>
                        Choose a profile handle (your profile url)
                     </FormLabel>
                     <Input
                        value={formData.handle}
                        placeholder="handle"
                        name="handle"
                        onChange={(e) => onChangeHandler(e)}
                     />
                     {/* <Input placeholder='Community Manager @ Hooli Protocol' /> */}
                  </FormControl>
                  <FormControl isRequired maxW={'450px'} pt={3}>
                     <FormLabel fontSize={'lg'} fontWeight={'bold'}>
                        Your one-liner intro
                     </FormLabel>
                     <Input
                        value={formData.bio_short}
                        placeholder="co-founder & CEO @ hoolie; billionaire"
                        name="bio_short"
                        onChange={(e) => onChangeHandler(e)}
                     />
                     {/* <Input placeholder='Community Manager @ Hooli Protocol' /> */}
                  </FormControl>
                  <FormControl pt={3}>
                     <FormLabel fontSize={'lg'} fontWeight={'bold'}>
                        Bio & what you are looking for
                     </FormLabel>
                     <Textarea
                        value={formData.bio}
                        name="bio"
                        onChange={(e) => onChangeHandler(e)}
                     />
                  </FormControl>
                  <Flex direction={'column'} maxW={'400px'}>
                     <Text fontSize={'lg'} fontWeight="bold" py={4}>
                        How innerCircle community can help you?
                     </Text>
                     <OpenToCheckBox dataKey="label_hiring" text="I'm hiring" />
                     <OpenToCheckBox
                        dataKey="label_open_to_work"
                        text="Open to work"
                     />
                     <OpenToCheckBox
                        dataKey="label_open_to_cofounder_matching"
                        text="Cofounder searching"
                     />
                     <OpenToCheckBox
                        dataKey="label_need_product_feedback"
                        text="Need feedback on my product"
                     />
                     <OpenToCheckBox
                        dataKey="label_open_to_discover_new_project"
                        text="Open to discover new project"
                     />
                     <OpenToCheckBox
                        dataKey="label_fundraising"
                        text="Fundraising"
                     />
                     <OpenToCheckBox
                        dataKey="label_open_to_invest"
                        text="Want to invest"
                     />
                     <OpenToCheckBox
                        dataKey="label_on_core_team"
                        text="I'm on a web3 core team"
                     />
                  </Flex>
                  <Flex direction={'column'} py={3}>
                     <Text fontSize={'lg'} fontWeight="bold" py={4}>
                        What are your super powers? (up to 5)
                     </Text>
                     <Grid
                        templateColumns={
                           isLargerThan1280
                              ? 'repeat(3, 1fr)'
                              : 'repeat(2, 1fr)'
                        }
                        gap={3}
                     >
                        <SkillCheckBox
                           dataKey="skill_founder"
                           skill_text="Founder"
                        />
                        <SkillCheckBox
                           dataKey="skill_web3_domain_expert"
                           skill_text="Web3 Domain Expert"
                        />
                        <SkillCheckBox
                           dataKey="skill_artist"
                           skill_text="Artist"
                        />
                        <SkillCheckBox
                           dataKey="skill_frontend_eng"
                           skill_text="Frontend Eng"
                        />
                        <SkillCheckBox
                           dataKey="skill_backend_eng"
                           skill_text="Backend Eng"
                        />
                        <SkillCheckBox
                           dataKey="skill_fullstack_eng"
                           skill_text="Full Stack Eng"
                        />
                        <SkillCheckBox
                           dataKey="skill_blockchain_eng"
                           skill_text="Blockchain Dev"
                        />
                        <SkillCheckBox
                           dataKey="skill_data_eng"
                           skill_text="Data Eng"
                        />
                        <SkillCheckBox
                           dataKey="skill_data_science"
                           skill_text="Data Scientist"
                        />
                        <SkillCheckBox
                           dataKey="skill_game_dev"
                           skill_text="Game Dev"
                        />
                        <SkillCheckBox
                           dataKey="skill_dev_ops"
                           skill_text="Dev Ops"
                        />
                        <SkillCheckBox
                           dataKey="skill_product_manager"
                           skill_text="Product Manager"
                        />
                        <SkillCheckBox
                           dataKey="skill_product_designer"
                           skill_text="Product Designer"
                        />
                        <SkillCheckBox
                           dataKey="skill_token_designer"
                           skill_text="Token Designer"
                        />
                        <SkillCheckBox
                           dataKey="skill_technical_writer"
                           skill_text="Technical Writer"
                        />
                        <SkillCheckBox
                           dataKey="skill_social_media_influencer"
                           skill_text="Influencer (w/ audience)"
                        />
                        <SkillCheckBox
                           dataKey="skill_i_bring_capital"
                           skill_text="I bring capital"
                        />
                        <SkillCheckBox
                           dataKey="skill_community_manager"
                           skill_text={
                              isLargerThan1280
                                 ? 'Community Manager'
                                 : 'Community Mgr.'
                           }
                        />
                        <SkillCheckBox
                           dataKey="skill_marketing_growth"
                           skill_text="Marketing/Growth"
                        />
                        <SkillCheckBox
                           dataKey="skill_marketing_growth"
                           skill_text="Biz Development"
                        />
                        <SkillCheckBox
                           dataKey="skill_developer_relations"
                           skill_text="Developer Relations"
                        />
                        <SkillCheckBox
                           dataKey="skill_influencer_relations"
                           skill_text="Influencer relations"
                        />
                        <SkillCheckBox
                           dataKey="skill_investor_relations"
                           skill_text="Investor relations"
                        />
                     </Grid>
                  </Flex>
                  <Button colorScheme="blue" type="submit" w={100} mt={3}>
                     Save
                  </Button>
               </Flex>
            </form>
         </Stack>
         <Stack
            direction={'column'}
            p={5}
            w={isLargerThan1280 ? '40%' : '100%'}
         >
            <Text fontSize={'lg'} fontWeight="bold">
               Profile Preview
            </Text>
            <MemberProfileCard user_profile={formData} />
         </Stack>
      </Stack>
   )
}

export default MyProfile

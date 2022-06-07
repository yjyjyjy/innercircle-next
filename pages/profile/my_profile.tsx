import { Flex, Text, Stack, Heading, FormControl, FormLabel, Input, Textarea, Button, Checkbox, Grid, GridItem, Center, useMediaQuery } from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import ProfilePicture from '../../components/profile/ProfilePicture'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { User, user_profile as UserProfile } from '@prisma/client'
import default_gray from '../../public/default_gray.png'
import { useEffect, useState } from 'react'
import MemberProfileCard, { UserProfileData } from '../../components/profile/MemberProfileCard'



// DB design:
// user to profile mapping should be many to one. Each log in creates a new user. But multiple users can be tied to the same profile.
// We will provide email log in and Google log in only. So they are both tied to email. and that will serve as a join key to find profiles.

// TODO
// Auth Guard FE and BE
// Headers and Nav
// Image Uploader
// check handle against special chars (FE and BE)
// handle, Name, bio length
// Super power count
// Implement Auto Save an more obvious Save button
// Social Links
// Discovery
// Search


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

   const userID = session.userID // current logged in user's id

   const user = await prisma.user.findUnique({
      where: {
         id: userID
      },
      include: {
         user_profile: true
      }
   })
   return {
      props: {
         user: user,
      },
   }
}

type UserJoinUserProfile = (User & {
   user_profile: UserProfile | null;
})

const User = ({ user }: { user: UserJoinUserProfile }) => {
   const {
      id,
      name,
      email,
      emailVerified,
      image,
      user_profile
   } = user

   // initializing formData which will be binded to the the form
   const [formData, setFormData] = useState<UserProfileData>({
      profile_name: user_profile?.profile_name ? user_profile.profile_name : name ? name : '',
      handle: user_profile?.handle ? user_profile.handle : '',
      bio: user_profile?.bio ? user_profile.bio : '',
      hiring: user_profile?.hiring ? user_profile?.hiring : false,
      open_to_work: user_profile?.open_to_work ? user_profile?.open_to_work : false,
      open_to_cofounder_matching: user_profile?.open_to_cofounder_matching ? user_profile.open_to_cofounder_matching : false,
      open_to_product_feedback: user_profile?.open_to_product_feedback ? user_profile.open_to_product_feedback : false,
      fundraising: user_profile?.fundraising ? user_profile.fundraising : false,
      open_to_invest: user_profile?.open_to_invest ? user_profile.open_to_invest : false,
      on_core_team: user_profile?.on_core_team ? user_profile.on_core_team : false,
      skill_founder: user_profile?.skill_founder ? user_profile.skill_founder : false,
      skill_frontend_eng: user_profile?.skill_frontend_eng ? user_profile.skill_frontend_eng : false,
      skill_backend_eng: user_profile?.skill_backend_eng ? user_profile.skill_backend_eng : false,
      skill_fullstack_eng: user_profile?.skill_fullstack_eng ? user_profile.skill_fullstack_eng : false,
      skill_blockchain_eng: user_profile?.skill_blockchain_eng ? user_profile.skill_blockchain_eng : false,
      skill_data_eng: user_profile?.skill_data_eng ? user_profile.skill_data_eng : false,
      skill_game_dev: user_profile?.skill_game_dev ? user_profile.skill_game_dev : false,
      skill_dev_ops: user_profile?.skill_dev_ops ? user_profile.skill_dev_ops : false,
      skill_product_manager: user_profile?.skill_product_manager ? user_profile.skill_product_manager : false,
      skill_product_designer: user_profile?.skill_product_designer ? user_profile.skill_product_designer : false,
      skill_token_designer: user_profile?.skill_token_designer ? user_profile.skill_token_designer : false,
      skill_technical_writer: user_profile?.skill_technical_writer ? user_profile.skill_technical_writer : false,
      skill_project_launch: user_profile?.skill_project_launch ? user_profile.skill_project_launch : false,
      skill_people_connector: user_profile?.skill_people_connector ? user_profile.skill_people_connector : false,
      skill_community_manager: user_profile?.skill_community_manager ? user_profile.skill_community_manager : false,
      skill_marketing_growth: user_profile?.skill_marketing_growth ? user_profile.skill_marketing_growth : false,
      skill_developer_relations: user_profile?.skill_developer_relations ? user_profile.skill_developer_relations : false,
      skill_influencer_relations: user_profile?.skill_influencer_relations ? user_profile.skill_influencer_relations : false,
      skill_investor_relations: user_profile?.skill_investor_relations ? user_profile.skill_investor_relations : false,
   })

   const onSubmitHandler = (e) => {
      e.preventDefault();
      createOrUpdateUserProfile(formData);
   }

   const createOrUpdateUserProfile = (formData) => {
      fetch('/api/profile', {
         method: 'POST',
         body: JSON.stringify(formData)
      })
         .then((res) => res.json())
         .then((data) => {
            console.log(data)
         })
   }

   const onChangeHandler = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const onBooleanChangeHandler = (e) => {
      console.log(e.target.name)
      console.log(formData[e.target.name])
      setFormData({ ...formData, [e.target.name]: !formData[e.target.name] });
   };

   const onSkillCheckBoxChangeHandler = (dataKey: string) => {
      setFormData({ ...formData, [dataKey]: !formData[dataKey] });
   }

   const OpenToCheckBox: React.FC<{ dataKey: string, text: string }> = ({ dataKey, text }) => {
      return (
         <Checkbox
            p={1}
            isChecked={formData[dataKey]}
            name={dataKey}
            onChange={onBooleanChangeHandler}
         >{text}
         </Checkbox>
      )
   }

   const SkillCheckBox: React.FC<{
      dataKey: string,
      skill_text: string
   }> = ({ dataKey, skill_text }) => {
      return (
         <GridItem h={'50px'} onClick={() => onSkillCheckBoxChangeHandler(dataKey)}>
            <Center
               borderWidth={'1px'}
               borderRadius='md'
               overflow={'hidden'}
               borderColor='blue.300'
               w={'100%'}
               h={'100%'}
               bg={formData[dataKey] ? 'blue.300' : 'white'}
               _hover={{ cursor: "pointer" }}
            >
               <Text
                  color={formData[dataKey] ? 'white' : 'blue.300'}
                  fontSize={'md'}
                  fontWeight={'medium'}
               >{skill_text}</Text>
            </Center>
         </GridItem >
      );
   };

   const [isLargerThan1280] = useMediaQuery('(min-width: 1290px)')

   return (
      <Stack direction={isLargerThan1280 ? 'row' : 'column'} maxW={'100%'}>
         <Stack direction={'column'} py={10} w={isLargerThan1280 ? '60%' : '100%'}>
            <form onSubmit={onSubmitHandler}>
               <Flex direction={'column'} fontWeight='bold'>
                  <FormControl isRequired maxW={'400px'} p={3}>
                     <FormLabel fontWeight={'bold'}>Name</FormLabel>
                     <Input
                        value={formData.profile_name}
                        name='profile_name'
                        placeholder='Gavin Belson or ethtomato'
                        onChange={(e) => onChangeHandler(e)}
                     />
                  </FormControl>
                  <FormControl isRequired p={3}>
                     <FormLabel fontWeight={'bold'}>Choose a profile handle (your profile url)</FormLabel>
                     <Input
                        value={formData.handle}
                        placeholder='handle'
                        name='handle'
                        onChange={(e) => onChangeHandler(e)}
                     />
                     {/* <Input placeholder='Community Manager @ Hooli Protocol' /> */}
                  </FormControl>
                  <FormControl p={3}>
                     <FormLabel fontWeight={'bold'}>Bio & what you are looking for</FormLabel>
                     <Textarea
                        value={formData.bio}
                        name='bio'
                        onChange={(e) => onChangeHandler(e)}
                     />
                  </FormControl>
                  <Flex direction={'column'} maxW={'400px'}>
                     <OpenToCheckBox dataKey='hiring' text="I'm hiring" />
                     <OpenToCheckBox dataKey='open_to_work' text="Open to work" />
                     <OpenToCheckBox dataKey='open_to_cofounder_matching' text="Cofounder searching" />
                     <OpenToCheckBox dataKey='open_to_product_feedback' text="Looking for feedback on my product" />
                     <OpenToCheckBox dataKey='fundraising' text="Fundraising" />
                     <OpenToCheckBox dataKey='open_to_invest' text="Want to invest" />
                     <OpenToCheckBox dataKey='on_core_team' text="I'm on a web3 core team" />
                  </Flex>
                  <Flex direction={'column'} py={3}>
                     <Text fontSize={'xl'} py={4}>What are your super powers? (up to 3)</Text>
                     <Grid templateColumns={isLargerThan1280 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'} gap={3}>
                        <SkillCheckBox dataKey='skill_founder' skill_text='Founder' />
                        <SkillCheckBox dataKey='skill_frontend_eng' skill_text='Frontend Eng' />
                        <SkillCheckBox dataKey='skill_backend_eng' skill_text='Backend Eng' />
                        <SkillCheckBox dataKey='skill_fullstack_eng' skill_text='Full Stack Eng' />
                        <SkillCheckBox dataKey='skill_blockchain_eng' skill_text='Blockchain Dev' />
                        <SkillCheckBox dataKey='skill_data_eng' skill_text='Data Eng' />
                        <SkillCheckBox dataKey='skill_game_dev' skill_text='Game Dev' />
                        <SkillCheckBox dataKey='skill_dev_ops' skill_text='Dev Ops' />
                        <SkillCheckBox dataKey='skill_product_manager' skill_text='Product Manager' />
                        <SkillCheckBox dataKey='skill_product_designer' skill_text='Product Designer' />
                        <SkillCheckBox dataKey='skill_token_designer' skill_text='Token Designer' />
                        <SkillCheckBox dataKey='skill_technical_writer' skill_text='Technical Writer' />
                        <SkillCheckBox dataKey='skill_people_connector' skill_text='People Connector' />
                        <SkillCheckBox dataKey='skill_community_manager'
                           skill_text={isLargerThan1280 ? 'Community Manager' : 'Community Mgr.'} />
                        <SkillCheckBox dataKey='skill_marketing_growth' skill_text='Marketing/Growth' />
                        <SkillCheckBox dataKey='skill_developer_relations' skill_text='Developer Relations' />
                        <SkillCheckBox dataKey='skill_influencer_relations' skill_text='Influencer relations' />
                        <SkillCheckBox dataKey='skill_investor_relations' skill_text='Investor relations' />
                     </Grid>
                  </Flex>
                  <Button
                     colorScheme='blue'
                     type='submit'
                     w={100}
                     mt={3}
                  >Save</Button>
               </Flex>
            </form>
         </Stack>
         <Stack direction={'column'} p={5} w={isLargerThan1280 ? '40%' : '100%'}>
            <Text fontSize={'lg'} fontWeight='bold'>Profile Preview</Text>
            <MemberProfileCard user_profile={formData} />
         </Stack>

      </Stack >
   )
}

export default User

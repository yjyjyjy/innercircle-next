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
   FormErrorMessage,
} from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import { user_profile } from '@prisma/client'
import {
   createContext,
   Dispatch,
   SetStateAction,
   useContext,
   useState,
} from 'react'
import MemberProfileCard, {
   UserProfileWithMetaData,
} from '../../components/profile/MemberProfileCard'
import { ESession } from '../index'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'

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
         // user_profile:
         user_profile: {
            include: {
               user_profile_to_conference_mapping: {
                  include: {
                     conference: true,
                  },
               },
               connection_connection_user_profile_startTouser_profile: true,
               connection_request_connection_request_requested_idTouser_profile:
                  true,
            },
         },
      },
   })

   return {
      props: {
         user: JSON.parse(JSON.stringify(user)),
      },
   }
}

interface formikContext {
   setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
   ) => void
   values: user_profile
}

const FormContext = createContext<formikContext>({
   setFieldValue: () => null,
   values: {} as user_profile,
})

const MyProfile = ({ user }) => {
   const { user_profile } = user
   const router = useRouter()
   const toast = useToast()

   const createOrUpdateUserProfile = async (formData) => {
      const userProfileToUpload = formData
      // delete addtional information before pushing to the backend.
      delete userProfileToUpload.user_profile_to_conference_mapping

      const res = await fetch('/api/profile', {
         method: 'POST',
         body: JSON.stringify(userProfileToUpload),
      })
      const { message } = await res.json()
      toast({
         title: message,
         status: res.status === 200 ? 'success' : 'error',
         duration: 4000,
         isClosable: true,
      })
      router.push('/')
   }

   const OpenToCheckBox: React.FC<{ dataKey: string; text: string }> = ({
      dataKey,
      text,
   }) => {
      const { values, setFieldValue } = useContext(FormContext)
      return (
         <Checkbox
            p={1}
            name={dataKey}
            onChange={() => {
               const selectedLabel = Object.keys(values).filter(
                  (dataKey) =>
                     dataKey.startsWith('label_') &&
                     values[`${dataKey}`] === true
               )
               //If trying to add new label
               if (selectedLabel.length < 5 && !values[`${dataKey}`]) {
                  setFieldValue(dataKey, true)
               }
               //If trying to de-select a label
               else if (values[`${dataKey}`]) {
                  setFieldValue(dataKey, false)
               }
            }}
            isChecked={values[`${dataKey}`]}
         >
            {text}
         </Checkbox>
      )
   }

   const initialValues = {
      profile_name: user_profile?.profile_name
         ? user_profile.profile_name
         : user.name
            ? user.name
            : '',
      handle: user_profile?.handle,
      bio_short: user_profile?.bio_short,
      bio: user_profile?.bio,
      linkedin: user_profile?.linkedin,
      twitter: user_profile?.twitter,
      profile_picture: user_profile?.profile_picture,

      skill_artist: user_profile?.skill_artist,
      skill_backend_eng: user_profile?.skill_backend_eng,
      skill_blockchain_eng: user_profile?.skill_blockchain_eng,
      skill_business_development: user_profile?.skill_business_development,
      skill_community_manager: user_profile?.skill_community_manager,
      skill_data_eng: user_profile?.skill_data_eng,
      skill_data_science: user_profile?.skill_data_science,
      skill_dev_ops: user_profile?.skill_dev_ops,
      skill_developer_relations: user_profile?.skill_developer_relations,
      skill_founder: user_profile?.skill_founder,
      skill_frontend_eng: user_profile?.skill_frontend_eng,
      skill_fullstack_eng: user_profile?.skill_fullstack_eng,
      skill_game_dev: user_profile?.skill_game_dev,
      skill_hareware_dev: user_profile?.skill_hareware_dev,
      skill_i_bring_capital: user_profile?.skill_i_bring_capital,
      skill_influencer_relations: user_profile?.skill_influencer_relations,
      skill_investor_relations: user_profile?.skill_investor_relations,
      skill_marketing_growth: user_profile?.skill_marketing_growth,
      skill_product_designer: user_profile?.skill_product_designer,
      skill_product_manager: user_profile?.skill_product_manager,
      skill_social_media_influencer:
         user_profile?.skill_social_media_influencer,
      skill_technical_writer: user_profile?.skill_technical_writer,
      skill_token_designer: user_profile?.skill_token_designer,
      skill_web3_domain_expert: user_profile?.skill_web3_domain_expert,

      label_fundraising: user_profile?.label_fundraising,
      label_hiring: user_profile?.label_hiring,
      label_need_product_feedback: user_profile?.label_need_product_feedback,
      label_on_core_team: user_profile?.label_on_core_team,
      label_open_to_cofounder_matching:
         user_profile?.label_open_to_cofounder_matching,
      label_open_to_discover_new_project:
         user_profile?.label_open_to_discover_new_project,
      label_open_to_invest: user_profile?.label_open_to_invest,
      label_open_to_work: user_profile?.label_open_to_work,
      label_text_hiring: user_profile?.label_text_hiring,
      label_text_open_to_discover_new_project:
         user_profile?.label_text_open_to_discover_new_project,
      label_text_open_to_work: user_profile?.label_text_open_to_work,
      user_profile_to_conference_mapping:
         user_profile?.user_profile_to_conference_mapping,
   } as UserProfileWithMetaData

   const [formData, setFormData] =
      useState<UserProfileWithMetaData>(initialValues)

   const [isLargerThan600] = useMediaQuery('(min-width: 600px)')

   const validateFields = (values: user_profile) => {
      const errors = {}
      if (!values.handle?.match(/^[a-zA-Z0-9_]*$/)) {
         errors['handle'] = 'Handle can only contain a-z A-Z 0-9 or _'
      }
      if (values.handle?.length > 20) {
         errors['handle'] = 'Handle must be no more than 20 characters'
      }
      if (values.handle?.length < 3) {
         errors['handle'] = 'Handle must be at least 3 characters long'
      }
      if (values.profile_name?.length < 3) {
         errors['profile_name'] =
            'Profile name must be at least 3 characters long'
      }
      if (values.profile_name?.length > 20) {
         errors['profile_name'] =
            'Profile name must be no more than 20 characters long'
      }
      if (values.bio_short && values.bio_short.length > 70) {
         errors['bio_short'] =
            'Short bio exceeded max length limit of 70 characters'
      }
      if (values.bio && values.bio.length > 400) {
         errors['bio'] = 'Bio exceeded max length limit of 400 characters'
      }
      return errors
   }

   return (
      <Stack direction={isLargerThan600 ? 'row' : 'column'} maxW={'100%'}>
         <Stack
            direction={'column'}
            py={10}
            w={isLargerThan600 ? '60%' : '100%'}
         >
            <Formik
               onSubmit={(values, actions) => {
                  setTimeout(async () => {
                     await createOrUpdateUserProfile(values)
                     actions.setSubmitting(false)
                  }, 5000)
               }}
               initialValues={initialValues}
               validate={(values) => {
                  setFormData(values)
                  return validateFields(values)
               }}
               validateOnChange
            >
               {({ isSubmitting, setFieldValue, values }) => (
                  <FormContext.Provider
                     value={{ setFieldValue: setFieldValue, values: values }}
                  >
                     <Form>
                        <Flex direction={'column'} fontWeight="bold">
                           <Field name="profile_name">
                              {({ field, form }) => (
                                 <FormControl
                                    isRequired
                                    isInvalid={!!form.errors.profile_name}
                                    maxW={'450px'}
                                    pt={3}
                                 >
                                    <FormLabel
                                       fontSize={'lg'}
                                       fontWeight={'bold'}
                                    >
                                       Name
                                    </FormLabel>
                                    <Input
                                       placeholder="Gavin Belson or ethtomato"
                                       {...field}
                                       id="profile_name"
                                    />
                                    <FormErrorMessage>
                                       {form.errors.profile_name}
                                    </FormErrorMessage>
                                 </FormControl>
                              )}
                           </Field>
                           <Field name="handle">
                              {({ field, form }) => (
                                 <FormControl
                                    isRequired
                                    isInvalid={!!form.errors.handle}
                                    maxW={'450px'}
                                    pt={3}
                                 >
                                    <FormLabel
                                       fontSize={'lg'}
                                       fontWeight={'bold'}
                                    >
                                       Choose a profile handle (your profile
                                       url)
                                    </FormLabel>
                                    <Input placeholder="handle" {...field} />
                                    <FormErrorMessage>
                                       {form.errors.handle}
                                    </FormErrorMessage>
                                 </FormControl>
                              )}
                           </Field>
                           <Field name="bio_short">
                              {({ field, form }) => (
                                 <FormControl
                                    isRequired
                                    isInvalid={!!form.errors.bio_short}
                                    maxW={'450px'}
                                    pt={3}
                                 >
                                    <FormLabel
                                       fontSize={'lg'}
                                       fontWeight={'bold'}
                                    >
                                       Your one-liner intro
                                    </FormLabel>
                                    <Input name="bio_short" {...field} />
                                    <FormErrorMessage>
                                       {form.errors.bio_short}
                                    </FormErrorMessage>
                                 </FormControl>
                              )}
                           </Field>
                           <Field name="bio">
                              {({ field, form }) => (
                                 <FormControl
                                    isInvalid={!!form.errors.bio}
                                    pt={3}
                                 >
                                    <FormLabel
                                       fontSize={'lg'}
                                       fontWeight={'bold'}
                                    >
                                       Bio & what you are looking for
                                    </FormLabel>
                                    <Textarea name="bio" {...field} />
                                    <FormErrorMessage>
                                       {form.errors.bio}
                                    </FormErrorMessage>
                                 </FormControl>
                              )}
                           </Field>
                           <Flex direction={'column'} maxW={'400px'}>
                              <Text fontSize={'lg'} fontWeight="bold" py={4}>
                                 How innerCircle community can help you? (up to
                                 5)
                              </Text>

                              <OpenToCheckBox
                                 dataKey="label_hiring"
                                 text="I'm hiring"
                              />
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
                                 What are your super powers? (Please select up
                                 to 5)
                              </Text>
                              <Grid
                                 templateColumns={
                                    isLargerThan600
                                       ? 'repeat(3, 1fr)'
                                       : 'repeat(2, 1fr)'
                                 }
                                 gap={3}
                              >
                                 <SkillCheckBox
                                    dataKey="skill_founder"
                                    skill_text="Founder"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_web3_domain_expert"
                                    skill_text="Web3 Domain Expert"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_artist"
                                    skill_text="Artist"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_frontend_eng"
                                    skill_text="Frontend Eng"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_backend_eng"
                                    skill_text="Backend Eng"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_fullstack_eng"
                                    skill_text="Full Stack Eng"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_blockchain_eng"
                                    skill_text="Blockchain Dev"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_data_eng"
                                    skill_text="Data Eng"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_data_science"
                                    skill_text="Data Scientist"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_game_dev"
                                    skill_text="Game Dev"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_dev_ops"
                                    skill_text="Dev Ops"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_product_manager"
                                    skill_text="Product Manager"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_product_designer"
                                    skill_text="Product Designer"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_token_designer"
                                    skill_text="Token Designer"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_technical_writer"
                                    skill_text="Technical Writer"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_social_media_influencer"
                                    skill_text="Influencer (w/ audience)"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_i_bring_capital"
                                    skill_text="I bring capital"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_community_manager"
                                    skill_text={
                                       isLargerThan600
                                          ? 'Community Manager'
                                          : 'Community Mgr.'
                                    }
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_marketing_growth"
                                    skill_text="Marketing/Growth"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_business_development"
                                    skill_text="Biz Development"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_developer_relations"
                                    skill_text="Developer Relations"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_influencer_relations"
                                    skill_text="Influencer relations"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                                 <SkillCheckBox
                                    dataKey="skill_investor_relations"
                                    skill_text="Investor relations"
                                    formData={formData}
                                    setFormData={setFormData}
                                 />
                              </Grid>
                           </Flex>
                           <Button
                              mt={4}
                              colorScheme="blue"
                              isLoading={isSubmitting}
                              type="submit"
                              bg={'cyan.400'}
                              w={100}
                           >
                              Save
                           </Button>
                        </Flex>
                     </Form>
                  </FormContext.Provider>
               )}
            </Formik>
         </Stack>
         <Stack
            direction={'column'}
            p={5}
            w={isLargerThan600 ? '40%' : '100%'}
         >
            <Text fontSize={'lg'} fontWeight="bold">
               Profile Preview
            </Text>
            <MemberProfileCard userProfile={formData} mini={isLargerThan600 ? false : true} />
         </Stack>
      </Stack>
   )
}

const SkillCheckBox: React.FC<{
   dataKey: string
   skill_text: string
   colorTheme?: string
   formData: UserProfileWithMetaData
   setFormData: Dispatch<SetStateAction<UserProfileWithMetaData>>
}> = ({ dataKey, skill_text, colorTheme = 'blue' }) => {
   const { setFieldValue, values } = useContext(FormContext)
   return (
      <GridItem
         h={'50px'}
         onClick={() => {
            const selectedSkills = Object.keys(values).filter(
               (dataKey) =>
                  dataKey.startsWith('skill_') && values[`${dataKey}`] === true
            )
            //If trying to add new skill
            if (selectedSkills.length < 5 && !values[`${dataKey}`]) {
               setFieldValue(dataKey, true)
            }
            //If trying to de-select a label
            else if (values[`${dataKey}`]) {
               setFieldValue(dataKey, false)
            }
         }}
      >
         <Center
            borderWidth={'1px'}
            borderRadius="md"
            overflow={'hidden'}
            borderColor={colorTheme + '.300'}
            w={'100%'}
            h={'100%'}
            bg={values[`${dataKey}`] ? colorTheme + '.300' : 'white'}
            _hover={{
               cursor: 'pointer',
               bg: colorTheme + '.100',
            }}
         >
            <Text
               color={values[`${dataKey}`] ? 'White' : colorTheme + '.300'}
               fontSize={'md'}
               fontWeight={'medium'}
            >
               {skill_text}
            </Text>
         </Center>
      </GridItem>
   )
}

export default MyProfile

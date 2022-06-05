import { Flex, Text, Stack, Heading, FormControl, FormLabel, Input, Textarea, Button } from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import ProfilePicture from '../../components/profile/ProfilePicture'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { User, user_profile as UserProfile } from '@prisma/client'
import default_gray from '../../public/default_gray.png'
import { useEffect, useState } from 'react'

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

   interface IFormData {
      profile_name: string,
      handle: string,
      bio: string;
   }

   const formName = user_profile?.profile_name ? user_profile.profile_name : name ? name : ''
   const formHandle = user_profile?.handle ? user_profile.handle : ''
   const formBio = user_profile?.bio ? user_profile.bio : ''

   const [formData, setFormData] = useState<IFormData>({
      profile_name: formName,
      handle: formHandle,
      bio: formBio
   })

   const onSubmitHandler = (e) => {
      e.preventDefault();
      createOrUpdateUserProfile(formData);
   }

   const createOrUpdateUserProfile = (formData) => {
      let type = user_profile ? 'update' : 'create'

      fetch('/api/profile', {
         method: 'POST',
         body: JSON.stringify(formData),
         headers: {
            type: type
         }
      })
         .then((res) => res.json())
         .then((data) => {
            console.log(data)
         })
   }

   const onChangeHandler = (e) => {
      console.log('here', e.target.name)
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   return (
      <Stack direction={'row'} maxW={'100%'}>
         <Stack direction={'column'} p={10} w='65%'>
            <form onSubmit={onSubmitHandler}>
               <FormControl isRequired maxW={'400px'} p={3}>
                  <FormLabel>Name</FormLabel>
                  <Input
                     value={formData.profile_name}
                     name='profile_name'
                     placeholder='Gavin Belson or ethtomato'
                     onChange={(e) => onChangeHandler(e)}
                  />
               </FormControl>
               <FormControl isRequired p={3}>
                  <FormLabel>Choose a handle</FormLabel>
                  <Input
                     value={formData.handle}
                     placeholder='handle'
                     name='handle'
                     onChange={(e) => onChangeHandler(e)}
                  />
                  {/* <Input placeholder='Community Manager @ Hooli Protocol' /> */}
               </FormControl>
               <FormControl p={3}>
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                     value={formData.bio}
                     name='bio'
                     onChange={(e) => onChangeHandler(e)}
                  />
               </FormControl>
               <Button
                  colorScheme='blue'
                  type='submit'
               >Save</Button>
            </form>
         </Stack>
         <Stack direction={'column'} p={5} w='35%' bg='blue.100'>
            <ProfilePicture image_url={image ? image : 'https://en.gravatar.com/userimage/67165895/bd41f3f601291d2f313b1d8eec9f8a4d.jpg?size=200'} />
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

      </Stack >
   )
}

export default User

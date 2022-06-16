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
import { getSession } from 'next-auth/react'

import { User, user_profile as UserProfile } from '@prisma/client'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import MemberProfileCard, { UserProfileWithConferences } from '../../components/profile/MemberProfileCard'
import { ESession } from '../index'
import { Field, Form, Formik } from 'formik'

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
      user_profile: {
        include: {
          connection_request_connection_request_requested_idTouser_profile: {
            include: {
              user_profile_connection_request_requested_idTouser_profile: {
                select: {
                  profile_name: true,
                  bio_short: true,
                  profile_picture: true,
                }
              }
            }
          }
        }
      },
    },
  })

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  }
}

export default function ({ user }) {
  const { user_profile } = user
  console.log(user_profile)

  const toast = useToast()

  const createOrUpdateUserProfile = async (formData) => {
    const userProfileToUpload = formData
    // need to delete addtional information before pushing to the backend.
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
  }

  const [isLargerThan1280] = useMediaQuery('(min-width: 1290px)')

  return (
    <Flex direction={'column'}>
      {user_profile.connection_request_connection_request_requested_idTouser_profile.map(r => (
        <>{r.initiator_id}</>
      ))}
    </Flex>
  )
}



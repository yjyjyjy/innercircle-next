import {
  Flex,
  Text,
  Button,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/react'

import {
  useState,
} from 'react'
import { ESession } from '../index'
import { useRouter } from 'next/router'

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
            where: {
              confirmed_at: null,
              rejected_at: null
            },
            include: {
              user_profile_connection_request_requested_idTouser_profile: {
                select: {
                  id: true,
                  profile_name: true,
                  bio_short: true,
                  profile_picture: true,
                  handle: true,
                }
              }
            }
          },
          connection_connection_user_profile_startTouser_profile: {
            include: {
              user_profile_connection_user_profile_endTouser_profile: {
                select: {
                  id: true,
                  profile_name: true,
                  bio_short: true,
                  profile_picture: true,
                  handle: true,
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
  const toast = useToast()
  const router = useRouter()
  const [state, setState] = useState({
    connectionRequests: user_profile.connection_request_connection_request_requested_idTouser_profile,
    connections: user_profile.connection_connection_user_profile_startTouser_profile
  })

  const onConnectionRequestDecisionHandler = async (userProfileId: Number, decision: string, connectionRequest) => {
    const res = await fetch('/api/connection', {
      method: 'PATCH',
      body: JSON.stringify({
        targetUserProfileId: userProfileId,
        requestedOperation: decision,
      }),
    })
    const { message } = await res.json()
    toast({
      title: message,
      status: res.status === 200 ? 'success' : 'error',
      duration: 4000,
      isClosable: true,
    })
    if (res.status === 200) {
      setState({ ...state, connectionRequests: state.connectionRequests.filter(r => r.initiator_id !== userProfileId) })
    }
  }

  const ListViewMiniProfile = ({ handle, profile_name, bio_short }) => (
    <Flex
      direction={'column'}
      _hover={{ cursor: 'pointer' }}
      onClick={
        () => router.push(`/in/${handle}`)
      }>
      <Text>{profile_name}</Text>
      <Text>{bio_short}</Text>
    </Flex>
  )


  const [isLargerThan1280] = useMediaQuery('(min-width: 1290px)')
  return (

    <Flex direction={'column'}>
      {state.connectionRequests.length > 0 &&
        <Flex direction={'column'} w={isLargerThan1280 ? '70%' : '100%'} m={'0 auto'}>
          <Text fontSize={'lg'} fontWeight='bold' py={3}>Connection Requests</Text>
          {state.connectionRequests.map(r => (
            <Flex
              key={r.initiator_id}
              direction={'row'}
              justifyContent={'space-between'}
              bg='gray.50'
              m={2}
              p={3}
              rounded='md'
            >
              <ListViewMiniProfile
                handle={r.user_profile_connection_request_requested_idTouser_profile.handle}
                profile_name={r.user_profile_connection_request_requested_idTouser_profile.profile_name}
                bio_short={r.user_profile_connection_request_requested_idTouser_profile.bio_short}
              />
              <Flex direction={'row'} transform="translateY(10%)">
                <Button variant={'ghost'} onClick={() => onConnectionRequestDecisionHandler(r.initiator_id, 'reject', r)}>Ignore</Button>
                <Button colorScheme={'blue'} rounded={'3xl'} onClick={() => onConnectionRequestDecisionHandler(r.initiator_id, 'accept', r)}>Accept</Button>
              </Flex>
            </Flex>
          ))}
        </Flex>
      }
      <Flex direction={'column'}>
        <Flex>

        </Flex>
      </Flex>
    </Flex>
  )
}



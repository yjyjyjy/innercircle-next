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
import MemberProfileListItem from '../../components/profile/MemberProfileListItem'

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
              user_profile_connection_request_initiator_idTouser_profile: {
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
    connectionRequesters:
      user_profile.connection_request_connection_request_requested_idTouser_profile.map(
        item => item.user_profile_connection_request_initiator_idTouser_profile
      ),
    connections: user_profile.connection_connection_user_profile_startTouser_profile.map(item => item.user_profile_connection_user_profile_endTouser_profile)
  })
  console.log(user_profile)

  const onConnectionRequestDecisionHandler = async (
    userProfileId: Number,
    decision: string,
    profile: { id: Number, profile_name: string, bio_short: string, profile_picture: string }
  ) => {
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
      // setState twice in a row won't work. below is a workaround: https://typeofnan.dev/why-you-cant-setstate-multiple-times-in-a-row/
      let newState = {
        ...state,
        connectionRequesters: state.connectionRequesters.filter(r => r.id !== userProfileId),
      }
      if (decision === 'accept') {
        newState = {
          ...newState,
          connections: [...newState.connections, profile]
        }
      }
      setState(newState)
    }

  }

  const [isLargeScreen] = useMediaQuery('(min-width: 700px)')
  console.log(state)
  return (

    <Flex direction={'column'}>
      {/* Conneciton requests */}
      {state.connectionRequesters.length > 0 &&
        <Flex direction={'column'} w={isLargeScreen ? '70%' : '100%'} m={'0 auto'}>
          <Text fontSize={'xl'} fontWeight='bold' py={3}>Connection Requests</Text>
          {state.connectionRequesters.map(requester => (
            <MemberProfileListItem
              user_profile={requester}
              primaryLabel={'Accept'}
              primaryOnClick={() => onConnectionRequestDecisionHandler(requester.id, 'accept', requester)}
              secondaryLabel={'Ignore'}
              secondaryOnClick={() => onConnectionRequestDecisionHandler(requester.id, 'reject', requester)} />
          ))}
        </Flex>
      }

      {/* Connecitons */}
      <Flex direction={'column'} w={isLargeScreen ? '70%' : '100%'} m={'0 auto'}>
        <Text fontSize={'xl'} fontWeight='bold' py={3}>Your Connections</Text>
        <Flex direction={'column'}>
          {state.connections.map(con => (
            <MemberProfileListItem
              user_profile={con}
              primaryLabel={'Message'}
              primaryOnClick={async () => {
                const res = await fetch('/api/mail', {
                  method: 'POST'
                })
                console.log(res)
              }}
            />
          ))}

        </Flex>
      </Flex>
    </Flex>
  )
}



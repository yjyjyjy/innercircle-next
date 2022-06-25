import {
  Flex,
  Text,
  Button,
  useMediaQuery,
  useToast,
  Divider,
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
              rejected_at: null,
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
              },
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

const Network =  ({ user }) =>{
  const { user_profile } = user
  const toast = useToast()
  const router = useRouter()
  const [state, setState] = useState({
    connectionRequesters:
      user_profile.connection_request_connection_request_requested_idTouser_profile.map(
        item => {
          let r = item.user_profile_connection_request_initiator_idTouser_profile
          r['invitationMessage'] = item.invitation_message
          return r
        }
      ),
    connections: user_profile.connection_connection_user_profile_startTouser_profile.map(item => item.user_profile_connection_user_profile_endTouser_profile)
  })


  const onConnectionRequestDecisionHandler = async (
    targetUserProfileId: Number,
    decision: string,
    profile: { id: Number, profile_name: string, bio_short: string, profile_picture: string }
  ) => {
    const res = await fetch('/api/connection', {
      method: 'PATCH',
      body: JSON.stringify({
        targetUserProfileId: targetUserProfileId,
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
        connectionRequesters: state.connectionRequesters.filter(r => r.id !== targetUserProfileId),
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

  return (

    <Flex direction={'column'}>
      {/* Conneciton requests */}
      {state.connectionRequesters.length > 0 &&
        <Flex direction={'column'} w={isLargeScreen ? '70%' : '100%'} m={'0 auto'}>
          <Text fontSize={'xl'} fontWeight='bold' py={3}>Connection Requests</Text>
          {state.connectionRequesters.map((requester, idx) => (
            <MemberProfileListItem
              key={idx}
              user_profile={requester}
              message={requester.invitationMessage}
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
        <Divider />
        {!state.connections || state.connections.length === 0 &&
          <Text
            py={10}
            align={'center'}
          >You don<code>&apos;</code>t have any connection yet.<br />Find more connection in the Discover section</Text>
        }
        <Flex direction={'column'}>
          {state.connections.map((con, idx) => (
            <MemberProfileListItem
              key={idx}
              user_profile={con}
              primaryLabel={'Message'}
              primaryOnClick={() => { }}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Network;


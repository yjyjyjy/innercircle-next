import { Flex, Button, Text, useToast, TableContainer, Table, Tbody, Thead, Th, Tr, Td, Switch, useMediaQuery } from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import { useEffect, useRef, useState } from 'react'
import { ESession } from '../index'
import { getSession } from 'next-auth/react'
import { FiExternalLink } from 'react-icons/fi'
import * as _ from 'lodash';
var structuredClone = require('realistic-structured-clone');


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
               user_profile_to_conference_mapping: true,
            },
         },
      },
   })

   const conferences = await prisma.conference.findMany({
      where: {
         AND: [
            { end_date: { gte: new Date() } },
         ]
      },
      orderBy: [
         { start_date: 'asc' },
         { conference_name: 'asc' }
      ]
   })

   return {
      props: {
         user: JSON.parse(JSON.stringify(user)),
         conferences: JSON.parse(JSON.stringify(conferences)),
      },
   }
}

const MyConferences = ({ user, conferences }) => {
   const { user_profile: userProfile } = user
   const toast = useToast()
   const [isLargeScreen] = useMediaQuery('(min-width: 651px)')

   // confState is an array of the conferences that the user is going. This is the init value.
   let initConfState = {}
   conferences.forEach((conf) => {
      initConfState[conf.id] =
         userProfile.user_profile_to_conference_mapping
            .map((m) => m.conference_id)
            .indexOf(conf.id) > -1
   })

   // confState is an array of the conferences that the user is going
   const [confState, setConfState] = useState(initConfState)
   const [testState, setTestState] = useState(0)
   // const [confStateFinal, setConfStateFinal] = useState(initConfState)

   const onSaveHandler = async () => {
      const res = await fetch('/api/my_conferences', {
         method: 'PATCH',
         body: JSON.stringify(confState),
      })
      const { message } = await res.json()
      toast({
         title: message,
         status: res.status === 200 ? 'success' : 'error',
         duration: 4000,
         isClosable: true,
      })
   }

   const tempData = useRef(structuredClone(confState))

   useEffect(() => {
      const interval = setInterval(() => {
         console.log('This will be called every 2 seconds');
         if (_.isEqual(tempData.current, confState)) {
            console.log('SAME')
            return
         } else {
            console.log('DIFFERENT')
            onSaveHandler()
            tempData.current = structuredClone(confState)
         }
      }, 1000);

      return () => clearInterval(interval);
   });

   return (
      <Flex direction={'column'}>
         <TableContainer
            overflowX={'auto'}
         >
            <Table
               variant='striped'
               size={["sm", "md"]}
            >
               <Thead>
                  <Tr>
                     <Th>Going</Th>
                     <Th>Start</Th>
                     <Th>Conference</Th>
                     <Th>Location</Th>
                  </Tr>
               </Thead>
               <Tbody>
                  {conferences.map((conf) => (
                     <Tr key={conf.id}>
                        <Td>
                           <Switch
                              isChecked={confState[conf.id]}
                              onChange={async () => {
                                 console.log(conf.id)
                                 console.log(confState[conf.id])
                                 let newState = { ...confState }
                                 newState[conf.id] = !newState[conf.id]
                                 setConfState(newState)
                                 setTestState(prevState => prevState + 1)
                                 console.log(testState)
                              }}
                           />
                        </Td>
                        <Td>{isLargeScreen ? conf.start_date.substr(0, 10) : conf.start_date.substr(5, 5)}</Td>
                        <Td>
                           <a
                              href={conf.website}
                              target={'_blank'}
                              rel="noreferrer"
                           >
                              <Flex
                                 direction={'row'}
                                 _hover={{
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    color: 'blue'
                                 }}
                              >
                                 <Text pr={'5px'}>{conf.conference_name}</Text>
                                 <FiExternalLink />
                              </Flex>
                           </a>
                        </Td>
                        <Td>{conf.location}</Td>
                     </Tr>
                  ))}
               </Tbody>
            </Table>
         </TableContainer>
      </Flex >
   )
}

export default MyConferences

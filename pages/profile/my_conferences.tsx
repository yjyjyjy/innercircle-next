import { Flex, Button, useToast } from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/react'
import { useState } from 'react'
import { ESession } from '../index'
import { FilterTag } from '../../components/FilterTag'

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
         end_date: { gte: new Date() },
      },
      orderBy: { end_date: 'asc' },
      take: 50,
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
   console.log(confState)

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
      // router.push('/')
   }

   return (
      <Flex direction={'column'}>
         <Flex direction={'row'}>
            {conferences.map((conf) => (
               <FilterTag
                  key={conf.id}
                  label={conf.conference_name}
                  isChecked={confState[conf.id]}
                  onClick={() => {
                     setConfState((prevState) => {
                        let newState = { ...prevState }
                        newState[conf.id] = !newState[conf.id]
                        return newState
                     })
                  }}
               />
            ))}
         </Flex>
         <Button onClick={onSaveHandler}>Save</Button>
      </Flex>
   )
}

export default MyConferences

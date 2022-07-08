import { Center } from '@chakra-ui/react'
import prisma from '../../lib/prisma'
import { GetServerSideProps } from 'next'
import MemberProfileCard from '../../components/profile/MemberProfileCard'

// server side data fetch
export const getServerSideProps: GetServerSideProps = async (context) => {
   const { handle } = context.query
   console.log('-------------------', handle)
   const user_profile = await prisma.user_profile.findFirst({
      where: {
         handle: {
            equals: handle as string,
            mode: 'insensitive'
         }
      },
   })

   return {
      props: {
         user_profile,
      },
   }
}

const User = ({ user_profile }) => {
   return (
      <Center>
         {user_profile && (
            <MemberProfileCard userProfile={user_profile} mini={false} />
         )}
      </Center>
   )
}

export default User

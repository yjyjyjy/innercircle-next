import { Session, unstable_getServerSession } from 'next-auth'
import UnauthenticatedUser from '../components/UnauthenticatedUser'
import { GetServerSidePropsContext } from 'next'
import { AuthOptions } from './api/auth/[...nextauth]'
import { getSession, useSession } from 'next-auth/react'
import { useEffect } from 'react'

export interface ESession extends Session {
   userID: string
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
   // If you haven't logged in, you can't use the tool yet.
   const session = await unstable_getServerSession(
      context.req,
      context.res,
      AuthOptions
   )
   if (!session) {
      return { props: {} }
   }

   return {
      redirect: {
         permanent: false,
         destination: '/discover/',
      },
      props: {},
   }
}

const Home = () => {
   return <UnauthenticatedUser />
}

export default Home

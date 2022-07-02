import { Session } from 'next-auth'
import UnauthenticatedUser from '../components/UnauthenticatedUser'
import { useSession } from 'next-auth/react'
import Router from 'next/router'
import { useEffect } from 'react'

export interface ESession extends Session {
   userID: string
}

const Entry = () => {
   const session = useSession()
   useEffect(() => {
      if (session.status === 'authenticated') {
         Router.push('/discover')
      } else if (session.status === 'unauthenticated') {
         Router.push('/unauthenticated')
      }
   }, [session.status])
   return <h1>Loading</h1>
}

export default Entry

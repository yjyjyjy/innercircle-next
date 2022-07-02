import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import Router from 'next/router'
import { useEffect } from 'react'
import Spinner from '../components/Spinner'

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
   return <Spinner />
}

export default Entry

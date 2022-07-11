import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import Router from 'next/router'
import Spinner from '../components/Spinner'
import UnauthenticatedUserView from '../components/UnauthenticatedUserView'

export interface ESession extends Session {
   userID: string
}

// export async function getStaticProps() {
//    return {
//       props: {}, // will be passed to the page component as props
//    }
// }

const Entry = () => {
   const session = useSession()
   if (session.status === 'authenticated') {
      Router.push('/discover')
   }
   if (session.status === 'unauthenticated') {
      return <UnauthenticatedUserView />
   }
   return <Spinner />
}

export default Entry

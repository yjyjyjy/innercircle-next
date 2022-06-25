import React, { useState, useEffect, useContext } from 'react'

// import { Context } from "../context";

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

const ChatEngine = dynamic(() =>
   import('react-chat-engine').then((module) => module.ChatEngine)
)
const MessageFormSocial = dynamic(() =>
   import('react-chat-engine').then((module) => module.MessageFormSocial)
)

const ChatEngine = () => {
   //   const { username, secret } = useContext(Context);
   const [showChat, setShowChat] = useState(false)
   const router = useRouter()

   useEffect(() => {
      if (typeof document !== undefined) {
         setShowChat(true)
      }
   }, [])

   const { data: session, status } = useSession()

   if (status === 'unauthenticated') {
      router.push('/')
   }

   console.log(session)

   if (!showChat) return <div />

   return (
      // <div className="background">
      //     <div className="shadow">
      // <ChatEngine
      //     height="calc(100vh - 212px)"
      //     projectID="b60a6d8b-d377-477e-af88-e47de35b3e89"
      //     userName={'username'}
      //     userSecret={'secret'}
      //     renderNewMessageForm={() => <MessageFormSocial />}
      // />
      <></>
      //     </div>
      // </div>
   )
}

export default ChatEngine

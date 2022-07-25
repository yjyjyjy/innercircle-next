import '@sendbird/uikit-react/dist/index.css'
import ChannelList from '@sendbird/uikit-react/ChannelList'
import SBProvider from '@sendbird/uikit-react/SendbirdProvider'
import '@sendbird/uikit-react/dist/index.css'
import { useSession } from 'next-auth/react'
import { APP_ID } from '../../constants'
import {
   GroupChannelListQuery,
   GroupChannelListQueryParams,
} from '@sendbird/chat/groupChannel'
import { GroupChannelModule } from '@sendbird/chat/groupChannel'

import SendbirdChat from '@sendbird/chat'

const ChatModal = () => {
   const { data } = useSession()
   if (!data || !data.userID) return
   console.log('app id: ', APP_ID)
   console.log('userId: ', data.userID)

   const sb = SendbirdChat.init({
      appId: APP_ID,
      modules: [new GroupChannelModule()],
   })

   const params: GroupChannelListQueryParams = {
      includeEmpty: true,
   }
   const query: GroupChannelListQuery =
      sb.groupChannel.createMyGroupChannelListQuery(params)

   return (
      <div
         style={{
            height: '100vh',
            width: '500px',
            position: 'fixed',
            right: '100px',
         }}
      >
         <SBProvider appId={APP_ID} userId={data.userID}>
            <ChannelList
               queries={{
                  channelListQuery: query,
               }}
            />
         </SBProvider>
      </div>
   )
}

// TODO Add conversation component
// Fix sizing on desktop and mobile
// Remove "Create a group channel" button on header
// Remove option to be able to leave a group channel

export default ChatModal

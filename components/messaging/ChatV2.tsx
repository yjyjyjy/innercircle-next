import '@sendbird/uikit-react/dist/index.css'

import React from 'react'

import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import ChannelList from '@sendbird/uikit-react/ChannelList'
import Channel from '@sendbird/uikit-react/Channel'
import { useSession } from 'next-auth/react'
import { APP_ID } from '../../constants'

function App() {
   const [currentChannelUrl, setCurrentChannelUrl] = React.useState('')
   const { data } = useSession()
   if (!data || !data.userID) return
   console.log('app id: ', APP_ID)
   console.log('userId: ', data.userID)
   return (
      <div className="App">
         <SendbirdProvider
            appId={APP_ID}
            userId={data.userID}
            nickname={data.userID}
         >
            <div className="sendbird-app__channellist-wrap">
               {/* ChannelList has wrong props will fix in 2.0.1
               // @ts-ignore */}
               <ChannelList
                  onChannelSelect={(channel) => {
                     if (channel?.url) {
                        setCurrentChannelUrl(channel.url)
                     }
                  }}
               />
            </div>
            <div className="sendbird-app__conversation-wrap">
               <Channel channelUrl={currentChannelUrl} />
            </div>
         </SendbirdProvider>
      </div>
   )
}

export default App

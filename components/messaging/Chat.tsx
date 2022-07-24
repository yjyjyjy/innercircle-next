import '@sendbird/uikit-react/dist/index.css'
import ChannelListHeader from '@sendbird/uikit-react/ChannelList/components/ChannelListHeader'
import ChannelList from '@sendbird/uikit-react/ChannelList'
import SBProvider from '@sendbird/uikit-react/SendbirdProvider'
import '@sendbird/uikit-react/dist/index.css'

import { useSession } from 'next-auth/react'
import { APP_ID } from '../../constants'

import React, { useState, useCallback } from 'react'

import SBConversation from '@sendbird/uikit-react/Channel'
import SBChannelList from '@sendbird/uikit-react/ChannelList'
import SBChannelSettings from '@sendbird/uikit-react/ChannelSettings'
import withSendBird from '@sendbird/uikit-react/withSendBird'

const ChatModal = () => {
   const { data } = useSession()
   if (!data || !data.userID) return
   console.log('app id: ', APP_ID)
   console.log('userId: ', data.userID)
   return (
      <div
         style={{
            height: '100vh',
            width: '500px',
            position: 'fixed',
            right: '100px',
         }}
      >
         <SBProvider appId={APP_ID} userId={data.userID} nickName="dawd">
            <ChannelList />
         </SBProvider>
      </div>
   )
}

// TODO Add conversation component
// Fix sizing on desktop and mobile
// Remove "Create a group channel" button on header
// Remove option to be able to leave a group channel

// https://github.com/sendbird/sendbird-uikit-react/tree/main/samples/groupchannel

function CustomizedApp(props) {
   // default props
   const {
      stores: { sdkStore, userStore },
      config: {
         isOnline,
         userId,
         appId,
         accessToken,
         theme,
         userListQuery,
         logger,
         pubSub,
      },
   } = props
   const logDefaultProps = useCallback(() => {
      console.log(
         'SDK store list log',
         sdkStore.initialized,
         sdkStore.sdk,
         sdkStore.loading,
         sdkStore.error
      )
      console.log(
         'User store list log',
         userStore.initialized,
         userStore.user,
         userStore.loading
      )
      console.log(
         'Config list log',
         isOnline,
         userId,
         appId,
         accessToken,
         theme,
         userListQuery,
         logger,
         pubSub
      )
   }, [
      sdkStore.initialized,
      sdkStore.sdk,
      sdkStore.loading,
      sdkStore.error,
      userStore.initialized,
      userStore.user,
      userStore.loading,
      isOnline,
      userId,
      appId,
      accessToken,
      theme,
      userListQuery,
      logger,
      pubSub,
   ])
   logDefaultProps()

   // useState
   const [showSettings, setShowSettings] = useState(false)
   const [currentChannelUrl, setCurrentChannelUrl] = useState('')

   return (
      <div className="customized-app">
         <div className="sendbird-app__wrap">
            <div className="sendbird-app__channellist-wrap">
               <SBChannelList
                  onChannelSelect={(channel) => {
                     if (channel && channel.url) {
                        setCurrentChannelUrl(channel.url)
                     }
                  }}
               />
            </div>
            <div className="sendbird-app__conversation-wrap">
               <SBConversation
                  channelUrl={currentChannelUrl}
                  onChatHeaderActionClick={() => {
                     setShowSettings(true)
                  }}
               />
            </div>
         </div>
         {showSettings && (
            <div className="sendbird-app__settingspanel-wrap">
               <SBChannelSettings
                  channelUrl={currentChannelUrl}
                  onCloseClick={() => {
                     setShowSettings(false)
                  }}
               />
            </div>
         )}
      </div>
   )
}

export default ChatModal

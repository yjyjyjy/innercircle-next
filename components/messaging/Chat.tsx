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
import { Channel } from '@sendbird/uikit-react'
import { useState } from 'react'
import { background, Box, Center, Flex } from '@chakra-ui/react'
import { AiOutlineMessage, AiOutlineCloseCircle } from 'react-icons/ai'

const ChatModal = () => {
   const { data } = useSession()
   const [chatShown, setChatShown] = useState(false);
   const [currentChannelUrl, setCurrentChannelUrl] = useState('');

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
      <Box>
         <Box
            visibility={chatShown ? 'visible' : 'hidden'}
            style={{
               background: 'white',
               width: '75%',
               height: '60%',
               position: 'fixed',
               maxWidth: '800px',
               maxHeight: '600px',
               right: '2em',
               bottom: '2em',
               borderRadius: '15px',
               overflow: 'hidden',
               boxShadow: '14px 14px 38px rgba(0,0,0,0.3)',
            }}
         >
            <Box
               height={'40px'}
               width={'100%'}
               background='#1A202C'

            >
               <Box
                  marginLeft={'auto'}
                  marginRight={3}
                  pt={1.5}
                  w={30}
                  onClick={() => setChatShown(!chatShown)}
                  _hover={{
                     cursor: 'pointer'
                  }}
               >
                  <AiOutlineCloseCircle

                     color='white'
                     size={30}
                  />
               </Box>
            </Box>
            <SBProvider appId={APP_ID} userId={data.userID as string}>
               <ChannelList
                  queries={{
                     channelListQuery: query,
                  }}
               />
               <Channel channelUrl={currentChannelUrl} />
            </SBProvider>
         </Box>
         <Center
            position='fixed'
            visibility={chatShown ? 'hidden' : 'visible'}
            right='5em'
            bottom='5em'
            borderRadius={'50%'}
            background='#1A202C'
            width={'100px'}
            height={'100px'}
            boxShadow={'10px 10px 18px rgba(0,0,0,0.4)'}
            _hover={{
               cursor: 'pointer',
               boxShadow: '14px 14px 38px rgba(0,0,0,0.4)',
               background: 'blue.600'
            }}
            onClick={() => setChatShown(!chatShown)}
         >
            <AiOutlineMessage
               color='white'
               size={70}
            />
         </Center>
      </Box >


   )
}

// TODO Add conversation component
// Fix sizing on desktop and mobile
// Remove "Create a group channel" button on header
// Remove option to be able to leave a group channel

export default ChatModal

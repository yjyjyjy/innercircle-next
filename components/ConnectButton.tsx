import React, { useState } from 'react'
import NextLink from 'next/link'
import {
   IconButton,
   Tooltip,
   Box,
   Heading,
   Flex,
   Button,
   Container,
   useMediaQuery,
   ButtonGroup,
   Avatar,
   Link,
   Text,
   Stack,
   Collapse,
   Icon,
   Popover,
   PopoverTrigger,
   PopoverContent,
   useColorModeValue,
   useBreakpointValue,
   useDisclosure,
   Menu,
   MenuList,
   MenuItem,
   MenuButton,
   AvatarBadge,
} from '@chakra-ui/react'
import { SiDiscord } from 'react-icons/si'
import { BsPersonFill } from 'react-icons/bs'
import { useSession, signIn, signOut } from 'next-auth/react'

import {
   HamburgerIcon,
   CloseIcon,
   ChevronDownIcon,
   ChevronRightIcon,
} from '@chakra-ui/icons'
import { useRouter } from 'next/router'

import dynamic from 'next/dynamic'



import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'




const ConnectButton = () => {

   const { data: wagmiData } = useAccount()
   const { connect } = useConnect({
      connector: new InjectedConnector(),
   })
   const { disconnect } = useDisconnect()
   return (
      <>
         {wagmiData ?
            <Flex direction={'row'}>
               Connected to {wagmiData.address?.substring(0, 4)}...{wagmiData.address?.substring(wagmiData.address?.length - 4, wagmiData.address?.length)}
               <Button onClick={() => disconnect()} colorScheme='blue' px={8}>Disconnect</Button>
            </Flex>
            : <Button onClick={() => connect()} colorScheme='blue'>Connect Wallet</Button>
         }
      </>
   )
}
export default ConnectButton

